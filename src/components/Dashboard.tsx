import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ShieldCheck, TrendUp, Package, Seal } from '@phosphor-icons/react';
import { type ValidationResult } from '@/lib/sealData';

interface DashboardProps {
  history: ValidationResult[];
  onSelectResult?: (result: ValidationResult) => void;
}

function getStatusColorClass(status: 'pass' | 'fail' | 'warning'): string {
  switch (status) {
    case 'pass':
      return 'bg-accent text-accent-foreground';
    case 'fail':
      return 'bg-destructive text-destructive-foreground';
    case 'warning':
      return 'bg-warning text-warning-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function Dashboard({ history, onSelectResult }: DashboardProps) {
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalValidations: 0,
        uniqueProducts: 0,
        passCount: 0,
        failCount: 0,
        warningCount: 0,
        passRate: 0,
        averageConfidence: 0,
        totalSealsDetected: 0,
        topDetectedSeals: [],
        recentActivity: [],
      };
    }

    const passCount = history.filter(r => r.status === 'pass').length;
    const failCount = history.filter(r => r.status === 'fail').length;
    const warningCount = history.filter(r => r.status === 'warning').length;
    
    const totalConfidence = history.reduce((sum, result) => sum + result.overallConfidence, 0);
    const averageConfidence = Math.round(totalConfidence / history.length);
    
    const uniqueProducts = new Set(history.map(r => r.fileName)).size;
    
    const sealCounts = new Map<string, number>();
    let totalSealsDetected = 0;
    
    history.forEach(result => {
      result.detectedSeals.forEach(seal => {
        if (seal.present) {
          totalSealsDetected++;
          const count = sealCounts.get(seal.sealName) || 0;
          sealCounts.set(seal.sealName, count + 1);
        }
      });
    });
    
    const topDetectedSeals = Array.from(sealCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentActivity = history.slice(0, 5);

    return {
      totalValidations: history.length,
      uniqueProducts,
      passCount,
      failCount,
      warningCount,
      passRate: Math.round((passCount / history.length) * 100),
      averageConfidence,
      totalSealsDetected,
      topDetectedSeals,
      recentActivity,
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="p-12 border-0 shadow-sm bg-muted/20">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="rounded-full bg-muted p-8">
              <ShieldCheck size={56} className="text-muted-foreground/50" weight="duotone" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No validation data yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start validating product labels to see your dashboard metrics
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Validations</p>
              <p className="text-3xl font-bold">{stats.totalValidations}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <ShieldCheck size={28} weight="duotone" className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Unique Products</p>
              <p className="text-3xl font-bold">{stats.uniqueProducts}</p>
            </div>
            <div className="rounded-lg bg-accent/10 p-3">
              <Package size={28} weight="duotone" className="text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pass Rate</p>
              <p className="text-3xl font-bold">{stats.passRate}%</p>
            </div>
            <div className="rounded-lg bg-accent/10 p-3">
              <TrendUp size={28} weight="duotone" className="text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seals Detected</p>
              <p className="text-3xl font-bold">{stats.totalSealsDetected}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3">
              <Seal size={28} weight="duotone" className="text-secondary-foreground" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-0 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Validation Status</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Passed</span>
                  <span className="text-sm text-muted-foreground">{stats.passCount} validations</span>
                </div>
                <span className="text-sm font-medium">{stats.passRate}%</span>
              </div>
              <Progress value={(stats.passCount / stats.totalValidations) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Failed</span>
                  <span className="text-sm text-muted-foreground">{stats.failCount} validations</span>
                </div>
                <span className="text-sm font-medium">{Math.round((stats.failCount / stats.totalValidations) * 100)}%</span>
              </div>
              <Progress value={(stats.failCount / stats.totalValidations) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Warnings</span>
                  <span className="text-sm text-muted-foreground">{stats.warningCount} validations</span>
                </div>
                <span className="text-sm font-medium">{Math.round((stats.warningCount / stats.totalValidations) * 100)}%</span>
              </div>
              <Progress value={(stats.warningCount / stats.totalValidations) * 100} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Top Detected Seals</h3>
          {stats.topDetectedSeals.length > 0 ? (
            <div className="space-y-4">
              {stats.topDetectedSeals.map((seal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{seal.name}</span>
                    <span className="text-sm text-muted-foreground">{seal.count} times</span>
                  </div>
                  <Progress 
                    value={(seal.count / stats.totalSealsDetected) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No seals detected yet</p>
          )}
        </Card>
      </div>

      <Card className="p-6 border-0 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.map((result) => (
            <div 
              key={result.id} 
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelectResult?.(result)}
            >
              <div className="shrink-0 w-16 h-16 rounded-lg bg-muted overflow-hidden">
                <img
                  src={result.imageUrl}
                  alt={result.fileName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{result.fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(result.timestamp).toLocaleDateString()} • {result.detectedSeals.filter(s => s.present).length} seals detected
                </p>
              </div>
              <Badge className={getStatusColorClass(result.status)}>
                {result.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
