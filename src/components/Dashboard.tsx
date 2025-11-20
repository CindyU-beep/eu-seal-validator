import { useMemo } from 'react';
import { ChartBar, CheckCircle, WarningCircle, XCircle, TrendUp, Clock, ShieldCheck } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge
import { type ValidationResult } from '@/lib/s
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
        passRate: 0,
        topDetectedSeals
        totalSealsDet
      };

    const warningCount = hist
    const totalConfidence =
    const sealCounts = new Map
    
      re
     

    const topSeals = Array.from(sealCounts.entries())
      .slice(0, 5)


    
      warningCount,
      passRate: Math.round((
    
      totalSealsDetected: total
    };

    return (
        <
       

            <p className="text-muted-foreground">
            </p>
        </div>
    );

    <div className="space-y-6">

          Ov
      </div>
      <div class
          <div clas
              <p
            </div>
              <ShieldCheck size={28} weight="duotone" className="text-
          </div>

          <div className="flex items-cente
              <p className="text-sm te
      
              <T

        </Card>
        <Car
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight">{stats.averageConfiden
            <div className="rounded-full bg-warning/1
            </div>
          <Progr

          <div className="flex items-center justify-between">
              <p className="text-sm text-muted-fo
            </div>
              <C
          </div>
      </div>
      <div cl
      
   

          
                <span className
              <Progress value={(s

              <div className="flex items-center justi
                  <WarningCircle size={20} weight="fill" className="
            
            

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Failed</span>
                <span className="text-s
              <Progress value={(stats.failCount / stats.totalValidations) * 100} className="
          </div>
          <div cla
              <div>
                <p className="text-2xl font-bold">{stats.uniqueProducts}</p>
              <div
                
            </d

        <Card className="p-6 border-0 shadow-lg">
          {stats.topDetectedSeals.length > 0 ? (
              {stats.topDetectedSeals.m
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="ml-2">{seal.count}</Badge>
                  
                    className="h-2"
                </div>
            </div>
            <p c
        </Card>


          {stats.recentActivity.map((result) => {
            const statusColor = result.status === 'pass' ? 't
            return (
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-mute
                    src={result.imageUrl}
                  
                </div>
                <div className="flex-1 min-w-0">
                  
                
                    {result.detectedSeals.length} seals detected • {result.ov
               

                </Badge>
            );
        </div>
    </div>
}
function getStatus
    case 'pass':
    case 'warning':
    case 'fail':
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
