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
      <header className="border-b bg-card">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck size={32} weight="duotone" className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Henkel Regulatory Compliance Validator
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered EU CLP/GHS Seal Detection System
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLanding(true)}
            >
              <House size={18} weight="duotone" />
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="validate" className="gap-2">
              <ShieldCheck size={18} weight="duotone" />
              Validate
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2">
              <Books size={18} weight="duotone" />
              Reference
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <ClockCounterClockwise size={18} weight="duotone" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Upload Product Label</h2>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    currentImage={uploadedImage || undefined}
                    onClear={handleClearImage}
                    disabled={isValidating}
                  />
                </Card>

                {uploadedImage && !currentResult && (
                  <Button
                    onClick={handleValidate}
                    disabled={isValidating}
                    size="lg"
                    className="w-full"
                  >
                    {isValidating ? (
                      <>
                        <Progress className="w-full h-2" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} weight="bold" />
                        Validate Label
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div>
                {isValidating && (
                  <Card className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Analyzing Label...</h3>
                        <p className="text-sm text-muted-foreground">
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
                  <Card className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <div className="rounded-full bg-muted p-6">
                        <ShieldCheck size={48} className="text-muted-foreground" weight="duotone" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Ready to Validate</h3>
                        <p className="text-sm text-muted-foreground">
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