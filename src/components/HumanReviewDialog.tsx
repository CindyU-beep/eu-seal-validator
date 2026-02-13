import { useState, useRef, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { UserCheck, CheckCircle, Shield, Cursor, Pencil, Trash, WarningCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { type ValidationResult, REGULATORY_SEALS } from '@/lib/sealData';

export interface SealAnnotation {
  sealId: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TrainingFeedback {
  id: string;
  timestamp: number;
  validationId: string;
  originalResult: ValidationResult;
  humanReviewedSeals: string[];
  humanAnnotations?: SealAnnotation[];
  reviewerNotes: string;
  reviewerConfidence: 'low' | 'medium' | 'high';
}

interface HumanReviewDialogProps {
  open: boolean;
  onClose: () => void;
  result: ValidationResult;
  isLowConfidence?: boolean;
  /** Seal IDs where CV template matching failed — these need manual bounding boxes. */
  failedSeals?: string[];
}

export function HumanReviewDialog({ open, onClose, result, isLowConfidence = true, failedSeals = [] }: HumanReviewDialogProps) {
  const [selectedSeals, setSelectedSeals] = useState<Set<string>>(
    new Set(result.detectedSeals.filter(s => s.present).map(s => s.sealId))
  );
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [reviewerConfidence, setReviewerConfidence] = useState<'low' | 'medium' | 'high'>('high');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingData, setTrainingData] = useKV<TrainingFeedback[]>('ml-training-feedback', []);
  
  // Annotation state
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotations, setAnnotations] = useState<SealAnnotation[]>([]);
  const [currentAnnotatingSeal, setCurrentAnnotatingSeal] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const toggleSeal = (sealId: string) => {
    setSelectedSeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sealId)) {
        newSet.delete(sealId);
        // Remove annotations for deselected seal
        setAnnotations(annotations.filter(a => a.sealId !== sealId));
      } else {
        newSet.add(sealId);
      }
      return newSet;
    });
  };

  const startAnnotating = (sealId: string) => {
    setAnnotationMode(true);
    setCurrentAnnotatingSeal(sealId);
    toast.info(`Draw a box around the ${REGULATORY_SEALS.find(s => s.id === sealId)?.name} seal`);
  };

  const deleteAnnotation = (sealId: string) => {
    setAnnotations(annotations.filter(a => a.sealId !== sealId));
    toast.success('Annotation removed');
  };

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations
    annotations.forEach(annotation => {
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

      // Draw label
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

    // Draw current box being drawn
    if (currentBox && isDrawing) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        currentBox.x * canvas.width,
        currentBox.y * canvas.height,
        currentBox.width * canvas.width,
        currentBox.height * canvas.height
      );
      ctx.setLineDash([]);
    }
  }, [annotations, currentBox, isDrawing]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!annotationMode || !currentAnnotatingSeal || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Use rect dimensions (CSS rendered size) for correct normalisation
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / rect.width;
    const currentY = (e.clientY - rect.top) / rect.height;
    
    setCurrentBox({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      width: Math.abs(currentX - startPos.x),
      height: Math.abs(currentY - startPos.y)
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox || !currentAnnotatingSeal) return;
    
    // Only save if box has reasonable size
    if (currentBox.width > 0.02 && currentBox.height > 0.02) {
      // Remove existing annotation for this seal
      const filteredAnnotations = annotations.filter(a => a.sealId !== currentAnnotatingSeal);
      
      setAnnotations([
        ...filteredAnnotations,
        {
          sealId: currentAnnotatingSeal,
          boundingBox: currentBox
        }
      ]);
      
      toast.success('Annotation saved');
    }
    
    setIsDrawing(false);
    setStartPos(null);
    setCurrentBox(null);
    setAnnotationMode(false);
    setCurrentAnnotatingSeal(null);
  };

  const handleSubmitReview = async () => {
    if (selectedSeals.size === 0) {
      toast.error('Please select at least one seal that matches the label');
      return;
    }

    setIsSubmitting(true);

    try {
      const feedback: TrainingFeedback = {
        id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        validationId: result.id,
        originalResult: result,
        humanReviewedSeals: Array.from(selectedSeals),
        humanAnnotations: annotations.length > 0 ? annotations : undefined,
        reviewerNotes,
        reviewerConfidence
      };

      setTrainingData((currentData) => [feedback, ...(currentData || [])]);

      toast.success(isLowConfidence ? 'Review submitted successfully' : 'Confirmation submitted successfully', {
        description: annotations.length > 0 
          ? `Submitted with ${annotations.length} annotation${annotations.length !== 1 ? 's' : ''}`
          : 'Your feedback will help improve AI accuracy'
      });

      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const healthSeals = REGULATORY_SEALS.filter(s => s.category === 'health');
  const physicalSeals = REGULATORY_SEALS.filter(s => s.category === 'physical');
  const environmentalSeals = REGULATORY_SEALS.filter(s => s.category === 'environmental');

  const renderSealCategory = (seals: typeof REGULATORY_SEALS, categoryName: string) => (
    <div key={categoryName} className="space-y-3">
      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {categoryName}
        <span className="ml-2 text-foreground/50">
          {seals.length}
        </span>
      </h5>
      <div className="grid gap-2">
        {seals.map((seal) => {
          const isSelected = selectedSeals.has(seal.id);
          const aiDetected = result.detectedSeals.find(s => s.sealId === seal.id && s.present);

          return (
            <div
              key={seal.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                ${failedSeals.map(id => id.toUpperCase()).includes(seal.code.toUpperCase()) && !annotations.find(a => a.sealId === seal.id)
                  ? 'border-warning bg-warning/10 shadow-sm ring-1 ring-warning/30'
                  : isSelected 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }
              `}
            >
              <button
                type="button"
                onClick={() => toggleSeal(seal.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                {seal.imageUrl ? (
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border flex items-center justify-center p-1">
                    <img src={seal.imageUrl} alt={seal.name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 rounded-lg bg-muted p-2">
                    <Shield size={20} weight="duotone" className="text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">
                    {seal.code}
                    {aiDetected && (
                      <span className="ml-2 text-xs text-accent font-normal">
                        AI detected ({Math.round(aiDetected.confidence)}%)
                      </span>
                    )}
                    {failedSeals.map(id => id.toUpperCase()).includes(seal.code.toUpperCase()) && !annotations.find(a => a.sealId === seal.id) && (
                      <span className="ml-2 text-xs text-warning font-semibold">
                        — needs bbox
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {seal.name}
                  </p>
                </div>
                <div className={`
                  flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                  ${isSelected ? 'bg-primary border-primary' : 'border-border'}
                `}>
                  {isSelected && <CheckCircle size={14} weight="bold" className="text-primary-foreground" />}
                </div>
              </button>
              {isSelected && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  {annotations.find(a => a.sealId === seal.id) ? (
                    <>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <CheckCircle size={12} weight="fill" />
                        Annotated
                      </Badge>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnnotation(seal.id);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Trash size={14} />
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        startAnnotating(seal.id);
                      }}
                      className="h-7 gap-1 text-xs"
                    >
                      <Pencil size={12} />
                      Mark
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`rounded-lg p-2 ${isLowConfidence ? 'bg-primary/10' : 'bg-accent/10'}`}>
              <UserCheck size={24} weight="duotone" className={isLowConfidence ? 'text-primary' : 'text-accent'} />
            </div>
            <div>
              <DialogTitle>
                {isLowConfidence ? 'Human Review Required' : 'Confirm AI Results'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isLowConfidence 
                  ? 'Low confidence detected - your expertise will improve the AI'
                  : 'Help train the AI by confirming the detected seals'
                }
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className={isLowConfidence ? '' : 'border-accent/20 bg-accent/5'}>
            <Shield size={18} weight="duotone" className={isLowConfidence ? '' : 'text-accent'} />
            <AlertDescription>
              {isLowConfidence 
                ? 'Review the validation results and confirm which seals are actually present on the label. Your feedback trains the AI to be more accurate.'
                : 'The AI detected seals with high confidence. Confirm the results to help improve future predictions.'
              }
            </AlertDescription>
          </Alert>

          {failedSeals.length > 0 && (
            <Alert className="border-warning/30 bg-warning/5">
              <WarningCircle size={18} weight="fill" className="text-warning" />
              <AlertDescription className="text-sm">
                <strong>{failedSeals.length} seal{failedSeals.length !== 1 ? 's' : ''} could not be automatically located.</strong>{' '}
                Please draw bounding boxes for the highlighted seals below using the "Mark" button.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">
                Product Label
              </h4>
              {annotationMode && (
                <Badge variant="outline" className="gap-2 border-primary text-primary">
                  <Cursor size={14} weight="fill" />
                  Drawing Mode: {REGULATORY_SEALS.find(s => s.id === currentAnnotatingSeal)?.code}
                </Badge>
              )}
            </div>
            <div className="rounded-lg border overflow-hidden bg-muted/20 relative">
              <img
                ref={imageRef}
                src={result.imageUrl}
                className="w-full h-auto"
                alt="Product label"
                onLoad={(e) => {
                  if (canvasRef.current) {
                    const img = e.target as HTMLImageElement;
                    canvasRef.current.width = img.width;
                    canvasRef.current.height = img.height;
                  }
                }}
              />
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full ${annotationMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
            {annotationMode && (
              <Alert className="border-primary/30 bg-primary/5">
                <Cursor size={16} weight="duotone" className="text-primary" />
                <AlertDescription className="text-xs">
                  Click and drag to draw a box around the seal. Release to save.
                </AlertDescription>
              </Alert>
            )}
            {annotations.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {annotations.length} seal{annotations.length !== 1 ? 's' : ''} annotated with position data
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Select All Visible Seals
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Review the image above and select every regulatory seal you can clearly identify
              </p>
            </div>
            <div className="space-y-6">
              {renderSealCategory(healthSeals, 'Health Hazards')}
              {renderSealCategory(physicalSeals, 'Physical Hazards')}
              {renderSealCategory(environmentalSeals, 'Environmental Hazards')}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">
                Your Confidence Level
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                How confident are you in your seal identification?
              </p>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={reviewerConfidence === level ? 'default' : 'outline'}
                    onClick={() => setReviewerConfidence(level)}
                    className="flex-1 capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">
                Additional Notes (Optional)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Add any observations or context about this validation
              </p>
              <Textarea
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="E.g., Image quality was poor, seal partially obscured, etc."
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <CheckCircle size={20} weight="duotone" className="text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium">
                Training Data Collection
              </p>
              <p className="text-muted-foreground mt-1">
                Your review will be stored as training data to improve future AI predictions
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>{isLowConfidence ? 'Submitting...' : 'Confirming...'}</>
              ) : (
                <>
                  <CheckCircle size={18} weight="bold" />
                  {isLowConfidence ? 'Submit Review' : 'Confirm Results'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
