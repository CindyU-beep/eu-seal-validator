import { useCallback, useState } from 'react';
import { UploadSimple, Image as ImageIcon, X } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { convertImageToBase64, formatFileSize } from '@/lib/imageUtils';

interface ImageUploadProps {
  onImageSelect: (imageBase64: string, file: File) => void;
  currentImage?: string;
  onClear?: () => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, currentImage, onClear, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const base64 = await convertImageToBase64(file);
        onImageSelect(base64, file);
      }
    },
    [onImageSelect, disabled]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const base64 = await convertImageToBase64(file);
        onImageSelect(base64, file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (currentImage) {
    return (
      <Card className="relative overflow-hidden">
        <img
          src={currentImage}
          alt="Uploaded product label"
          className="w-full h-auto max-h-96 object-contain bg-muted"
        />
        {onClear && !disabled && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClear}
          >
            <X size={20} weight="bold" />
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary hover:bg-muted/50',
        isDragging && 'border-primary bg-primary/5',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && document.getElementById('file-input')?.click()}
    >
      <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
        <div className="rounded-full bg-primary/10 p-6">
          {isDragging ? (
            <UploadSimple size={48} className="text-primary" weight="duotone" />
          ) : (
            <ImageIcon size={48} className="text-primary" weight="duotone" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? 'Drop image here' : 'Upload Product Label'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to select an image
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Supported formats: PNG, JPG, JPEG
          </p>
        </div>

        <input
          id="file-input"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </Card>
  );
}
