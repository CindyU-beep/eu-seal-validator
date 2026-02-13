import { CheckCircle, WarningCircle, XCircle, ClockCounterClockwise, Trash, Download, Upload } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type ValidationResult } from '@/lib/sealData';
import { formatTimestamp, getStatusColor } from '@/lib/imageUtils';
import { toast } from 'sonner';
import { useRef } from 'react';

interface ValidationHistoryProps {
  history: ValidationResult[];
  onSelect: (result: ValidationResult) => void;
  onClear: () => void;
  onImport?: (history: ValidationResult[]) => void;
}

export function ValidationHistory({ history, onSelect, onClear, onImport }: ValidationHistoryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (history.length === 0) {
      toast.error('No validation history to export');
      return;
    }

    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        totalValidations: history.length,
        validations: history
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `validation-history-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('History exported successfully', {
        description: `Exported ${history.length} validation${history.length !== 1 ? 's' : ''}`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export history');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        if (!importData.validations || !Array.isArray(importData.validations)) {
          throw new Error('Invalid file format');
        }

        if (onImport) {
          onImport(importData.validations);
          toast.success('History imported successfully', {
            description: `Imported ${importData.validations.length} validation${importData.validations.length !== 1 ? 's' : ''}`
          });
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import history', {
          description: 'Please ensure the file is a valid validation history export'
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

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
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Validation history</h2>
          <p className="text-muted-foreground text-sm">
            {history.length} validation{history.length !== 1 ? 's' : ''} performed • Saved locally
          </p>
        </div>
        <div className="flex gap-2">
          {onImport && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImportClick}
              className="rounded-full gap-2"
            >
              <Upload size={16} weight="bold" />
              Import
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={history.length === 0}
            className="rounded-full gap-2"
          >
            <Download size={16} weight="bold" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClear} 
            className="rounded-full gap-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash size={16} weight="bold" />
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {history.map((result) => (
          <Card 
            key={result.id}
            className="border-0 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
            onClick={() => onSelect(result)}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30 border">
                <img
                  src={result.imageUrl}
                  alt={result.fileName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold truncate text-base">{result.fileName}</p>
                  {getStatusIcon(result.status)}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={getStatusColor(result.status)} variant="secondary">
                    {result.status.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {result.overallConfidence}% confidence
                  </span>
                  {result.detectedSeals.length > 0 && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {result.detectedSeals.length} seal{result.detectedSeals.length !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(result.timestamp)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
