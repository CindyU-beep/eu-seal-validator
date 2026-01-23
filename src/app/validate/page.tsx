'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { ValidationResults } from '@/components/ValidationResults';
import { validateProductLabel } from '@/lib/validationService';
import { type ValidationResult } from '@/lib/sealData';

export default function ValidatePage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [currentResult, setCurrentResult] = useState<ValidationResult | null>(null);

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
    if (!uploadedImage || !currentFile) return;

    setIsValidating(true);
    try {
      // TODO: Replace with API call to /api/validate
      const result = await validateProductLabel(uploadedImage, currentFile.name);
      setCurrentResult(result);
      
      // Save to localStorage (temporary until we add database)
      const history = JSON.parse(localStorage.getItem('validation-history') || '[]');
      localStorage.setItem('validation-history', JSON.stringify([result, ...history]));
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 py-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/henkel-logo.jpg" alt="Henkel" className="h-12 w-auto object-contain" />
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="flex items-center gap-3">
                <div className="rounded-xl henkel-gradient p-2.5 shadow-sm">
                  <ShieldCheck size={24} weight="bold" className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Validator</h1>
                  <p className="text-sm text-muted-foreground">EU Regulatory Compliance</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push('/reference')} className="rounded-full hover:bg-primary/5">
                Reference
              </Button>
              <Button variant="ghost" onClick={() => router.push('/history')} className="rounded-full hover:bg-primary/5">
                History
              </Button>
              <Button variant="ghost" onClick={() => router.push('/dashboard')} className="rounded-full hover:bg-primary/5">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push('/')} className="rounded-full hover:bg-primary/5">
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-8">
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
                  <>Validating...</>
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
      </main>
    </div>
  );
}
