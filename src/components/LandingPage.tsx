import { ShieldCheck, Lightning, CheckCircle, ArrowRight, Books, Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck size={28} weight="duotone" className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Henkel Compliance Validator
                </h1>
              </div>
            </div>
            <Button onClick={onGetStarted} size="sm">
              Launch App
              <ArrowRight size={16} weight="bold" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8">
        <section className="py-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            <Sparkle size={16} weight="fill" />
            AI-Powered Regulatory Compliance
          </div>
          
          <h2 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Automated EU CLP/GHS Seal Validation
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Validate product label compliance in seconds with GPT-4o vision AI. 
            Ensure your labels meet EU regulatory standards with confidence.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button onClick={onGetStarted} size="lg" className="text-base">
              Get Started
              <ArrowRight size={20} weight="bold" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </section>

        <section className="pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <Lightning size={32} weight="duotone" className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Validation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload your product label and receive compliance results in seconds. 
                No manual inspection required.
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <ShieldCheck size={32} weight="duotone" className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">EU Compliant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Validates against 15 official EU CLP/GHS regulatory seals. 
                Stay compliant with current standards.
              </p>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-colors">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <CheckCircle size={32} weight="duotone" className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Accuracy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Leverages GPT-4o vision model for precise seal detection and 
                confidence scoring.
              </p>
            </Card>
          </div>
        </section>

        <section id="features" className="py-20 bg-card/30 -mx-8 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">How It Works</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our streamlined process ensures fast, accurate compliance validation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Upload Product Label</h4>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or select your product label image for analysis
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">AI Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      GPT-4o compares your label against 15 EU regulatory seals
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Receive Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Get detailed compliance report with seal detection and confidence scores
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Track History</h4>
                    <p className="text-sm text-muted-foreground">
                      Access previous validations for auditing and compliance tracking
                    </p>
                  </div>
                </div>
              </div>

              <Card className="p-8">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 via-accent/5 to-background flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <ShieldCheck size={80} weight="duotone" className="text-primary mx-auto" />
                    <p className="text-sm text-muted-foreground">Validation Interface Preview</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto">
            <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-2">
              <Books size={48} weight="duotone" className="text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Ready to Validate?</h3>
              <p className="text-muted-foreground mb-6">
                Start validating your product labels against EU regulatory standards today
              </p>
              <Button onClick={onGetStarted} size="lg" className="text-base">
                Launch Validator
                <ArrowRight size={20} weight="bold" />
              </Button>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/30 py-8">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} weight="duotone" className="text-primary" />
              <span>Henkel Regulatory Compliance Validator</span>
            </div>
            <div>
              Powered by GPT-4o Vision AI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
