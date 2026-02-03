import { useState } from 'react';
import { UserCheck, ArrowRight, CheckCircle,
import { UserCheck, ArrowRight, CheckCircle, Shield } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

  id: string;

  humanReviewedSeals: string[];
  reviewerCon

  open: boolean;
  result: ValidationResult;

  open,
  result
 

  const [reviewerConfidence, setRe
  const [trainin
  const toggleSeal = (
      const newSet = new Se
 

      return newSet;
  };
  const ha
      to
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
  const healthSeals = REGULATORY_SEALS.filter(s => s.category === 'health');

    <div key={categoryName} clas
        {categoryName}
          {seals.length}
      </h5>
        {seals.map((seal) 
        

          return (

              className={`
                ${isSelected 
         

              <d
                  <Sh
                <div className="flex-1 min-w-
                    <p className="font-semibold text-sm
               
                      </span>
     
    

                  </p>
                <div
                    flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-cente

                    }
                >
                </div>
            </button>
        })}
    </div>

    <Dialog
        <DialogHeader>
            <div className="ro
            </div>
              <DialogTitle>Human Review Required</DialogTitl
                Low confidence detected - your exp
            

        <div class
            <AlertD
            </AlertDescript

            <h4 className=
            </h4>
              <img
                alt="Product label"
              />
          </div>
          <Separ
          <di
              <h4 className="text-sm font-semibold tex
              </h4>
                Review the image above and select every regulato
            </div>
            <div className="space-y-6">
              {renderSealCategory(healthSeals, 'Health Hazards')}
            </div>


            <div>
                Your Confidence Level
              <p className="tex
              </p>
                {(['low', 'medium', 'high'] as const).map((level) =>
                    key={level}
                    on
                  >
                  </
              </div>

              <h4 className="text
              </h4>
                Add any observations or context abou
              <Textar
                valu
                p
              />
          </div>
          <div class
              <CheckC
            
           
            
          
    

          
          </p>
            <Button variant="outline" onClick={onClose} disabled={isSubm
            </Button>
              onClick={handleSubmitReview}
              className="gap-2"
              {isSubmitting ? (
              ) : 
                 
                </>
            </Button>
        </div>
    </Dialog>
}






























































































































