/**
 * Seal Locator — Server-side template matching for GHS pictogram localization.
 *
 * Uses OpenCV (WASM) for multi-scale template matching against the 9 known GHS
 * reference seal images. This separates LOCALIZATION (CV) from CLASSIFICATION
 * (LLM), following the proven result-enrichment pattern from the multimodal
 * accelerator.
 *
 * Pipeline:
 *   1. Decode & downscale the uploaded product image with sharp
 *   2. For each seal the LLM identified, resize the reference template across
 *      multiple scales and run cv.matchTemplate (TM_CCOEFF_NORMED)
 *   3. Apply Non-Maximum Suppression to remove duplicate detections
 *   4. Return normalized (0-1) bounding boxes + localization status
 */

import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// opencv-wasm is CJS; use createRequire for ESM compat
const require = createRequire(import.meta.url);
const { cv } = require('opencv-wasm');

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ── Configuration ────────────────────────────────────────────────────────────

/** Minimum normalised-cross-correlation score to accept a match. */
const MATCH_THRESHOLD = 0.15;

/**
 * Template scale factors (fraction of the target image's *shorter* side).
 * GHS pictograms on real product labels typically occupy 4 – 20 % of the
 * image width, so we search a generous range.
 */
const SCALE_FACTORS = [
  0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.10,
  0.12, 0.14, 0.17, 0.20, 0.24, 0.30, 0.35, 0.40,
];

/** IoU threshold for Non-Maximum Suppression. */
const NMS_IOU_THRESHOLD = 0.3;

/** Downscale target image so the longest side ≤ this value (pixels). */
const MAX_IMAGE_DIM = 1000;

// ── Seal → reference image mapping ──────────────────────────────────────────

const SEAL_TEMPLATE_FILES = {
  GHS01: 'explosive.png',
  GHS02: 'flammable.png',
  GHS03: 'oxidising.png',
  GHS04: 'gas-under-pressure.png',
  GHS05: 'corrosive.png',
  GHS06: 'acute-toxicity.png',
  GHS07: 'health-hazard.png',
  GHS08: 'serious-health-hazard.png',
  GHS09: 'hazardous-to-environment.png',
};

const TEMPLATES_DIR = resolve(__dirname, 'src/assets/seals-compressed');

// ── Template cache ──────────────────────────────────────────────────────────

/** Cache raw template buffers so we only read from disk once. */
const templateBufferCache = new Map();

async function getTemplateBuffer(sealId) {
  if (templateBufferCache.has(sealId)) return templateBufferCache.get(sealId);

  const filename = SEAL_TEMPLATE_FILES[sealId];
  if (!filename) return null;

  const filepath = resolve(TEMPLATES_DIR, filename);
  const buf = await sharp(filepath)
    .flatten({ background: { r: 255, g: 255, b: 255 } })  // remove alpha
    .png()
    .toBuffer();

  templateBufferCache.set(sealId, buf);
  return buf;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function calculateIoU(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union  = a.width * a.height + b.width * b.height - inter;
  return union > 0 ? inter / union : 0;
}

/** Keep highest-scoring box when two overlap above the IoU threshold. */
function nonMaxSuppression(detections) {
  detections.sort((a, b) => b.score - a.score);
  const kept = [];
  const suppressed = new Set();
  for (let i = 0; i < detections.length; i++) {
    if (suppressed.has(i)) continue;
    kept.push(detections[i]);
    for (let j = i + 1; j < detections.length; j++) {
      if (suppressed.has(j)) continue;
      if (calculateIoU(detections[i].box, detections[j].box) > NMS_IOU_THRESHOLD) {
        suppressed.add(j);
      }
    }
  }
  return kept;
}

/**
 * Build an OpenCV grayscale Mat from a raw { data, info } buffer produced by
 * sharp's .raw() output.
 */
function rawToGrayMat(data, width, height) {
  const mat = new cv.Mat(height, width, cv.CV_8UC1);
  mat.data.set(data);
  return mat;
}

// ── Core API ────────────────────────────────────────────────────────────────

/**
 * Locate seals in a product image via multi-scale template matching.
 *
 * @param {string} imageBase64  data-URL or raw base64 string of the product image
 * @param {string[]} detectedSealIds  e.g. ["GHS01", "GHS05"]
 * @returns {Promise<Array<{ sealId: string, localized: boolean, boundingBox: object|null, matchScore: number }>>}
 */
export async function locateSeals(imageBase64, detectedSealIds) {
  console.log(`\n─── locateSeals called for ${detectedSealIds.length} seal(s): ${detectedSealIds.join(', ')} ───`);

  // ── 1. Decode image ────────────────────────────────────────────────────
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  console.log(`   Image buffer size: ${(imageBuffer.length / 1024).toFixed(0)} KB`);
  const metadata = await sharp(imageBuffer).metadata();
  const origW = metadata.width;
  const origH = metadata.height;
  console.log(`   Original dimensions: ${origW}×${origH}`);

  // ── 2. Downscale for speed ─────────────────────────────────────────────
  const longest = Math.max(origW, origH);
  const scale = longest > MAX_IMAGE_DIM ? MAX_IMAGE_DIM / longest : 1;
  const procW = Math.round(origW * scale);
  const procH = Math.round(origH * scale);
  const shorter = Math.min(procW, procH);
  console.log(`   Processed dimensions: ${procW}×${procH} (scale=${scale.toFixed(3)}, shorter=${shorter})`);

  const { data: targetData } = await sharp(imageBuffer)
    .resize(procW, procH)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const targetGray = rawToGrayMat(targetData, procW, procH);

  // Also build an edge-detected version for a secondary matching pass
  const targetEdges = new cv.Mat();
  cv.Canny(targetGray, targetEdges, 50, 150);

  // ── 3. Match each requested seal ───────────────────────────────────────
  const results = [];

  for (const rawId of detectedSealIds) {
    const sealId = rawId.toUpperCase();
    const templateBuf = await getTemplateBuffer(sealId);

    if (!templateBuf) {
      console.log(`   ⚠️  ${sealId}: No template file found — skipping`);
      results.push({ sealId, localized: false, boundingBox: null, matchScore: 0 });
      continue;
    }

    let bestGray  = { score: 0, box: null, scale: 0 };
    let bestEdge  = { score: 0, box: null, scale: 0 };

    try {
    for (const sf of SCALE_FACTORS) {
      // Template size is a fraction of the image's shorter dimension
      const tplSize = Math.round(shorter * sf);
      if (tplSize < 16 || tplSize >= Math.min(procW, procH)) continue;

      // Resize template to a square of tplSize×tplSize (GHS pictograms are
      // always square / diamond shaped)
      const { data: tplData } = await sharp(templateBuf)
        .resize(tplSize, tplSize, { fit: 'fill' })
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const tplGray = rawToGrayMat(tplData, tplSize, tplSize);
      const tplEdges = new cv.Mat();
      cv.Canny(tplGray, tplEdges, 50, 150);

      // ── Grayscale matching ──
      const resGray = new cv.Mat();
      cv.matchTemplate(targetGray, tplGray, resGray, cv.TM_CCOEFF_NORMED);
      const mmGray = cv.minMaxLoc(resGray);
      if (mmGray.maxVal > bestGray.score) {
        bestGray = {
          score: mmGray.maxVal,
          scale: sf,
          box: {
            x: mmGray.maxLoc.x / procW,
            y: mmGray.maxLoc.y / procH,
            width:  tplSize / procW,
            height: tplSize / procH,
          },
        };
      }

      // ── Edge matching ──
      const resEdge = new cv.Mat();
      cv.matchTemplate(targetEdges, tplEdges, resEdge, cv.TM_CCOEFF_NORMED);
      const mmEdge = cv.minMaxLoc(resEdge);
      if (mmEdge.maxVal > bestEdge.score) {
        bestEdge = {
          score: mmEdge.maxVal,
          scale: sf,
          box: {
            x: mmEdge.maxLoc.x / procW,
            y: mmEdge.maxLoc.y / procH,
            width:  tplSize / procW,
            height: tplSize / procH,
          },
        };
      }

      // Cleanup
      tplGray.delete();
      tplEdges.delete();
      resGray.delete();
      resEdge.delete();
    }

    // Take the better of the two matching strategies
    const best = bestGray.score >= bestEdge.score ? bestGray : bestEdge;
    const bestMethod = bestGray.score >= bestEdge.score ? 'grayscale' : 'edge';

    console.log(`   ${sealId}: bestGray=${bestGray.score.toFixed(3)}@scale=${bestGray.scale} | bestEdge=${bestEdge.score.toFixed(3)}@scale=${bestEdge.scale} → using ${bestMethod} (${best.score.toFixed(3)})`);

    if (best.score >= MATCH_THRESHOLD && best.box) {
      console.log(`   ✅ ${sealId}: LOCALIZED at (${best.box.x.toFixed(3)}, ${best.box.y.toFixed(3)}) size (${best.box.width.toFixed(3)} × ${best.box.height.toFixed(3)})`);
      results.push({
        sealId,
        localized: true,
        boundingBox: best.box,
        matchScore: Math.round(best.score * 100) / 100,
      });
    } else {
      console.log(`   ❌ ${sealId}: NOT localized (best score ${best.score.toFixed(3)} < threshold ${MATCH_THRESHOLD})`);
      results.push({
        sealId,
        localized: false,
        boundingBox: best.box,  // include best-effort box even when below threshold
        matchScore: Math.round(Math.max(bestGray.score, bestEdge.score) * 100) / 100,
      });
    }
    } catch (tplError) {
      console.error(`   💥 ${sealId}: Template matching crashed:`, tplError.message);
      results.push({
        sealId,
        localized: false,
        boundingBox: null,
        matchScore: 0,
      });
    }
  }

  // ── 4. NMS across all matched seals ────────────────────────────────────
  // If two different seal IDs matched the SAME region, keep the higher score
  const localized = results.filter(r => r.localized);
  if (localized.length > 1) {
    const nmsInput = localized.map(r => ({
      sealId: r.sealId,
      score: r.matchScore,
      box: r.boundingBox,
    }));
    const kept = nonMaxSuppression(nmsInput);
    const keptIds = new Set(kept.map(k => k.sealId));
    for (const r of results) {
      if (r.localized && !keptIds.has(r.sealId)) {
        r.localized = false;
        r.boundingBox = null;
      }
    }
  }

  // Cleanup
  targetGray.delete();
  targetEdges.delete();

  return results;
}

/**
 * Pre-load all reference templates into memory and verify OpenCV works.
 * Call once at server startup.
 */
export async function preloadTemplates() {
  console.log('🔍 OpenCV WASM loaded — verifying template matching…');

  for (const sealId of Object.keys(SEAL_TEMPLATE_FILES)) {
    await getTemplateBuffer(sealId);
  }

  console.log(`✅ Pre-loaded ${Object.keys(SEAL_TEMPLATE_FILES).length} GHS seal templates`);
}
