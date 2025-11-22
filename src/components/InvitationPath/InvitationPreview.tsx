'use client';

import { EventDetails, InvitationCategory, InvitationStyle } from '@/config/invitations';
import { Badge } from '@/components/ui/badge';

interface InvitationPreviewProps {
  details: EventDetails;
  category?: InvitationCategory;
  style?: InvitationStyle;
  aspectRatio: string;
  outputFormats: string[];
  variantCount: number;
  colorPalette?: string[];
  templateName?: string;
}

export function InvitationPreview({
  details,
  category,
  style,
  aspectRatio,
  outputFormats,
  variantCount,
  colorPalette,
  templateName,
}: InvitationPreviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-900/20 p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Previewing</p>
          <p className="text-lg font-semibold">{category ? `${category.icon} ${category.name}` : 'Select a category'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {outputFormats.map((format) => (
            <Badge key={format} variant="outline">{format.toUpperCase()}</Badge>
          ))}
          <Badge variant="secondary">Aspect {aspectRatio}</Badge>
          <Badge variant="secondary">{variantCount} variant{variantCount !== 1 ? 's' : ''}</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold">{details.title || 'Untitled Event'}</p>
        {details.subtitle && <p className="text-muted-foreground">{details.subtitle}</p>}
        {templateName && (
          <Badge variant="outline" className="rounded-full">
            Template: {templateName}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-200">Key Details</p>
          <ul className="space-y-1 text-muted-foreground">
            {details.date && <li>Date: {details.date}</li>}
            {details.time && <li>Time: {details.time}</li>}
            {details.location && <li>Location: {details.location}</li>}
            {details.hostName && <li>Host: {details.hostName}</li>}
            {details.rsvpInfo && <li>RSVP: {details.rsvpInfo}</li>}
            {details.moodKeywords && <li>Mood: {details.moodKeywords}</li>}
            {details.dressCode && <li>Dress: {details.dressCode}</li>}
          </ul>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-200">Design Direction</p>
          <p className="text-muted-foreground">
            {style
              ? `${style.name} • ${style.description}`
              : 'Choose a style to unlock AI design guidance.'}
          </p>
          {(colorPalette?.length || style?.colorScheme?.length) && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {(colorPalette?.length ? colorPalette : style?.colorScheme)?.map((color) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <span
                    className="h-8 w-8 rounded-full border border-white dark:border-slate-900 shadow"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {color.replace('#', '')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {details.description && (
        <div className="rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-3 text-sm">
          <p className="font-semibold mb-1">Story</p>
          <p className="text-muted-foreground">{details.description}</p>
        </div>
      )}
    </div>
  );
}
