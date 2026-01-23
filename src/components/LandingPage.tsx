'use client';

import { ShieldCheck, Lightning, CheckCircle, ArrowRight, Books, Sparkle, Seal } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-md bg-card/80 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 py-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <img src="/henkel-logo.jpg" alt="Henkel" className="h-14 w-auto object-contain" />
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="flex items-center gap-2.5">
                <div className="p-2 henkel-gradient rounded-xl shadow-sm">
                  <ShieldCheck size={24} weight="fill" className="text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  Validator
                </span>
              </div>
            </div>
            <Button onClick={onGetStarted} size="sm" className="rounded-full px-5 font-medium shadow-sm henkel-gradient hover:shadow-md transition-shadow">
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12">
        <section className="py-16 lg:py-24 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary/5 to-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20 shadow-sm">
            <Sparkle size={16} weight="fill" />
            AI-Powered Compliance
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight mb-6 leading-tight">
            Validate product labels<br />in <span className="text-primary">seconds</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Automated EU CLP/GHS seal validation powered by GPT-4o vision AI. 
            Ensure regulatory compliance with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={onGetStarted} size="lg" className="text-base rounded-full px-8 h-14 font-medium shadow-lg hover:shadow-xl transition-shadow henkel-gradient">
              Get started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base rounded-full px-8 h-14 font-medium border-2 hover:border-primary hover:text-primary transition-colors"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn more
            </Button>
          </div>
        </section>

        <section className="pb-20 lg:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full transition-all group-hover:w-40 group-hover:h-40" />
              <div className="p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl w-fit mb-6 relative">
                <Lightning size={28} weight="duotone" className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 relative">Instant validation</h3>
              <p className="text-muted-foreground leading-relaxed relative">
                Upload your product label and receive compliance results in seconds. 
                No manual inspection required.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-all group-hover:w-40 group-hover:h-40" />
              <div className="p-3 henkel-gradient rounded-2xl w-fit mb-6 shadow-sm relative">
                <Seal size={28} weight="duotone" className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 relative">EU compliant</h3>
              <p className="text-muted-foreground leading-relaxed relative">
                Validates against 15 official EU CLP/GHS regulatory seals. 
                Stay compliant with current standards.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full transition-all group-hover:w-40 group-hover:h-40" />
              <div className="p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl w-fit mb-6 relative">
                <CheckCircle size={28} weight="duotone" className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 relative">AI-powered accuracy</h3>
              <p className="text-muted-foreground leading-relaxed relative">
                Leverages GPT-4o vision model for precise seal detection and 
                confidence scoring.
              </p>
            </Card>
          </div>
        </section>

        <section id="features" className="py-20 lg:py-32 -mx-6 lg:-mx-12 px-6 lg:px-12 henkel-gradient-subtle border-y">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-semibold mb-6 tracking-tight">How it works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                Our streamlined process ensures fast, accurate compliance validation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full henkel-gradient text-white flex items-center justify-center font-semibold text-lg shadow-md">
                    1
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-lg mb-2">Upload product label</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Drag and drop or select your product label image for analysis
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full henkel-gradient text-white flex items-center justify-center font-semibold text-lg shadow-md">
                    2
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-lg mb-2">AI analysis</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      GPT-4o compares your label against 15 EU regulatory seals
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full henkel-gradient text-white flex items-center justify-center font-semibold text-lg shadow-md">
                    3
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-lg mb-2">Review results</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Get detailed compliance report with seal detection and confidence scores
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full henkel-gradient text-white flex items-center justify-center font-semibold text-lg shadow-md">
                    4
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-lg mb-2">Track history</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Access previous validations for auditing and compliance tracking
                    </p>
                  </div>
                </div>
              </div>

              <Card className="p-0 overflow-hidden shadow-xl border-2 border-primary/10">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--henkel-red),0.1),transparent)]" />
                  <div className="text-center space-y-6 relative">
                    <div className="inline-block p-4 henkel-gradient rounded-2xl shadow-lg">
                      <ShieldCheck size={80} weight="duotone" className="text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Validation interface</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 lg:p-16 text-center bg-gradient-to-br from-primary/5 via-background to-accent/5 border-2 border-primary/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-tr-full" />
              <div className="relative">
                <div className="inline-block p-4 henkel-gradient rounded-2xl shadow-md mb-6">
                  <ShieldCheck size={56} weight="duotone" className="text-white" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-semibold mb-4 tracking-tight">Ready to validate?</h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto font-light">
                  Start validating your product labels against EU regulatory standards today
                </p>
                <Button onClick={onGetStarted} size="lg" className="text-base rounded-full px-8 h-14 font-medium shadow-lg hover:shadow-xl transition-shadow henkel-gradient">
                  Get started
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <img src={henkelLogo} alt="Henkel" className="h-8 w-auto object-contain" />
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 henkel-gradient rounded-lg shadow-sm">
                  <ShieldCheck size={18} weight="duotone" className="text-white" />
                </div>
                <span className="font-medium">Regulatory Compliance Validator</span>
              </div>
            </div>
            <div className="font-light">
              Powered by GPT-4o Vision AI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
