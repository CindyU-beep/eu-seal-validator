import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type ValidationResult } from '@/lib/sealData';
import { getStatusColor, getConfidenceLabel, getConfidenceColor } from '@/lib/imageUtils';

interface ValidationResultsProps {
  result: ValidationResult;
}

export function ValidationResults({ result }: ValidationResultsProps) {
  const StatusIcon = result.status === 'pass' ? CheckCircle : result.status === 'warning' ? WarningCircle : XCircle;
  
  return (
    <div className="space-y-6">
      <Card className="p-8 border-0 shadow-lg">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <StatusIcon
              size={56}
              weight="duotone"
              className={
                result.status === 'pass'
                  ? 'text-accent'
                  : result.status === 'warning'
                  ? 'text-warning'
                  : 'text-destructive'
              }
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl font-semibold tracking-tight">Validation result</h3>
              <Badge className={getStatusColor(result.status)}>
                {result.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Overall confidence</span>
                <span className={cn('text-sm font-mono font-semibold', getConfidenceColor(result.overallConfidence))}>
                  {result.overallConfidence}% ({getConfidenceLabel(result.overallConfidence)})
                </span>
              </div>
              <Progress value={result.overallConfidence} className="h-2" />
            </div>

            <p className="text-sm text-muted-foreground font-mono">{result.fileName}</p>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-lg">
        <h4 className="text-lg font-semibold mb-4 tracking-tight">AI analysis</h4>
        <p className="text-muted-foreground leading-relaxed">{result.aiAnalysis}</p>
      </Card>

      {result.detectedSeals.length > 0 && (
        <Card className="p-8 border-0 shadow-lg">
          <h4 className="text-lg font-semibold mb-6 tracking-tight">
            Detected seals ({result.detectedSeals.length})
          </h4>
          <div className="space-y-4">
            {result.detectedSeals.map((seal, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={22} weight="fill" className="text-accent" />
                    <span className="font-medium">{seal.sealName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={seal.confidence} className="w-28 h-2" />
                    <span className={cn('text-sm font-mono font-semibold w-16 text-right', getConfidenceColor(seal.confidence))}>
                      {seal.confidence}%
                    </span>
                  </div>
                </div>
                {index < result.detectedSeals.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </Card>
      )}

      {result.missingSeals.length > 0 && result.detectedSeals.length > 0 && (
        <Alert className="border-warning/20 bg-warning/5">
          <WarningCircle size={20} weight="fill" className="text-warning" />
          <AlertDescription className="text-sm">
            <span className="font-semibold">Note:</span> The following seals were not detected: {result.missingSeals.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {result.detectedSeals.length === 0 && (
        <Alert variant="destructive" className="border-0 bg-destructive/10">
          <XCircle size={20} weight="fill" />
          <AlertDescription className="text-sm">
            <span className="font-semibold">No regulatory seals detected.</span> Ensure the image contains clear GHS pictograms and try again with a higher quality image.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
