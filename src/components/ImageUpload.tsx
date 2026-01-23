'use client';

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
      <Card className="relative overflow-hidden border-0 shadow-lg rounded-2xl">
        <img
          src={currentImage}
          alt="Uploaded product label"
          className="w-full h-auto max-h-[28rem] object-contain bg-muted/30"
        />
        {onClear && !disabled && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 rounded-full shadow-lg"
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
        'border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary hover:bg-primary/5 rounded-2xl',
        isDragging && 'border-primary bg-primary/5 scale-[0.98]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && document.getElementById('file-input')?.click()}
    >
      <div className="flex flex-col items-center justify-center py-20 px-8 gap-6">
        <div className="rounded-full bg-primary/10 p-8">
          {isDragging ? (
            <UploadSimple size={56} className="text-primary" weight="duotone" />
          ) : (
            <ImageIcon size={56} className="text-primary" weight="duotone" />
          )}
        </div>
        
        <div className="text-center space-y-3">
          <p className="text-xl font-semibold text-foreground">
            {isDragging ? 'Drop image here' : 'Upload product label'}
          </p>
          <p className="text-muted-foreground">
            Drag and drop or click to select an image
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            PNG, JPG, JPEG
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
