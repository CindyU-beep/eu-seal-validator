'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ShieldCheck } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { HistoryDetailView } from '@/components/HistoryDetailView';
import { type ValidationResult } from '@/lib/sealData';

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('validation-history');
    if (saved) {
      const history: ValidationResult[] = JSON.parse(saved);
      const found = history.find((item) => item.id === params.id);
      setResult(found || null);
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/history');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Result not found</h2>
          <Button onClick={handleBack}>Back to History</Button>
        </div>
      </div>
    );
  }

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
              <Button variant="ghost" onClick={() => router.push('/')} className="rounded-full hover:bg-primary/5">
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-8">
        <HistoryDetailView result={result} onBack={handleBack} />
      </main>
    </div>
  );
}
