import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sealsDir = path.join(__dirname, '../src/assets/seals');
const outputDir = path.join(__dirname, '../src/assets/seals-compressed');

async function compressSeals() {
  console.log('🖼️  Compressing seal images...\n');
  
  await fs.mkdir(outputDir, { recursive: true });
  
  const files = await fs.readdir(sealsDir);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
  
  for (const file of imageFiles) {
    const inputPath = path.join(sealsDir, file);
    const isGif = /\.gif$/i.test(file);
    const outputPath = path.join(outputDir, file.replace(/\.(png|jpg|jpeg|gif)$/i, isGif ? '.png' : '.jpg'));
    
    const sharpInstance = sharp(inputPath)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true });
    
    // Convert GIF to PNG (preserves transparency), others to JPEG
    if (isGif) {
      await sharpInstance.png({ quality: 90, compressionLevel: 9 }).toFile(outputPath);
    } else {
      await sharpInstance.jpeg({ quality: 85 }).toFile(outputPath);
    }
    
    const originalStat = await fs.stat(inputPath);
    const compressedStat = await fs.stat(outputPath);
    const savings = Math.round((1 - compressedStat.size / originalStat.size) * 100);
    
    console.log(`✅ ${file}: ${(originalStat.size / 1024).toFixed(1)}KB → ${(compressedStat.size / 1024).toFixed(1)}KB (${savings}% smaller)`);
  }
  
  console.log('\n✨ All seals compressed!');
}

compressSeals().catch(console.error);