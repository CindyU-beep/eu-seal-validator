import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { UserCheck, ArrowRight, CheckCircle, Warning } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { type ValidationResult, REGULATORY_SEALS } from '@/lib/sealData';

interface HumanReviewDialogProps {
  open: boolean;
  onClose: () => void;
  result: ValidationResult;
}

export interface TrainingFeedback {
  id: string;
  timestamp: number;
  validationId: string;
  originalResult: ValidationResult;
  humanReviewedSeals: string[];
  reviewerNotes: string;
  reviewerConfidence: 'low' | 'medium' | 'high';
  submittedForRetraining: boolean;
}

export function HumanReviewDialog({ open, onClose, result }: HumanReviewDialogProps) {
  const [selectedSeals, setSelectedSeals] = useState<Set<string>>(new Set());
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [reviewerConfidence, setReviewerConfidence] = useState<'low' | 'medium' | 'high'>('high');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingData, setTrainingData] = useKV<TrainingFeedback[]>('ml-training-feedback', []);

  const toggleSeal = (sealId: string) => {
    setSelectedSeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sealId)) {
        newSet.delete(sealId);
      } else {
        newSet.add(sealId);
      }
      return newSet;
    });
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
        reviewerNotes,
        reviewerConfidence,
        submittedForRetraining: true
      };

      setTrainingData((current) => [feedback, ...(current || [])]);

      toast.success('Review submitted for ML retraining', {
        description: `Your feedback has been recorded and will improve future validations.`
      });

      setSelectedSeals(new Set());
      setReviewerNotes('');
      setReviewerConfidence('high');
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedSeals = {
    physical: REGULATORY_SEALS.filter(s => s.category === 'physical'),
    health: REGULATORY_SEALS.filter(s => s.category === 'health'),
    environmental: REGULATORY_SEALS.filter(s => s.category === 'environmental')
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-warning/10 p-2.5">
              <UserCheck size={24} weight="duotone" className="text-warning" />
            </div>
            <div>
              <DialogTitle>Human Review Required</DialogTitle>
              <DialogDescription>
                Low confidence detected - your expert review will improve our AI
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Alert className="border-warning/30 bg-warning/5">
          <Warning size={18} weight="fill" className="text-warning" />
          <AlertDescription className="text-sm">
            The AI detected <strong>low confidence ({result.overallConfidence}%)</strong> in this validation. 
            Your manual review will be used to retrain the model and improve future accuracy.
          </AlertDescription>
        </Alert>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Original Image
            </h4>
            <div className="relative rounded-lg overflow-hidden border-2 border-border bg-muted/20">
              <img
                src={result.imageUrl}
                alt="Product label for review"
                className="w-full h-auto max-h-[300px] object-contain"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Select All Seals Present on This Label
              </h4>
              <p className="text-sm text-muted-foreground">
                Review the image above and select every regulatory seal that you can identify
              </p>
            </div>

            {Object.entries(groupedSeals).map(([category, seals]) => (
              <div key={category} className="space-y-3">
                <h5 className="text-sm font-semibold capitalize flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="px-3 py-1 bg-muted rounded-full">
                    {category}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  {seals.map((seal) => {
                    const isSelected = selectedSeals.has(seal.id);
                    const wasDetectedByAI = result.detectedSeals.some(d => d.sealId === seal.id);

                    return (
                      <button
                        key={seal.id}
                        onClick={() => toggleSeal(seal.id)}
                        className={`
                          relative p-4 rounded-lg border-2 transition-all text-left
                          ${isSelected 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{seal.code}</span>
                              {wasDetectedByAI && (
                                <Badge variant="secondary" className="text-xs py-0 h-5">
                                  AI detected
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs font-medium mb-1">{seal.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {seal.description}
                            </p>
                          </div>
                          <div className={`
                            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                            ${isSelected 
                              ? 'bg-primary border-primary' 
                              : 'border-muted-foreground/30'
                            }
                          `}>
                            {isSelected && (
                              <CheckCircle size={16} weight="fill" className="text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="reviewer-confidence" className="text-sm font-semibold">
                Your Confidence Level
              </Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                How confident are you in your seal identification?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setReviewerConfidence(level)}
                    className={`
                      px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all capitalize
                      ${reviewerConfidence === level
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="reviewer-notes" className="text-sm font-semibold">
                Review Notes (Optional)
              </Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Add any observations that might help improve the AI model
              </p>
              <Textarea
                id="reviewer-notes"
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="E.g., 'Image quality was poor', 'Seal partially obscured', 'Lighting made detection difficult'..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} weight="duotone" className="text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-accent mb-1">
                  Training Data Submission
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Your review will be saved as training data. The ML model will learn from this 
                  feedback to improve future seal detection accuracy for similar cases.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedSeals.size} seal{selectedSeals.size !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={isSubmitting || selectedSeals.size === 0}
              className="gap-2"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  Submit for Retraining
                  <ArrowRight size={18} weight="bold" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
