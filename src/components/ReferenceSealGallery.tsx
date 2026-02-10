import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { REGULATORY_SEALS, type RegulatorySeal } from '@/lib/sealData';

export function ReferenceSealGallery() {
  const getCategoryColor = (category: RegulatorySeal['category']) => {
    switch (category) {
      case 'physical':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'health':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'environmental':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getCategoryLabel = (category: RegulatorySeal['category']) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold mb-3 tracking-tight">EU regulatory seals</h2>
        <p className="text-lg text-muted-foreground">
          Complete library of 15 EU CLP/GHS regulatory hazard pictograms used for validation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {REGULATORY_SEALS.map((seal) => (
          <Card key={seal.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-sm">
            <div className="space-y-4">
              <div className="aspect-square bg-muted/30 rounded-2xl flex items-center justify-center border border-border/50 p-4">
                {seal.imageUrl ? (
                  <img 
                    src={seal.imageUrl} 
                    alt={seal.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-4xl font-bold text-primary">{seal.code}</div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-base leading-tight">{seal.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-medium ${getCategoryColor(seal.category)}`}
                    >
                      {getCategoryLabel(seal.category)}
                    </Badge>
                    <span className="text-xs font-mono font-semibold text-primary">
                      {seal.code}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {seal.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-muted/20 border-0 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 tracking-tight">About EU CLP/GHS pictograms</h3>
        <div className="space-y-3 text-muted-foreground leading-relaxed">
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
