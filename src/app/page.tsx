'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ShoppingBag, Mail, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetLibrarySheet, AssetItem } from '@/components/AssetLibrarySheet';
import { ModeToggle } from '@/components/ModeToggle';
import { ModelToggle } from '@/components/ModelToggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { GeminiModelType } from '@/lib/geminiV2';

// Feature Imports
import { ColorMode } from '@/features/color-mode/ColorMode';
import { useColorMode } from '@/features/color-mode/useColorMode';
import { ProductMode } from '@/features/product-mode/ProductMode';
import { useProductMode } from '@/features/product-mode/useProductMode';
import { InvitationMode } from '@/features/invitation-mode/InvitationMode';
import { useInvitationMode } from '@/features/invitation-mode/useInvitationMode';
import { useAppSession, AppMode } from '@/hooks/useAppSession';

export default function Home() {
  // Global UI State
  const [appMode, setAppMode] = useState<AppMode>('color');
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-2.0-flash-exp');
  const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'color' | 'product'>('color');

  // Initialize Feature Hooks (State Hoisting)
  const { sessionId, isSessionHydrated, hydrateSession, saveSession } = useAppSession();

  const colorModeState = useColorMode();
  const productModeState = useProductMode(selectedModel, sessionId);
  const invitationModeState = useInvitationMode(selectedModel, sessionId);

  // Session Management
  useEffect(() => {
    if (sessionId && !isSessionHydrated) {
      hydrateSession(
        setAppMode,
        invitationModeState.setEventDetails,
        invitationModeState.setSelectedInvitationCategory,
        invitationModeState.setSelectedInvitationStyle,
        invitationModeState.setInvitationAspectRatio,
        invitationModeState.setInvitationOutputFormats,
        invitationModeState.setInvitationVariantCount,
        productModeState.setSelectedScenes,
        productModeState.setProductOutputFormats,
        productModeState.setProductColorPalette,
        invitationModeState.setSelectedInvitationTemplate,
        invitationModeState.setInvitationColorPalette,
        invitationModeState.setInvitationVariationModes
      );
    }
  }, [sessionId, isSessionHydrated, hydrateSession, invitationModeState, productModeState]);

  useEffect(() => {
    if (isSessionHydrated) {
      saveSession(
        appMode,
        invitationModeState.eventDetails,
        invitationModeState.selectedInvitationCategory,
        invitationModeState.selectedInvitationStyle,
        invitationModeState.invitationAspectRatio,
        invitationModeState.invitationOutputFormats,
        invitationModeState.invitationVariantCount,
        productModeState.selectedScenes,
        productModeState.productOutputFormats,
        invitationModeState.selectedInvitationTemplate,
        invitationModeState.invitationColorPalette,
        invitationModeState.invitationVariationModes,
        productModeState.productColorPalette
      );
    }
  }, [
    isSessionHydrated,
    appMode,
    invitationModeState.eventDetails,
    invitationModeState.selectedInvitationCategory,
    invitationModeState.selectedInvitationStyle,
    invitationModeState.invitationAspectRatio,
    invitationModeState.invitationOutputFormats,
    invitationModeState.invitationVariantCount,
    productModeState.selectedScenes,
    productModeState.productOutputFormats,
    invitationModeState.selectedInvitationTemplate,
    invitationModeState.invitationColorPalette,
    invitationModeState.invitationVariationModes,
    productModeState.productColorPalette,
    saveSession
  ]);

  // Handlers
  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    // Optional: Reset other modes when switching?
    // The original behavior did reset. 
    // If we want to persist state while switching tabs, we can remove these resets.
    // For now, let's keep the state persistent as it's a better UX for a "Studio" feel.
    // If explicit reset is needed, we can add a "Reset" button in the UI.
  };

  const handleAssetSelect = (asset: AssetItem) => {
    const assetData = asset.data_url || asset.url || '';
    if (!assetData) return;

    if (assetPickerTarget === 'color') {
      colorModeState.handleImageSelect(assetData);
    } else {
      productModeState.handleProductSelect(assetData);
    }
    setIsAssetLibraryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 rounded-lg shadow-lg">
              <Palette className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Creative Studio
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              {[
                { id: 'color', label: 'Color Match', icon: Palette },
                { id: 'product', label: 'Product Shot', icon: ShoppingBag },
                { id: 'invitation', label: 'Invitation', icon: Mail },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id as AppMode)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${appMode === mode.id
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  <mode.icon className="h-4 w-4" />
                  {mode.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ModelToggle model={selectedModel} onChange={setSelectedModel} />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => { }} // Mobile menu todo
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <AnimatePresence mode="wait">
          {appMode === 'color' && (
            <motion.div
              key="color-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ColorMode
                {...colorModeState}
                sessionId={sessionId}
                selectedModel={selectedModel}
                setAppMode={setAppMode}
                setInvitationColorPalette={invitationModeState.setInvitationColorPalette}
                setAssetPickerTarget={setAssetPickerTarget}
                setIsAssetLibraryOpen={setIsAssetLibraryOpen}
              />
            </motion.div>
          )}

          {appMode === 'product' && (
            <motion.div
              key="product-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductMode
                {...productModeState}
                sessionId={sessionId}
                selectedModel={selectedModel}
                setAssetPickerTarget={setAssetPickerTarget}
                setIsAssetLibraryOpen={setIsAssetLibraryOpen}
                currentImage={productModeState.productImage}
                onImageChange={productModeState.setProductImage}
              />
            </motion.div>
          )}

          {appMode === 'invitation' && (
            <motion.div
              key="invitation-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <InvitationMode
                {...invitationModeState}
                sessionId={sessionId}
                selectedModel={selectedModel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Asset Library Sheet */}
      <AssetLibrarySheet
        open={isAssetLibraryOpen}
        onOpenChange={setIsAssetLibraryOpen}
        onSelect={handleAssetSelect}
      />
    </div>
  );
}
