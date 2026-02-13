import { useState, useRef, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Brain, Download, Trash, Eye, CheckCircle, Calendar, User, Crosshair } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { type TrainingFeedback } from './HumanReviewDialog';
import { REGULATORY_SEALS } from '@/lib/sealData';

export function TrainingDataManagement() {
  const [trainingData, setTrainingData] = useKV<TrainingFeedback[]>('ml-training-feedback', []);
  const [selectedFeedback, setSelectedFeedback] = useState<TrainingFeedback | null>(null);
  const detailCanvasRef = useRef<HTMLCanvasElement>(null);
  const detailImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!selectedFeedback || !detailCanvasRef.current || !detailImageRef.current) return;
    
    const canvas = detailCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || !selectedFeedback.humanAnnotations) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    selectedFeedback.humanAnnotations.forEach(annotation => {
      const seal = REGULATORY_SEALS.find(s => s.id === annotation.sealId);
      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      const colorIndex = REGULATORY_SEALS.findIndex(s => s.id === annotation.sealId) % colors.length;
      const color = colors[colorIndex];

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        annotation.boundingBox.x * canvas.width,
        annotation.boundingBox.y * canvas.height,
        annotation.boundingBox.width * canvas.width,
        annotation.boundingBox.height * canvas.height
      );

      const label = seal?.code || 'Unknown';
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Inter, sans-serif';
      const textMetrics = ctx.measureText(label);
      const padding = 6;
      const x = annotation.boundingBox.x * canvas.width;
      const y = annotation.boundingBox.y * canvas.height;
      
      ctx.fillRect(x, y - 24, textMetrics.width + padding * 2, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + padding, y - 8);
    });
  }, [selectedFeedback]);

  const handleExportTrainingData = () => {
    if (!trainingData || trainingData.length === 0) {
      toast.error('No training data to export');
      return;
    }

    const exportData = trainingData.map((feedback) => ({
      feedbackId: feedback.id,
      timestamp: new Date(feedback.timestamp).toISOString(),
      validationId: feedback.validationId,
      originalConfidence: feedback.originalResult.overallConfidence,
      originalStatus: feedback.originalResult.status,
      aiDetectedSeals: feedback.originalResult.detectedSeals.map(s => ({
        sealId: s.sealId,
        sealName: s.sealName,
        confidence: s.confidence
      })),
      humanReviewedSeals: feedback.humanReviewedSeals.map(sealId => {
        const seal = REGULATORY_SEALS.find(s => s.id === sealId);
        return {
          sealId,
          sealCode: seal?.code || 'Unknown',
          sealName: seal?.name || 'Unknown'
        };
      }),
      humanAnnotations: feedback.humanAnnotations || [],
      reviewerNotes: feedback.reviewerNotes,
      reviewerConfidence: feedback.reviewerConfidence,
      imageData: feedback.originalResult.imageUrl
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Training data exported successfully', {
      description: `Exported ${exportData.length} feedback records`
    });
  };

  const handleClearTrainingData = () => {
    if (confirm('Are you sure you want to delete all training data? This cannot be undone.')) {
      setTrainingData([]);
      toast.success('Training data cleared');
    }
  };

  const sortedData = [...(trainingData || [])].sort((a, b) => b.timestamp - a.timestamp);

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Brain size={28} weight="duotone" className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">ML Training Data</h2>
            <p className="text-muted-foreground">
              Human-reviewed feedback for model retraining
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExportTrainingData}
            disabled={!trainingData || trainingData.length === 0}
            className="gap-2"
          >
            <Download size={18} weight="duotone" />
            Export Data
          </Button>
          <Button
            variant="outline"
            onClick={handleClearTrainingData}
            disabled={!trainingData || trainingData.length === 0}
            className="gap-2 hover:border-destructive hover:text-destructive"
          >
            <Trash size={18} weight="duotone" />
            Clear All
          </Button>
        </div>
      </div>

      <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total Reviews</p>
            <p className="text-3xl font-bold">{trainingData?.length || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">High Confidence</p>
            <p className="text-3xl font-bold text-accent">
              {trainingData?.filter(d => d.reviewerConfidence === 'high').length || 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Avg. Seals/Review</p>
            <p className="text-3xl font-bold text-primary">
              {trainingData && trainingData.length > 0
                ? (trainingData.reduce((acc, d) => acc + d.humanReviewedSeals.length, 0) / trainingData.length).toFixed(1)
                : '0.0'
              }
            </p>
          </div>
        </div>
      </Card>

      {!trainingData || trainingData.length === 0 ? (
        <Card className="p-12 border-0 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-muted p-8">
              <Brain size={56} className="text-muted-foreground/50" weight="duotone" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Training Data Yet</h3>
              <p className="text-muted-foreground max-w-md">
                When validations fail with low confidence, human reviews will be collected here
                for ML model retraining.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedData.map((feedback) => (
            <Card key={feedback.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className={getConfidenceBadgeColor(feedback.reviewerConfidence)}>
                      {feedback.reviewerConfidence} confidence
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <CheckCircle size={14} weight="fill" />
                      {feedback.humanReviewedSeals.length} seals identified
                    </Badge>
                    {feedback.humanAnnotations && feedback.humanAnnotations.length > 0 && (
                      <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
                        <Crosshair size={14} weight="fill" />
                        {feedback.humanAnnotations.length} annotated
                      </Badge>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={14} weight="duotone" />
                      {new Date(feedback.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        AI Detection
                      </p>
                      <p className="text-sm">
                        {feedback.originalResult.detectedSeals.length} seals 
                        <span className="text-muted-foreground"> • </span>
                        <span className="font-mono text-destructive">
                          {feedback.originalResult.overallConfidence}% confidence
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Human Review
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {feedback.humanReviewedSeals.slice(0, 3).map((sealId) => {
                          const seal = REGULATORY_SEALS.find(s => s.id === sealId);
                          return (
                            <Badge key={sealId} variant="secondary" className="text-xs">
                              {seal?.code || sealId}
                            </Badge>
                          );
                        })}
                        {feedback.humanReviewedSeals.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{feedback.humanReviewedSeals.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {feedback.reviewerNotes && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground italic">
                        "{feedback.reviewerNotes}"
                      </p>
                    </div>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 flex-shrink-0"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <Eye size={16} weight="duotone" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Training Feedback Details</DialogTitle>
                    </DialogHeader>
                    {selectedFeedback && (
                      <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Original Image
                              </h4>
                              {selectedFeedback.humanAnnotations && selectedFeedback.humanAnnotations.length > 0 && (
                                <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary text-xs">
                                  <Crosshair size={12} weight="fill" />
                                  {selectedFeedback.humanAnnotations.length} annotations
                                </Badge>
                              )}
                            </div>
                            <div className="relative rounded-lg border-2 border-border overflow-hidden">
                              <img
                                ref={detailImageRef}
                                src={selectedFeedback.originalResult.imageUrl}
                                alt="Training data"
                                className="w-full h-auto"
                                onLoad={(e) => {
                                  if (detailCanvasRef.current) {
                                    const img = e.target as HTMLImageElement;
                                    detailCanvasRef.current.width = img.width;
                                    detailCanvasRef.current.height = img.height;
                                  }
                                }}
                              />
                              <canvas
                                ref={detailCanvasRef}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              Validation Info
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">File:</span>
                                <p className="font-mono">{selectedFeedback.originalResult.fileName}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">AI Confidence:</span>
                                <p className="font-mono text-destructive">
                                  {selectedFeedback.originalResult.overallConfidence}%
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <Badge className="ml-2">{selectedFeedback.originalResult.status}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            AI Detected Seals
                          </h4>
                          {selectedFeedback.originalResult.detectedSeals.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {selectedFeedback.originalResult.detectedSeals.map((seal) => (
                                <div key={seal.sealId} className="p-3 rounded-lg bg-muted/50 border">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">{seal.sealName}</span>
                                    <span className="font-mono text-xs">{seal.confidence}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No seals detected by AI</p>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Human Reviewed Seals ({selectedFeedback.humanReviewedSeals.length})
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedFeedback.humanReviewedSeals.map((sealId) => {
                              const seal = REGULATORY_SEALS.find(s => s.id === sealId);
                              return (
                                <div key={sealId} className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle size={16} weight="fill" className="text-accent" />
                                    <span className="font-medium text-sm">{seal?.name || 'Unknown'}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{seal?.code}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {selectedFeedback.reviewerNotes && (
                          <>
                            <Separator />
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Reviewer Notes
                              </h4>
                              <p className="text-sm p-4 rounded-lg bg-muted/50 border">
                                {selectedFeedback.reviewerNotes}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Alert className="border-primary/20 bg-primary/5">
        <Brain size={18} weight="fill" className="text-primary" />
        <AlertDescription className="text-sm">
          <strong>About ML Training:</strong> This data represents human expert reviews of 
          failed validations. Use the export function to create training datasets for model 
          fine-tuning and improvement. Each record includes the original image, AI predictions, 
          and corrected human labels.
        </AlertDescription>
      </Alert>
    </div>
  );
}
