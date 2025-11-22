'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';

export interface AssetItem {
  id: string;
  kind: string;
  data_url?: string;
  url?: string;
  prompt?: string;
  created_at: string;
  source?: string;
}

interface AssetLibrarySheetProps {
  sessionId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: AssetItem) => void;
  filterKind?: string;
}

export function AssetLibrarySheet({
  sessionId,
  open,
  onOpenChange,
  onSelect,
  filterKind,
}: AssetLibrarySheetProps) {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !sessionId) return;
    let cancelled = false;
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ sessionId });
        if (filterKind) params.set('kind', filterKind);
        const response = await fetch(`/api/assets?${params.toString()}`);
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) {
          const filtered = (data.assets || []).filter((item: AssetItem) => item.data_url || item.url);
          setAssets(filtered);
        }
      } catch (error) {
        console.error('Failed to load assets', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, [open, sessionId, filterKind]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Asset Library</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Reuse any generated image across paths. Selecting an asset won&apos;t regenerate it.
          </p>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="mt-4 h-[80vh] overflow-y-auto pr-4">
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets saved yet for this session.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      onSelect(asset);
                      onOpenChange(false);
                    }}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-left"
                  >
                    <div className="relative aspect-square bg-slate-100 dark:bg-slate-900">
                      <Image
                        src={asset.data_url || asset.url || ''}
                        alt="saved asset"
                        fill
                        sizes="(max-width: 768px) 50vw, 200px"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(asset.created_at).toLocaleString()}
                      </p>
                      {asset.source && (
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {asset.source}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
