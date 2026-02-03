import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { UserCheck, ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { type ValidationResult, REGULATORY_SEALS } from '@/lib/sealData';

export interface TrainingFeedback {
  id: string;
  timestamp: number;
  validationId: string;
  originalResult: ValidationResult;
  humanReviewedSeals: string[];
  reviewerNotes: string;
  reviewerConfidence: 'low' | 'medium' | 'high';
}

interface HumanReviewDialogProps {
  open: boolean;
  onClose: () => void;
  result: ValidationResult;
}

export function HumanReviewDialog({
  open,
  onClose,
  result
}: HumanReviewDialogProps) {
  const [selectedSeals, setSelectedSeals] = useState<Set<string>>(
    new Set(result.detectedSeals.filter(s => s.present).map(s => s.sealId))
  );
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
        reviewerConfidence
      };

      setTrainingData((current) => [feedback, ...(current || [])]);

      toast.success('Review submitted successfully!', {
        description: 'Your feedback will help improve our AI model'
      });

      onClose();
    } catch (error) {
      toast.error('Failed to submit review');
      console.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const physicalSeals = REGULATORY_SEALS.filter(s => s.category === 'physical');
  const healthSeals = REGULATORY_SEALS.filter(s => s.category === 'health');
  const environmentalSeals = REGULATORY_SEALS.filter(s => s.category === 'environmental');

  const renderSealCategory = (seals: typeof REGULATORY_SEALS, categoryName: string) => (
    <div key={categoryName} className="space-y-3">
      <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        {categoryName}
        <span className="px-3 py-1 bg-muted rounded-full text-xs">
          {seals.length}
        </span>
      </h5>
      <div className="grid gap-2">
        {seals.map((seal) => {
          const isSelected = selectedSeals.has(seal.id);
          const wasDetectedByAI = result.detectedSeals.some(
            s => s.sealId === seal.id && s.present
          );

          return (
            <button
              key={seal.id}
              onClick={() => toggleSeal(seal.id)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all hover:shadow-md
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border hover:border-primary/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{seal.name}</p>
                    {wasDetectedByAI && (
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full">
                        AI detected
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {seal.code}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {seal.description}
                  </p>
                </div>
                <div
                  className={`
                    flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                    ${isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground/30'
                    }
                  `}
                >
                  {isSelected && <CheckCircle size={14} weight="bold" className="text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-xl bg-warning/10 p-2.5">
              <UserCheck size={24} weight="duotone" className="text-warning" />
            </div>
            <div>
              <DialogTitle>Human Review Required</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Low confidence detected - your expert review will improve our AI
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="border-warning/30 bg-warning/5">
            <AlertDescription className="text-sm">
              Your manual review will be used to train and improve the AI model for future validations
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Product Label
            </h4>
            <div className="rounded-lg border overflow-hidden bg-muted/20">
              <img
                src={result.imageUrl}
                alt="Product label"
                className="w-full h-auto"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Select Matching Seals
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Review the image above and select every regulatory seal that you can identify on the label
              </p>
            </div>

            <div className="space-y-6">
              {renderSealCategory(physicalSeals, 'Physical Hazards')}
              {renderSealCategory(healthSeals, 'Health Hazards')}
              {renderSealCategory(environmentalSeals, 'Environmental Hazards')}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Your Confidence Level
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                How confident are you in your review?
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
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Reviewer Notes (Optional)
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Add any observations or context about your review
              </p>
              <Textarea
                id="reviewer-notes"
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="e.g., Some seals were partially obscured, lighting made GHS06 difficult to identify..."
                rows={3}
              />
            </div>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} weight="duotone" className="text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-accent mb-1">
                  Training Data Impact
                </p>
                <p className="text-sm text-muted-foreground">
                  Your review will be stored securely and used to retrain the AI model, improving accuracy for future validations
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
                  Submit Review
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
