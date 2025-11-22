'use client';

import { motion } from 'framer-motion';
import { InvitationVariationDirective } from '@/config/invitationVariations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InvitationVariationSelectorProps {
  variations: InvitationVariationDirective[];
  selected: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}

export function InvitationVariationSelector({
  variations,
  selected,
  onChange,
  max = 6,
}: InvitationVariationSelectorProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Variation Styles</p>
          <p className="text-xs text-muted-foreground">Pick up to {max} distinct directions.</p>
        </div>
        <Badge variant="secondary">{selected.length} selected</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {variations.map((variation) => {
          const isSelected = selected.includes(variation.id);
          return (
            <motion.div key={variation.id} layout>
              <Card
                onClick={() => toggle(variation.id)}
                className={`cursor-pointer border-2 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold">{variation.name}</h5>
                    {isSelected && <Badge variant="default">Active</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{variation.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
