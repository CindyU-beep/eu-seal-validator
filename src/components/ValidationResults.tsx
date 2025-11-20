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
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <StatusIcon
              size={48}
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
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl font-bold">Validation Result</h3>
              <Badge className={getStatusColor(result.status)}>
                {result.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Overall Confidence</span>
                <span className={cn('text-sm font-mono font-bold', getConfidenceColor(result.overallConfidence))}>
                  {result.overallConfidence}% ({getConfidenceLabel(result.overallConfidence)})
                </span>
              </div>
              <Progress value={result.overallConfidence} className="h-2" />
            </div>

            <p className="text-sm text-muted-foreground font-mono">{result.fileName}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">AI Analysis</h4>
        <p className="text-sm text-foreground leading-relaxed">{result.aiAnalysis}</p>
      </Card>

      {result.detectedSeals.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">
            Detected Seals ({result.detectedSeals.length})
          </h4>
          <div className="space-y-3">
            {result.detectedSeals.map((seal, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                    <span className="font-semibold">{seal.sealName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={seal.confidence} className="w-24 h-2" />
                    <span className={cn('text-sm font-mono font-bold w-16 text-right', getConfidenceColor(seal.confidence))}>
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
        <Alert>
          <WarningCircle size={20} weight="fill" />
          <AlertDescription>
            <span className="font-semibold">Note:</span> The following seals were not detected in this image: {result.missingSeals.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {result.detectedSeals.length === 0 && (
        <Alert variant="destructive">
          <XCircle size={20} weight="fill" />
          <AlertDescription>
            <span className="font-semibold">No regulatory seals detected.</span> Please ensure the image contains clear GHS pictograms and try again with a higher quality image.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
