import { CheckCircle, WarningCircle, XCircle, ClockCounterClockwise, Trash } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { type ValidationResult } from '@/lib/sealData';
import { formatTimestamp, getStatusColor } from '@/lib/imageUtils';

interface ValidationHistoryProps {
  history: ValidationResult[];
  onSelect: (result: ValidationResult) => void;
  onClear: () => void;
  selectedId?: string;
}

export function ValidationHistory({ history, onSelect, onClear, selectedId }: ValidationHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="p-16 border-0 shadow-sm bg-muted/20">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="rounded-full bg-muted p-8">
            <ClockCounterClockwise size={56} className="text-muted-foreground/50" weight="duotone" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold tracking-tight">No validation history</h3>
            <p className="text-muted-foreground">
              Your validation results will appear here once you start validating product labels
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={22} weight="fill" className="text-accent" />;
      case 'warning':
        return <WarningCircle size={22} weight="fill" className="text-warning" />;
      case 'fail':
        return <XCircle size={22} weight="fill" className="text-destructive" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight mb-2">Validation history</h2>
          <p className="text-muted-foreground">
            {history.length} validation{history.length !== 1 ? 's' : ''} performed
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={onClear} className="rounded-full">
          <Trash size={16} weight="bold" />
          Clear history
        </Button>
      </div>

      <Card className="border-0 shadow-lg">
        <ScrollArea className="h-[600px]">
          <div className="p-2">
            {history.map((result, index) => (
              <div key={result.id}>
                <button
                  onClick={() => onSelect(result)}
                  className={`w-full text-left p-5 rounded-xl transition-all hover:bg-muted/80 ${
                    selectedId === result.id ? 'bg-muted/80' : ''
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-muted/50 border border-border/50">
                      <img
                        src={result.imageUrl}
                        alt={result.fileName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold truncate">{result.fileName}</p>
                        {getStatusIcon(result.status)}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={getStatusColor(result.status)} variant="secondary">
                          {result.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-mono text-muted-foreground">
                          {result.overallConfidence}% confidence
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(result.timestamp)}
                      </p>

                      {result.detectedSeals.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {result.detectedSeals.length} seal{result.detectedSeals.length !== 1 ? 's' : ''} detected
                        </p>
                      )}
                    </div>
                  </div>
                </button>
                {index < history.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
