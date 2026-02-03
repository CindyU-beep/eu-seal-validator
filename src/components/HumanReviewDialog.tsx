import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { UserCheck, CheckCircle, Shield } from '@phosphor-icons/react';
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

export function HumanReviewDialog({ open, onClose, result }: HumanReviewDialogProps) {
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

      setTrainingData((currentData) => [feedback, ...(currentData || [])]);

      toast.success('Review submitted successfully', {
        description: 'Your feedback will help improve AI accuracy'
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
            <button
              key={seal.id}
              onClick={() => toggleSeal(seal.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }
              `}
            >
              <div className="flex-shrink-0 rounded-lg bg-muted p-2">
                <Shield size={20} weight="duotone" className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">
                  {seal.code}
                  {aiDetected && (
                    <span className="ml-2 text-xs text-accent font-normal">
                      AI detected ({Math.round(aiDetected.confidence)}%)
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
            <div className="rounded-lg bg-primary/10 p-2">
              <UserCheck size={24} weight="duotone" className="text-primary" />
            </div>
            <div>
              <DialogTitle>Human Review Required</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Low confidence detected - your expertise will improve the AI
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Shield size={18} weight="duotone" />
            <AlertDescription>
              Review the validation results and confirm which seals are actually present on the label. Your feedback trains the AI to be more accurate.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">
              Product Label
            </h4>
            <div className="rounded-lg border overflow-hidden bg-muted/20">
              <img
                src={result.imageUrl}
                className="w-full h-auto"
                alt="Product label"
              />
            </div>
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
              <p className="font-medium text-accent-foreground">
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
                <>Submitting...</>
              ) : (
                <>
                  <CheckCircle size={18} weight="bold" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
