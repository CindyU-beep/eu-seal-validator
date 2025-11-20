import { ShieldCheck, Lightning, CheckCircle, ArrowRight, Books, Sparkle, Seal } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-md bg-card/80">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary rounded-xl">
                <ShieldCheck size={24} weight="fill" className="text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Henkel Validator
              </span>
            </div>
            <Button onClick={onGetStarted} size="sm" className="rounded-full px-5 font-medium">
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 lg:px-12">
        <section className="py-16 lg:py-24 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium mb-8 border border-primary/10">
            <Sparkle size={16} weight="fill" />
            AI-Powered Compliance
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight mb-6 leading-tight">
            Validate product labels<br />in seconds
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Automated EU CLP/GHS seal validation powered by GPT-4o vision AI. 
            Ensure regulatory compliance with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={onGetStarted} size="lg" className="text-base rounded-full px-8 h-14 font-medium shadow-lg hover:shadow-xl transition-shadow">
              Get started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base rounded-full px-8 h-14 font-medium"
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
            <Card className="p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card">
              <div className="p-3 bg-accent/10 rounded-2xl w-fit mb-6">
                <Lightning size={28} weight="duotone" className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant validation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload your product label and receive compliance results in seconds. 
                No manual inspection required.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card">
              <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6">
                <Seal size={28} weight="duotone" className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">EU compliant</h3>
              <p className="text-muted-foreground leading-relaxed">
                Validates against 15 official EU CLP/GHS regulatory seals. 
                Stay compliant with current standards.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-card">
              <div className="p-3 bg-accent/10 rounded-2xl w-fit mb-6">
                <CheckCircle size={28} weight="duotone" className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-powered accuracy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Leverages GPT-4o vision model for precise seal detection and 
                confidence scoring.
              </p>
            </Card>
          </div>
        </section>

        <section id="features" className="py-20 lg:py-32 -mx-6 lg:-mx-12 px-6 lg:px-12 bg-muted/30">
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
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg">
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
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg">
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
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg">
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
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg">
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

              <Card className="p-0 overflow-hidden shadow-lg border-0">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <ShieldCheck size={80} weight="duotone" className="text-primary mx-auto opacity-40" />
                    <p className="text-sm text-muted-foreground font-medium">Validation interface</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 lg:p-16 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-lg">
              <ShieldCheck size={56} weight="duotone" className="text-primary mx-auto mb-6" />
              <h3 className="text-3xl lg:text-4xl font-semibold mb-4 tracking-tight">Ready to validate?</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto font-light">
                Start validating your product labels against EU regulatory standards today
              </p>
              <Button onClick={onGetStarted} size="lg" className="text-base rounded-full px-8 h-14 font-medium shadow-lg hover:shadow-xl transition-shadow">
                Get started
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <ShieldCheck size={18} weight="duotone" className="text-primary" />
              </div>
              <span className="font-medium">Henkel Regulatory Compliance Validator</span>
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
