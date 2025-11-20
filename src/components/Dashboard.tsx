import { useMemo } from 'react';
import { ChartBar, CheckCircle, WarningCircle, XCircle, TrendUp, Clock, ShieldCheck } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { type ValidationResult } from '@/lib/sealData';

interface DashboardProps {
  history: ValidationResult[];
}

export function Dashboard({ history }: DashboardProps) {
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalValidations: 0,
        passCount: 0,
        warningCount: 0,
        failCount: 0,
        passRate: 0,
        averageConfidence: 0,
        topDetectedSeals: [],
        recentActivity: [],
        totalSealsDetected: 0,
        uniqueProducts: 0,
      };
    }

    const passCount = history.filter(r => r.status === 'pass').length;
    const warningCount = history.filter(r => r.status === 'warning').length;
    const failCount = history.filter(r => r.status === 'fail').length;
    const totalConfidence = history.reduce((sum, r) => sum + r.overallConfidence, 0);
    
    const sealCounts = new Map<string, number>();
    let totalDetections = 0;
    
    history.forEach(result => {
      result.detectedSeals.forEach(seal => {
        sealCounts.set(seal.sealName, (sealCounts.get(seal.sealName) || 0) + 1);
        totalDetections++;
      });
    });

    const topSeals = Array.from(sealCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const uniqueFileNames = new Set(history.map(r => r.fileName)).size;

    return {
      totalValidations: history.length,
      passCount,
      warningCount,
      failCount,
      passRate: Math.round((passCount / history.length) * 100),
      averageConfidence: Math.round(totalConfidence / history.length),
      topDetectedSeals: topSeals,
      recentActivity: history.slice(0, 5),
      totalSealsDetected: totalDetections,
      uniqueProducts: uniqueFileNames,
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <Card className="p-16 border-0 shadow-sm bg-muted/20">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="rounded-full bg-muted p-8">
            <ChartBar size={56} className="text-muted-foreground/50" weight="duotone" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold tracking-tight">No data available</h3>
            <p className="text-muted-foreground">
              Start validating product labels to see your analytics dashboard
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Analytics dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Overview of your validation activity and compliance trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Total validations</p>
              <p className="text-3xl font-bold tracking-tight">{stats.totalValidations}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <ShieldCheck size={28} weight="duotone" className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-accent/5 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Pass rate</p>
              <p className="text-3xl font-bold tracking-tight">{stats.passRate}%</p>
            </div>
            <div className="rounded-full bg-accent/10 p-3">
              <TrendUp size={28} weight="duotone" className="text-accent" />
            </div>
          </div>
          <Progress value={stats.passRate} className="mt-3 h-1.5" />
        </Card>

        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Avg. confidence</p>
              <p className="text-3xl font-bold tracking-tight">{stats.averageConfidence}%</p>
            </div>
            <div className="rounded-full bg-warning/10 p-3">
              <ChartBar size={28} weight="duotone" className="text-warning" />
            </div>
          </div>
          <Progress value={stats.averageConfidence} className="mt-3 h-1.5" />
        </Card>

        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-muted/50 to-muted">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Seals detected</p>
              <p className="text-3xl font-bold tracking-tight">{stats.totalSealsDetected}</p>
            </div>
            <div className="rounded-full bg-muted p-3">
              <Clock size={28} weight="duotone" className="text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-0 shadow-lg lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Validation status breakdown</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                  <span className="font-medium">Passed</span>
                </div>
                <span className="text-sm font-mono font-semibold text-accent">{stats.passCount}</span>
              </div>
              <Progress value={(stats.passCount / stats.totalValidations) * 100} className="h-3" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WarningCircle size={20} weight="fill" className="text-warning" />
                  <span className="font-medium">Warnings</span>
                </div>
                <span className="text-sm font-mono font-semibold text-warning">{stats.warningCount}</span>
              </div>
              <Progress value={(stats.warningCount / stats.totalValidations) * 100} className="h-3" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle size={20} weight="fill" className="text-destructive" />
                  <span className="font-medium">Failed</span>
                </div>
                <span className="text-sm font-mono font-semibold text-destructive">{stats.failCount}</span>
              </div>
              <Progress value={(stats.failCount / stats.totalValidations) * 100} className="h-3" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Unique products</p>
                <p className="text-2xl font-bold">{stats.uniqueProducts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Success rate</p>
                <p className="text-2xl font-bold text-accent">{stats.passRate}%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Top detected seals</h3>
          {stats.topDetectedSeals.length > 0 ? (
            <div className="space-y-4">
              {stats.topDetectedSeals.map((seal, index) => (
                <div key={seal.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{seal.name}</span>
                    <Badge variant="secondary" className="ml-2">{seal.count}</Badge>
                  </div>
                  <Progress 
                    value={(seal.count / stats.totalValidations) * 100} 
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

      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-6 tracking-tight">Recent activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.map((result) => {
            const StatusIcon = result.status === 'pass' ? CheckCircle : result.status === 'warning' ? WarningCircle : XCircle;
            const statusColor = result.status === 'pass' ? 'text-accent' : result.status === 'warning' ? 'text-warning' : 'text-destructive';
            
            return (
              <div key={result.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30 border">
                  <img
                    src={result.imageUrl}
                    alt={result.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusIcon size={18} weight="fill" className={statusColor} />
                    <p className="font-medium truncate text-sm">{result.fileName}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {result.detectedSeals.length} seals detected • {result.overallConfidence}% confidence
                  </p>
                </div>

                <Badge className={getStatusColorClass(result.status)} variant="secondary">
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function getStatusColorClass(status: ValidationResult['status']): string {
  switch (status) {
    case 'pass':
      return 'bg-accent/10 text-accent hover:bg-accent/20 border-accent/20';
    case 'warning':
      return 'bg-warning/10 text-warning hover:bg-warning/20 border-warning/20';
    case 'fail':
      return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20';
  }
}
