'use client';

import { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PenSquare, Quote, Calendar, Clock3, MapPin, StickyNote, UserRound, Phone, Rainbow } from 'lucide-react';
import { EventDetails } from '@/config/invitations';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface EventDetailsFormProps {
  value: EventDetails;
  onChange: (value: EventDetails) => void;
  disabled?: boolean;
}

const titleIdeas = [
  "Golden Hour Garden Party",
  "Neon Nights Mixer",
  "Celestial Dinner Club",
];

const vibeNotes = [
  'Cocktail attire • live DJ • rooftop sunset',
  'Cozy brunch • artisan coffee • polaroid booth',
  'Studio glam • immersive lighting • tapas bites',
];

const moodKeywords = [
  'Velvet noir • chrome glow • rooftop dusk',
  'Botanical brunch • analog cameras • vinyl jazz',
  'Gallery night • amber cocktails • skyline view',
];

const dressCodeIdeas = [
  'Desert glam neutrals',
  'Experimental cocktail attire',
  'Monochrome with metallic accents',
];

export function EventDetailsForm({ value, onChange, disabled = false }: EventDetailsFormProps) {
  const handleInputChange = (field: keyof EventDetails) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...value, [field]: event.target.value });
  };

  const applySuggestion = (field: keyof EventDetails, suggestion: string) => {
    if (disabled) return;
    onChange({ ...value, [field]: suggestion });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-rose-100 dark:border-rose-900/50 bg-gradient-to-r from-rose-100 via-white to-amber-100 dark:from-rose-950/40 dark:via-slate-950/50 dark:to-amber-900/10 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/80 dark:bg-slate-900/70 flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Event vibe brief</p>
            <h4 className="text-lg font-semibold">Paint a mini story—AI will style the invite around it.</h4>
          </div>
        </div>
        <Badge variant="outline" className="bg-white/80 dark:bg-slate-900/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-200">
          Creative cues fuel better layouts
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          icon={PenSquare}
          label="Event Title"
          description="Give it an unforgettable name"
        >
          <Input
            id="event-title"
            placeholder="E.g. Spellbound Supper Club"
            value={value.title}
            onChange={handleInputChange('title')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-rose-400"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {titleIdeas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => applySuggestion('title', idea)}
                className="px-3 py-1 rounded-full text-xs bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-200 border border-rose-100 dark:border-rose-800"
              >
                {idea}
              </button>
            ))}
          </div>
        </FieldCard>

        <FieldCard
          icon={Quote}
          label="Subtitle / Tagline"
          description="Optional motto or descriptor"
        >
          <Input
            id="event-subtitle"
            placeholder="An enchanted rooftop soirée"
            value={value.subtitle || ''}
            onChange={handleInputChange('subtitle')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-rose-400"
          />
        </FieldCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FieldCard icon={Calendar} label="Date" description="Pick the moment">
          <Input
            id="event-date"
            type="date"
            value={value.date}
            onChange={handleInputChange('date')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-purple-400"
          />
        </FieldCard>
        <FieldCard icon={Clock3} label="Time" description="Golden hour? Moonlit?">
          <Input
            id="event-time"
            type="time"
            value={value.time || ''}
            onChange={handleInputChange('time')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-purple-400"
          />
        </FieldCard>
        <FieldCard icon={MapPin} label="Location" description="Venue, loft, or fantasy world">
          <Input
            id="event-location"
            placeholder="Marigold Loft · 8th Ave"
            value={value.location || ''}
            onChange={handleInputChange('location')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-purple-400"
          />
        </FieldCard>
      </div>

      <FieldCard icon={StickyNote} label="Vibe Notes" description="Moodboard-worthy details">
        <Textarea
          id="event-description"
          rows={4}
          placeholder="Golden cocktail hour followed by neon-lit dance floor. Think velvet, vinyl, and sparkling mocktails."
          value={value.description || ''}
          onChange={handleInputChange('description')}
          disabled={disabled}
          className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-amber-400"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {vibeNotes.map((note) => (
            <button
              key={note}
              type="button"
              onClick={() => applySuggestion('description', note)}
              className="px-3 py-1 rounded-full text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-100 border border-amber-100 dark:border-amber-800"
            >
              {note}
            </button>
          ))}
        </div>
      </FieldCard>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard icon={Sparkles} label="Mood Keywords" description="Micro phrases the AI can echo">
          <Input
            id="event-mood"
            placeholder="E.g. velvet noir • skyline glow"
            value={value.moodKeywords || ''}
            onChange={handleInputChange('moodKeywords')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-fuchsia-400"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {moodKeywords.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => applySuggestion('moodKeywords', mood)}
                className="px-3 py-1 rounded-full text-xs bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-100 border border-fuchsia-100 dark:border-fuchsia-800"
              >
                {mood}
              </button>
            ))}
          </div>
        </FieldCard>

        <FieldCard icon={Rainbow} label="Dress Code / Attire" description="Give guests a styling nudge">
          <Input
            id="event-dress-code"
            placeholder="E.g. Luxe monochrome w/ metallic accent"
            value={value.dressCode || ''}
            onChange={handleInputChange('dressCode')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-sky-400"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {dressCodeIdeas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => applySuggestion('dressCode', idea)}
                className="px-3 py-1 rounded-full text-xs bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-100 border border-sky-100 dark:border-sky-800"
              >
                {idea}
              </button>
            ))}
          </div>
        </FieldCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard icon={UserRound} label="Host Name" description="Who’s welcoming guests?">
          <Input
            id="event-host"
            placeholder="Hosted by Mina & Jules"
            value={value.hostName || ''}
            onChange={handleInputChange('hostName')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-400"
          />
        </FieldCard>
        <FieldCard icon={Phone} label="RSVP Info" description="Email, text, or microsite">
          <Input
            id="event-rsvp"
            placeholder="RSVP hello@auroraclub.com by Oct 12"
            value={value.rsvpInfo || ''}
            onChange={handleInputChange('rsvpInfo')}
            disabled={disabled}
            className="bg-white/80 dark:bg-slate-950/40 border-none shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-400"
          />
        </FieldCard>
      </div>
    </div>
  );
}

interface FieldCardProps {
  icon: typeof Rainbow;
  label: string;
  description?: string;
  children: React.ReactNode;
}

function FieldCard({ icon: Icon, label, description, children }: FieldCardProps) {
  return (
    <motion.div
      layout
      className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/40 p-4 shadow-md overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/0 via-white/40 to-white/0 dark:via-slate-900/10" />
      <div className="relative flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60">
          <Icon className="h-4 w-4 text-slate-600 dark:text-slate-200" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}
