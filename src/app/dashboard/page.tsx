'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dashboard } from '@/components/Dashboard';
import { type ValidationResult } from '@/lib/sealData';

export default function DashboardPage() {
  const router = useRouter();
  const [validationHistory, setValidationHistory] = useState<ValidationResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('validation-history');
    setValidationHistory(saved ? JSON.parse(saved) : []);
  }, []);

  const handleSelectResult = (result: ValidationResult) => {
    router.push(`/history/${result.id}`);
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
              <Button variant="ghost" onClick={() => router.push('/validate')} className="rounded-full hover:bg-primary/5">
                Validate
              </Button>
              <Button variant="ghost" onClick={() => router.push('/reference')} className="rounded-full hover:bg-primary/5">
                Reference
              </Button>
              <Button variant="ghost" onClick={() => router.push('/history')} className="rounded-full hover:bg-primary/5">
                History
              </Button>
              <Button variant="ghost" onClick={() => router.push('/')} className="rounded-full hover:bg-primary/5">
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12 py-8">
        <Dashboard history={validationHistory} onSelectResult={handleSelectResult} />
      </main>
    </div>
  );
}
