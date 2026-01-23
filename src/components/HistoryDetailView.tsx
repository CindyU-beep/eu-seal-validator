'use client';

import { useState } from 'react';
import { ArrowLeft, ImagesSquare } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ValidationResults } from '@/components/ValidationResults';
import { type ValidationResult } from '@/lib/sealData';

interface HistoryDetailViewProps {
  result: ValidationResult;
  onBack: () => void;
}

export function HistoryDetailView({ result, onBack }: HistoryDetailViewProps) {
  const [showAnnotated, setShowAnnotated] = useState(true);
  
  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="rounded-full -ml-2"
      >
        <ArrowLeft size={18} weight="bold" />
        Back to history
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2 tracking-tight">Uploaded label</h2>
              <p className="text-muted-foreground">{result.fileName}</p>
            </div>
            {result.annotatedImageUrl && (
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                <Label htmlFor="toggle-history-view" className="text-sm font-medium cursor-pointer">
                  {showAnnotated ? 'Annotated' : 'Original'}
                </Label>
                <Switch
                  id="toggle-history-view"
                  checked={showAnnotated}
                  onCheckedChange={setShowAnnotated}
                />
              </div>
            )}
          </div>
          
          <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
            <img
              src={showAnnotated && result.annotatedImageUrl ? result.annotatedImageUrl : result.imageUrl}
              alt={result.fileName}
              className="w-full h-full object-contain"
            />
            {result.annotatedImageUrl && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-lg">
                <ImagesSquare size={16} weight="duotone" className="text-primary" />
                <span className="text-xs font-medium">
                  {showAnnotated ? 'Annotated View' : 'Original View'}
                </span>
              </div>
            )}
          </div>
          {result.annotatedImageUrl && (
            <p className="text-xs text-muted-foreground text-center">
              {showAnnotated 
                ? 'Red boxes indicate detected regulatory seals with confidence scores' 
                : 'Original uploaded image without annotations'}
            </p>
          )}
        </div>

        <div>
          <ValidationResults result={result} />
        </div>
      </div>
    </div>
  );
}
