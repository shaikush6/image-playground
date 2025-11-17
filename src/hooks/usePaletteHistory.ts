'use client';

import { useState, useCallback } from 'react';
import { PaletteEntry } from '@/lib/anthropic';

interface HistoryState {
  palette: PaletteEntry[];
  timestamp: number;
}

export function usePaletteHistory(initialPalette: PaletteEntry[]) {
  const [history, setHistory] = useState<HistoryState[]>([
    { palette: initialPalette, timestamp: Date.now() }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPalette = history[currentIndex]?.palette || initialPalette;

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const addToHistory = useCallback((palette: PaletteEntry[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ palette, timestamp: Date.now() });

      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        setCurrentIndex(prev => prev);
        return newHistory;
      }

      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback((palette: PaletteEntry[]) => {
    setHistory([{ palette, timestamp: Date.now() }]);
    setCurrentIndex(0);
  }, []);

  return {
    currentPalette,
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory,
    reset,
    historyLength: history.length,
    currentIndex,
  };
}
