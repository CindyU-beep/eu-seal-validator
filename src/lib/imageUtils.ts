export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusColor(status: 'pass' | 'fail' | 'warning'): string {
  switch (status) {
    case 'pass':
      return 'bg-accent text-accent-foreground';
    case 'fail':
      return 'bg-destructive text-destructive-foreground';
    case 'warning':
      return 'bg-warning text-warning-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return 'Very High';
  if (confidence >= 80) return 'High';
  if (confidence >= 70) return 'Moderate';
  if (confidence >= 60) return 'Low';
  return 'Very Low';
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-accent';
  if (confidence >= 60) return 'text-warning-foreground';
  return 'text-destructive';
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AnnotationData {
  sealName: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export async function drawBoundingBoxes(
  imageBase64: string,
  annotations: AnnotationData[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      annotations.forEach(({ sealName, confidence, boundingBox }) => {
        const x = boundingBox.x * img.width;
        const y = boundingBox.y * img.height;
        const width = boundingBox.width * img.width;
        const height = boundingBox.height * img.height;
        
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        
        const label = `${sealName} (${confidence}%)`;
        const padding = 8;
        const fontSize = 16;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const textMetrics = ctx.measureText(label);
        const textWidth = textMetrics.width;
        const textHeight = fontSize;
        
        const labelY = y > textHeight + padding * 2 ? y - padding : y + height + textHeight + padding;
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x, labelY - textHeight - padding, textWidth + padding * 2, textHeight + padding * 2);
        
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x + padding, labelY - textHeight - padding / 2);
      });
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageBase64;
  });
}
