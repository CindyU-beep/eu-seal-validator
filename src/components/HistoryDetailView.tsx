import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ValidationResults } from '@/components/ValidationResults';
import { type ValidationResult } from '@/lib/sealData';

interface HistoryDetailViewProps {
  result: ValidationResult;
  onBack: () => void;
}

export function HistoryDetailView({ result, onBack }: HistoryDetailViewProps) {
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
          <div>
            <h2 className="text-2xl font-semibold mb-2 tracking-tight">Uploaded label</h2>
            <p className="text-muted-foreground mb-6">{result.fileName}</p>
          </div>
          
          <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
            <img
              src={result.imageUrl}
              alt={result.fileName}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div>
          <ValidationResults result={result} />
        </div>
      </div>
    </div>
  );
}
