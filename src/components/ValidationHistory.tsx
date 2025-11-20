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
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-muted p-6">
            <ClockCounterClockwise size={48} className="text-muted-foreground" weight="duotone" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No Validation History</h3>
            <p className="text-sm text-muted-foreground">
              Your validation results will appear here once you start validating product labels.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={20} weight="fill" className="text-accent" />;
      case 'warning':
        return <WarningCircle size={20} weight="fill" className="text-warning" />;
      case 'fail':
        return <XCircle size={20} weight="fill" className="text-destructive" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Validation History</h2>
          <p className="text-sm text-muted-foreground">
            {history.length} validation{history.length !== 1 ? 's' : ''} performed
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={onClear}>
          <Trash size={16} weight="bold" />
          Clear History
        </Button>
      </div>

      <Card>
        <ScrollArea className="h-[600px]">
          <div className="p-4">
            {history.map((result, index) => (
              <div key={result.id}>
                <button
                  onClick={() => onSelect(result)}
                  className={`w-full text-left p-4 rounded-lg transition-colors hover:bg-muted ${
                    selectedId === result.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted border">
                      <img
                        src={result.imageUrl}
                        alt={result.fileName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm truncate">{result.fileName}</p>
                        {getStatusIcon(result.status)}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusColor(result.status)} variant="secondary">
                          {result.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          {result.overallConfidence}% confidence
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(result.timestamp)}
                      </p>

                      {result.detectedSeals.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {result.detectedSeals.length} seal{result.detectedSeals.length !== 1 ? 's' : ''} detected
                        </p>
                      )}
                    </div>
                  </div>
                </button>
                {index < history.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
