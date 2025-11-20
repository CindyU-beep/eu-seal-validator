import { useState } from 'react';
import { ShieldCheck, Books, ClockCounterClo
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LandingPage } from '@/components/Landin
import { ValidationResults } from '@/compone
import { ValidationHistory } from '@/components/Vali
import { validateProductLabel }
import { LandingPage } from '@/components/LandingPage';
import { ImageUpload } from '@/components/ImageUpload';
import { ValidationResults } from '@/components/ValidationResults';
import { ReferenceSealGallery } from '@/components/ReferenceSealGallery';
import { ValidationHistory } from '@/components/ValidationHistory';
import { HistoryDetailView } from '@/components/HistoryDetailView';
import { validateProductLabel } from '@/lib/validationService';
import { type ValidationResult } from '@/lib/sealData';

function App() {
    setUploadedImage(imageBase64);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [currentResult, setCurrentResult] = useState<ValidationResult | null>(null);
  const [validationHistory, setValidationHistory] = useKV<ValidationResult[]>('validation-history', []);
  };

    if (!uploadedImage || !currentFile) {
    setUploadedImage(imageBase64);
    }
    setCurrentResult(null);
    

  const handleClearImage = () => {
    setUploadedImage(null);
        description: erro
    } finally {
    

  const [showHistoryDetail, setShowHis
  const handleSelectHistoryItem = (result
    setShowHistoryDetail(true);

    s

  const handleClearHistory
    setShowHistoryDetail(fa


    return <LandingPage onGetStarted={() => setShowLanding(false)} />;

    <d
        <div className="container mx-auto px-6 lg:px-12 py-5">

                <ShieldCheck size={24
              <div>
                  Henkel Validator
           
                </p>
            </div>
              variant="ghost"
           
            >
              Home
          </div>
      </hea
      <
          <TabsList c
              <ShieldCheck size={18} we
            </TabsTrigger>
         
            </T
              <ClockCounterCl
     


                <div>
                  <p className="text-muted-foreground mb-6">Upload y

                    onClear={handleClearImage}
                  />

    

                    className="w-full r
                    {isValidatin
                        <Progress c
    

                        Validate lab
                    )}
                )}

                {isValidating && (
    

                    
                        </p>
   

          
                )}
                {!uploadedImage && !isValidating && (
                    <div className="flex flex-col items-center
                        <ShieldCheck size={56} className="tex
                      <div className="space-y-2">
                        <p className="text-muted-foregrou
                        </p>
                    
                )}
            </div>

            <Referenc

            {showHistoryDetail && selec
                resu
              />
              <div
                  h
                  onClear={ha
                />
            )}
        </Tabs>
    </div>
}
export default App











            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2 rounded-full data-[state=active]:shadow-sm">
              <Books size={18} weight="duotone" />
              Reference
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 rounded-full data-[state=active]:shadow-sm">
              <ClockCounterClockwise size={18} weight="duotone" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validate" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 tracking-tight">Upload label</h2>
                  <p className="text-muted-foreground mb-6">Upload your product label to begin validation</p>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    currentImage={uploadedImage || undefined}
                    onClear={handleClearImage}
                    disabled={isValidating}
                  />
                </div>

                {uploadedImage && !currentResult && (
                  <Button
                    onClick={handleValidate}
                    disabled={isValidating}
                    size="lg"
                    className="w-full rounded-full h-14 text-base font-medium shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {isValidating ? (
                      <>
                        <Progress className="w-full h-2" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} weight="bold" />
                        Validate label
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div>
                {isValidating && (
                  <Card className="p-12 border-0 shadow-lg">
                    <div className="flex flex-col items-center justify-center gap-6 text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Analyzing label...</h3>
                        <p className="text-muted-foreground">
                          AI is comparing your label against EU regulatory seals
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {currentResult && !isValidating && (
                  <ValidationResults result={currentResult} />
                )}

                {!uploadedImage && !isValidating && (
                  <Card className="p-12 border-0 shadow-sm bg-muted/20">
                    <div className="flex flex-col items-center justify-center gap-6 text-center">
                      <div className="rounded-full bg-muted p-8">
                        <ShieldCheck size={56} className="text-muted-foreground/50" weight="duotone" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Ready to validate</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          Upload a product label to begin compliance validation
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reference">
            <ReferenceSealGallery />
          </TabsContent>

          <TabsContent value="history">
            {showHistoryDetail && selectedHistoryResult ? (
              <HistoryDetailView
                result={selectedHistoryResult}
                onBack={handleBackFromHistory}
              />
            ) : (
              <div className="max-w-3xl mx-auto">
                <ValidationHistory
                  history={validationHistory || []}
                  onSelect={handleSelectHistoryItem}
                  onClear={handleClearHistory}
                  selectedId={selectedHistoryResult?.id}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;