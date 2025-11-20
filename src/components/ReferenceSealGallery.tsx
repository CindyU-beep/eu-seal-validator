import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { REGULATORY_SEALS, type RegulatorySeal } from '@/lib/sealData';
import { Shield } from '@phosphor-icons/react';

export function ReferenceSealGallery() {
  const getCategoryColor = (category: RegulatorySeal['category']) => {
    switch (category) {
      case 'physical':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'health':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'environmental':
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getCategoryLabel = (category: RegulatorySeal['category']) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">EU Regulatory Seals Reference</h2>
        <p className="text-muted-foreground">
          Complete library of 15 EU CLP/GHS regulatory hazard pictograms used for validation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {REGULATORY_SEALS.map((seal) => (
          <Card key={seal.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-border">
                <Shield size={64} weight="duotone" className="text-primary" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm leading-tight">{seal.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCategoryColor(seal.category)} flex-shrink-0`}
                  >
                    {getCategoryLabel(seal.category)}
                  </Badge>
                </div>
                
                <p className="text-xs font-mono font-semibold text-primary">
                  {seal.code}
                </p>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {seal.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">About EU CLP/GHS Pictograms</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            The Classification, Labelling and Packaging (CLP) Regulation adopts the Globally Harmonized System (GHS) 
            hazard pictograms across the EU to ensure consistent communication of chemical hazards.
          </p>
          <p>
            These standardized pictograms must appear on product labels to warn users of potential dangers. 
            Each pictogram has a distinctive red diamond border with a black symbol representing the specific hazard type.
          </p>
        </div>
      </Card>
    </div>
  );
}
