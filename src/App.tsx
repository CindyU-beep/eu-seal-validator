import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { ShieldCheck, Books, ClockCounterClockwise, House } from '@phosphor-icons/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { LandingPage } from '@/components/LandingPage';
import { ImageUpload } from '@/components/ImageUpload';
import { ValidationResults } from '@/components/ValidationResults';
import { ReferenceSealGallery } from '@/components/ReferenceSealGallery';
import { ValidationHistory } from '@/components/ValidationHistory';
import { validateProductLabel } from '@/lib/validationService';
import { type ValidationResult } from '@/lib/sealData';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [currentResult, setCurrentResult] = useState<ValidationResult | null>(null);
  const [validationHistory, setValidationHistory] = useKV<ValidationResult[]>('validation-history', []);
  const [activeTab, setActiveTab] = useState('validate');

  const handleImageSelect = (imageBase64: string, file: File) => {
    setUploadedImage(imageBase64);
    setCurrentFile(file);
    setCurrentResult(null);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    setCurrentFile(null);
    setCurrentResult(null);
  };

  const handleValidate = async () => {
    if (!uploadedImage || !currentFile) {
      toast.error('Please upload an image first');
      return;
    }

    setIsValidating(true);
    setCurrentResult(null);

    try {
      const result = await validateProductLabel(uploadedImage, currentFile.name);
      setCurrentResult(result);
      
      setValidationHistory((prevHistory) => [result, ...(prevHistory || [])]);

      if (result.status === 'pass') {
        toast.success('Validation Complete', {
          description: 'All regulatory seals validated successfully'
        });
      } else if (result.status === 'warning') {
        toast.warning('Validation Complete with Warnings', {
          description: 'Some issues detected. Review the results.'
        });
      } else {
        toast.error('Validation Failed', {
          description: 'Critical compliance issues detected'
        });
      }
    } catch (error) {
      toast.error('Validation Error', {
        description: error instanceof Error ? error.message : 'Failed to validate image'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectHistoryItem = (result: ValidationResult) => {
    setCurrentResult(result);
    setUploadedImage(result.imageUrl);
    setActiveTab('validate');
  };

  const handleClearHistory = () => {
    setValidationHistory([]);
    toast.success('History cleared');
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-md bg-card/80">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary rounded-xl">
                <ShieldCheck size={24} weight="fill" className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Henkel Validator
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  AI-Powered Compliance
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLanding(true)}
              className="rounded-full font-medium"
            >
              <House size={18} weight="duotone" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 h-12 bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="validate" className="gap-2 rounded-full data-[state=active]:shadow-sm">
              <ShieldCheck size={18} weight="duotone" />
              Validate
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
            <ValidationHistory
              history={validationHistory || []}
              onSelect={handleSelectHistoryItem}
              onClear={handleClearHistory}
              selectedId={currentResult?.id}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;