import { useState } from 'react';
import { CheckCircle, WarningCircle, XCircle, Eye, ImagesSquare, UserCheck } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { type ValidationResult } from '@/lib/sealData';
import { getStatusColor, getConfidenceLabel, getConfidenceColor } from '@/lib/imageUtils';
import { HumanReviewDialog } from '@/components/HumanReviewDialog';

interface ValidationResultsProps {
  result: ValidationResult;
}

export function ValidationResults({ result }: ValidationResultsProps) {
  const StatusIcon = result.status === 'pass' ? CheckCircle : result.status === 'warning' ? WarningCircle : XCircle;
  const [showAnnotated, setShowAnnotated] = useState(true);
  const [showAnnotatedInDialog, setShowAnnotatedInDialog] = useState(true);
  const [showHumanReview, setShowHumanReview] = useState(false);

  const needsHumanReview = result.status === 'fail' || result.overallConfidence < 70;
  
  return (
    <>
      <HumanReviewDialog 
        open={showHumanReview}
        onClose={() => setShowHumanReview(false)}
        result={result}
      />
    <div className="space-y-6">
      {result.annotatedImageUrl && (
        <Card className="p-8 border-0 shadow-lg relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 henkel-gradient" />
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4 pl-4">
            <h4 className="text-lg font-semibold tracking-tight">Detected seals visualization</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border">
                <Label htmlFor="toggle-view" className="text-sm font-medium cursor-pointer">
                  {showAnnotated ? 'Annotated' : 'Original'}
                </Label>
                <Switch
                  id="toggle-view"
                  checked={showAnnotated}
                  onCheckedChange={setShowAnnotated}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 hover:border-primary hover:text-primary">
                    <Eye size={16} weight="duotone" />
                    View Full Size
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between pr-8">
                      <span>{showAnnotatedInDialog ? 'Annotated' : 'Original'} Image - {result.fileName}</span>
                      <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                        <Label htmlFor="toggle-view-dialog" className="text-sm font-medium cursor-pointer">
                          {showAnnotatedInDialog ? 'Annotated' : 'Original'}
                        </Label>
                        <Switch
                          id="toggle-view-dialog"
                          checked={showAnnotatedInDialog}
                          onCheckedChange={setShowAnnotatedInDialog}
                        />
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <img
                      src={showAnnotatedInDialog ? result.annotatedImageUrl : result.imageUrl}
                      alt={showAnnotatedInDialog ? "Annotated label with detected seals" : "Original label"}
                      className="w-full h-auto"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden border-2 border-primary/10 bg-muted/20 shadow-md">
            <img
              src={showAnnotated ? result.annotatedImageUrl : result.imageUrl}
              alt={showAnnotated ? "Annotated label with detected seals" : "Original label"}
              className="w-full h-auto transition-opacity duration-200"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full border-2 border-primary/20 shadow-lg">
              <ImagesSquare size={16} weight="duotone" className="text-primary" />
              <span className="text-xs font-semibold">
                {showAnnotated ? 'Annotated View' : 'Original View'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center pl-4">
            {showAnnotated 
              ? 'Red boxes indicate detected regulatory seals with confidence scores' 
              : 'Original uploaded image without annotations'}
          </p>
        </Card>
      )}

      <Card className="p-8 border-0 shadow-lg relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 henkel-gradient" />
        <div className="flex items-start gap-6 pl-4">
          <div className="flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
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

            {needsHumanReview && (
              <Alert className="border-warning/30 bg-warning/5">
                <WarningCircle size={18} weight="fill" className="text-warning" />
                <AlertDescription className="text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <strong>Low confidence detected.</strong> Human review recommended to improve future accuracy.
                    </div>
                    <Button 
                      onClick={() => setShowHumanReview(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2 border-warning/30 hover:bg-warning/10 hover:border-warning flex-shrink-0"
                    >
                      <UserCheck size={16} weight="duotone" />
                      Review
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-lg">
        <h4 className="text-lg font-semibold mb-4 tracking-tight">Product observation</h4>
        <p className="text-muted-foreground leading-relaxed">{result.productDescription}</p>
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
    </>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
