'use client';

import { motion } from 'framer-motion';
import { InvitationTemplate } from '@/config/invitationTemplates';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface InvitationTemplateGalleryProps {
  templates: InvitationTemplate[];
  selectedTemplateId?: string;
  onSelect: (id: string) => void;
}

export function InvitationTemplateGallery({
  templates,
  selectedTemplateId,
  onSelect,
}: InvitationTemplateGalleryProps) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Template Inspiration
        </h4>
        <p className="text-sm text-muted-foreground">
          Choose a layout reference to guide the AI prompt.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-200 dark:border-emerald-900/40 p-6 text-sm text-muted-foreground bg-emerald-50/40 dark:bg-emerald-950/10">
          No curated templates for this category yet. Save a style you like and we&apos;ll surface matching reference layouts soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            return (
              <motion.div
                key={template.id}
                layout
                whileHover={{ scale: 1.01 }}
                className="relative"
              >
                <Card
                  onClick={() => onSelect(template.id)}
                  className={`cursor-pointer overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 shadow-lg shadow-emerald-200/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {template.thumbnail ? (
                    <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-900">
                      <Image
                        src={template.thumbnail}
                        alt={template.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800" />
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h5 className="font-semibold">{template.title}</h5>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      {isSelected && <Badge variant="default">Active</Badge>}
                    </div>
                    {template.promptCues?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {template.promptCues.map((cue) => (
                          <Badge
                            key={cue}
                            variant="outline"
                            className="text-[10px] uppercase tracking-wide"
                          >
                            {cue}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {template.layoutNotes && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-300">
                        {template.layoutNotes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
