import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { type ValidationResult } from '@/lib
interface DashboardProps {
}

    if (history.length ===
  history: ValidationResult[];
}

export function Dashboard({ history }: DashboardProps) {
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalValidations: 0,
        uniqueProduct
      };

    const warningCou
    const totalConfidence = h
    
      result.detectedSeals.for
      });

      .m
     


      totalValidations: history.length,
      warningCount,
      passRate: Math.round((passCount / history.length) * 100),
      topDetectedSeals: topSeals,
    
    };

    return (
        <
       


          <div className="flex flex-col items-ce
              <ShieldCheck size={56} cla
            <div cl

              </p>
          </div>

  }
  return (
      <div class
        <p classNam
        </p>

        <Card className="p-6 border-0 shadow-lg">
            <div className="space
              <p classNam
            <div clas
            </div>
      
            <spa

        <Card className="p-6 
            
              <p className="text-3xl font
            <div className="ro
            </div>
          <Progress value={stats.passRate} clas

          <div
              

              <WarningCircle size={28} weight="duotone" classN
          </div>
        </Card>
        <Card className="p-6 border-0 shadow-lg">
            <div c
              <p className="text-3xl fo
            <div className="rounded-full bg-secondary p-3">
            </div>
        </Card>

        <Card clas
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your validation activity and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Total validations</p>
              <p className="text-3xl font-bold tracking-tight">{stats.totalValidations}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <ShieldCheck size={28} weight="duotone" className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendUp size={16} weight="bold" className="text-accent" />
            <span>{stats.totalSealsDetected} total seals detected</span>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Pass rate</p>
              <p className="text-3xl font-bold tracking-tight">{stats.passRate}%</p>
            </div>
            <div className="rounded-full bg-accent/10 p-3">
              <CheckCircle size={28} weight="duotone" className="text-accent" />
            </div>
          </div>
          <Progress value={stats.passRate} className="h-2" />
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Avg. confidence</p>
              <p className="text-3xl font-bold tracking-tight">{stats.averageConfidence}%</p>
            </div>
            <div className="rounded-full bg-warning/10 p-3">
              <WarningCircle size={28} weight="duotone" className="text-warning" />
            </div>
          </div>
          <Progress value={stats.averageConfidence} className="h-2" />
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Unique products</p>
              <p className="text-3xl font-bold tracking-tight">{stats.uniqueProducts}</p>
            </div>
            <div className="rounded-full bg-secondary p-3">
              <ShieldCheck size={28} weight="duotone" className="text-secondary-foreground" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Validation breakdown</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                  <span className="font-medium">Passed</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.passCount} validations</span>
              </div>
              <Progress value={(stats.passCount / stats.totalValidations) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WarningCircle size={20} weight="fill" className="text-warning" />
                  <span className="font-medium">Warning</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.warningCount} validations</span>
              </div>
              <Progress value={(stats.warningCount / stats.totalValidations) * 100} className="h-2 [&>div]:bg-warning" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle size={20} weight="fill" className="text-destructive" />
                  <span className="font-medium">Failed</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.failCount} validations</span>
              </div>
              <Progress value={(stats.failCount / stats.totalValidations) * 100} className="h-2 [&>div]:bg-destructive" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-6 tracking-tight">Top detected seals</h3>
          {stats.topDetectedSeals.length > 0 ? (
            <div className="space-y-4">
              {stats.topDetectedSeals.map((seal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{seal.name}</span>
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
            <p className="text-muted-foreground text-sm">No seals detected yet</p>
          )}
        </Card>
      </div>

      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-6 tracking-tight">Recent activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.map((result) => {
            const statusColor = result.status === 'pass' ? 'text-accent' : result.status === 'warning' ? 'text-warning' : 'text-destructive';
            const StatusIcon = result.status === 'pass' ? CheckCircle : result.status === 'warning' ? WarningCircle : XCircle;
            
            return (
              <div key={result.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={result.imageUrl}
                    alt={result.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {result.detectedSeals.length} seals detected • {result.overallConfidence}% confidence
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon size={24} weight="fill" className={statusColor} />
                  <Badge className={getStatusColorClass(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}











