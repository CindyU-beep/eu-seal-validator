import { useState } from 'react';
import { UserCheck, ArrowRight, CheckCircle,
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textar
import { toast } from 'sonner';

  open: boolean;
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { type ValidationResult, REGULATORY_SEALS } from '@/lib/sealData';

interface HumanReviewDialogProps {
  open: boolean;
  onClose: () => void;
  humanReviewedSeals: strin
 

export function HumanReviewDialog({
  const [revi
  const [isSubmittin

    setSelectedSeals((prev) => {
      if (newSet.has(sealId)) {
      } else {
      }
    });


      return;

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
    physical: REGULATO
    environmental: REGULATO

    <Dia

            <div className="rounded-xl bg-warning/10 p-2.5">

              <DialogTitle>Human Review Required</DialogTit
                Low confidence detected - your expert review will improve our AI
         

        <Alert className="border-w
          <AlertDescription
            Your manual review will 
        </Alert>
        <div classNam
            <h4 className="text-sm font-semibold text-m
            </h4>
              <
                alt="Product 
     
    

          <div className
              <h4 className="text-sm font-semibold text-muted-foregrou
              </h4>
                Review the image above and select every regulatory seal that yo
    

          
                  <span className="px-3 py-1 bg-muted rounded-full">
                  </span>
                </h5>
                  {seals.map((seal) => {
                    const wasDetectedByAI = result.detectedS
                    return (
                  
                 
                          ${isSelected 
                            : 'bo
                        `}
                        <div class
                  
                
                       

                            <p className="text-xs font-med
                              {seal.description}
                          </div>
                            flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                              ? 'bg-primary border-primary' 
                            }
                

                        </div>
                    );
                </div>
            ))}


            <div>
                Your Confidence Level
              <p className="text-xs text-muted
              </p>
                
                  
                

                       

                    {level}
                )
            </div>
            <div>
                Rev
              <p className="text-xs text-muted-foreground m
              </p>
                id
                on

              />
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <CheckCircle size={20} weight="duotone" class
                <p className="font-semibold text-accent mb-1">
                </p>
                  Your re
                </p>
            </div>
        </div>
        <div className="flex items-cente
            {selectedSeals.size} seal{selectedSeals.size !== 1 ? '
          <div className="flex gap-3">

            <Button 
              disabled={isSub
            >
                'Submitting...'
                <>
                  <ArrowRight size={18} weight="bold" />
              )}
          </div>
      </DialogContent>
  );
































































































































