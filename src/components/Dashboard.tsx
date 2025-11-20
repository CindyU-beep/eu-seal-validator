import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/prog

  history: ValidationResult[];


      return 'bg-accent te
  history: ValidationResult[];
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

export function Dashboard({ history }: DashboardProps) {
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
      <div classNa
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No validation data yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Start validating product labels to see your dashboard metrics
              </p>
          </div>
            </di
              <
            
      
   

          
              <p className="text-sm text-muted-fo
            </div>
              <ShieldCheck size={28} weight="duotone" className="text-seconda
          </div>
      </div>
      <div c
          <h

                <div className="flex items-center gap-2">
                  <span className="font-medium">P
                <span className="text-sm text-muted-foreground">{s
              <Progress value={(stats.p

              <div className="flex items-center justify-between">
                  
                </div>
              </div>
            </div>
            <div
                <div className="flex items-center gap-2">
                  <span className="font-medium">Failed</span>
                <span className="text-sm text-muted-foreground">{stats.f
              <P
          </div

          <h3 className="text-lg font-semibold mb
            <div className="space-y-4">
                <div key={index} classN
                    <span className="font-medium text-sm">{seal.name}</span>
                  </div>
                  
                  />
              ))}
          ) : (
          )}
      </div>
      <Card cla

            const statusColor = result.status ===
            
              <div key={result.id} clas
                  <img
                    alt={result.fileName}
                  
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">
                  
                
                  <Badge className={getStatusColorClass(result.status)
               

          })}
      </Card>
  );











































































































