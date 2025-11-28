import { useState, useEffect } from 'react';
import { EventDetails as InvitationDetails, InvitationAspectRatio } from '@/config/invitations';
import { SceneConfig, ProductOutputFormat } from '@/components/ProductPath/ProductGenerationConfig';

export type AppMode = 'color' | 'product' | 'invitation';
export type InvitationOutputFormat = 'image' | 'video';

export type SessionSnapshot = {
    appMode: AppMode;
    eventDetails: InvitationDetails;
    selectedInvitationCategory: string;
    selectedInvitationStyle: string;
    invitationAspectRatio: InvitationAspectRatio;
    invitationOutputFormats: InvitationOutputFormat[];
    invitationVariantCount: number;
    selectedScenes: SceneConfig[];
    productOutputFormats: ProductOutputFormat[];
    selectedInvitationTemplate?: string;
    invitationColorPalette?: string[];
    invitationVariationModes?: string[];
    productColorPalette?: string[];
};

const SESSION_STORAGE_KEY = 'creative-studio-session';

export const INITIAL_EVENT_DETAILS: InvitationDetails = {
    title: '',
    subtitle: '',
    date: '',
    time: '',
    location: '',
    description: '',
    hostName: '',
    rsvpInfo: '',
    moodKeywords: '',
    dressCode: '',
};

export function useAppSession() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isSessionHydrated, setIsSessionHydrated] = useState(false);

    // Initialize session ID from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
        if (existing) {
            setSessionId(existing);
        } else {
            const newId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            window.localStorage.setItem(SESSION_STORAGE_KEY, newId);
            setSessionId(newId);
        }
    }, []);

    const hydrateSession = async (
        setAppMode: (mode: AppMode) => void,
        setEventDetails: (details: React.SetStateAction<InvitationDetails>) => void,
        setSelectedInvitationCategory: (id: string) => void,
        setSelectedInvitationStyle: (id: string) => void,
        setInvitationAspectRatio: (ratio: InvitationAspectRatio) => void,
        setInvitationOutputFormats: (formats: InvitationOutputFormat[]) => void,
        setInvitationVariantCount: (count: number) => void,
        setSelectedScenes: (scenes: SceneConfig[]) => void,
        setProductOutputFormats: (formats: ProductOutputFormat[]) => void,
        setProductColorPalette: (palette: string[]) => void,
        setSelectedInvitationTemplate: (id: string) => void,
        setInvitationColorPalette: (palette: string[]) => void,
        setInvitationVariationModes: (modes: string[]) => void
    ) => {
        if (!sessionId || !sessionId.length) return;

        try {
            const response = await fetch(`/api/session?sessionId=${sessionId}`);
            if (!response.ok) return;
            const data = await response.json();
            const snapshot = (data?.session?.state || null) as Partial<SessionSnapshot> | null;
            if (!snapshot) return;

            if (snapshot.appMode) setAppMode(snapshot.appMode);
            if (snapshot.eventDetails) {
                setEventDetails(prev => ({ ...prev, ...snapshot.eventDetails }));
            }
            if (typeof snapshot.selectedInvitationCategory === 'string') {
                setSelectedInvitationCategory(snapshot.selectedInvitationCategory);
            }
            if (typeof snapshot.selectedInvitationStyle === 'string') {
                setSelectedInvitationStyle(snapshot.selectedInvitationStyle);
            }
            if (snapshot.invitationAspectRatio) {
                setInvitationAspectRatio(snapshot.invitationAspectRatio);
            }
            if (Array.isArray(snapshot.invitationOutputFormats) && snapshot.invitationOutputFormats.length > 0) {
                setInvitationOutputFormats(snapshot.invitationOutputFormats as InvitationOutputFormat[]);
            }
            if (typeof snapshot.invitationVariantCount === 'number') {
                setInvitationVariantCount(snapshot.invitationVariantCount);
            }
            if (Array.isArray(snapshot.selectedScenes)) {
                setSelectedScenes(snapshot.selectedScenes as SceneConfig[]);
            }
            if (Array.isArray(snapshot.productOutputFormats) && snapshot.productOutputFormats.length > 0) {
                setProductOutputFormats(snapshot.productOutputFormats as ProductOutputFormat[]);
            }
            if (Array.isArray(snapshot.productColorPalette)) {
                setProductColorPalette(snapshot.productColorPalette as string[]);
            }
            if (typeof snapshot.selectedInvitationTemplate === 'string') {
                setSelectedInvitationTemplate(snapshot.selectedInvitationTemplate);
            }
            if (Array.isArray(snapshot.invitationColorPalette)) {
                setInvitationColorPalette(snapshot.invitationColorPalette as string[]);
            }
            if (Array.isArray(snapshot.invitationVariationModes)) {
                setInvitationVariationModes(snapshot.invitationVariationModes as string[]);
            }
        } catch (error) {
            console.error('Failed to hydrate session state', error);
        } finally {
            setIsSessionHydrated(true);
        }
    };

    const saveSession = (
        appMode: AppMode,
        eventDetails: InvitationDetails,
        selectedInvitationCategory: string,
        selectedInvitationStyle: string,
        invitationAspectRatio: InvitationAspectRatio,
        invitationOutputFormats: InvitationOutputFormat[],
        invitationVariantCount: number,
        selectedScenes: SceneConfig[],
        productOutputFormats: ProductOutputFormat[],
        selectedInvitationTemplate: string,
        invitationColorPalette: string[],
        invitationVariationModes: string[],
        productColorPalette: string[]
    ) => {
        if (!sessionId || !isSessionHydrated) return;

        const payload: SessionSnapshot = {
            appMode,
            eventDetails,
            selectedInvitationCategory,
            selectedInvitationStyle,
            invitationAspectRatio,
            invitationOutputFormats,
            invitationVariantCount,
            selectedScenes,
            productOutputFormats,
            selectedInvitationTemplate,
            invitationColorPalette,
            invitationVariationModes,
            productColorPalette,
        };

        fetch('/api/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                mode: appMode,
                state: payload,
            }),
        }).catch(error => {
            console.error('Failed to persist session state', error);
        });
    };

    return {
        sessionId,
        isSessionHydrated,
        hydrateSession,
        saveSession
    };
}
