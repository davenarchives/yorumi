import { useState, useEffect } from 'react';

interface AnimeLogoImageProps {
    anilistId: number;
    title: string;
    className?: string;
    style?: React.CSSProperties;
    size?: 'small' | 'medium' | 'large'; // small: 80px, medium: 120px, large: 160px
}

const LOGO_CACHE_KEY = 'yorumi_logo_cache';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Hydrate logo cache from localStorage on module load
function loadCacheFromStorage(): Map<number, string | null> {
    try {
        const stored = localStorage.getItem(LOGO_CACHE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const entries = Object.entries(parsed).map(([k, v]) => [parseInt(k), v] as [number, string | null]);
            console.log(`[LogoCache] Hydrated ${entries.length} logos from storage`);
            return new Map(entries);
        }
    } catch (e) {
        console.warn('[LogoCache] Failed to load from storage:', e);
    }
    return new Map();
}

// Shared logo cache - hydrated from localStorage
const logoCache = loadCacheFromStorage();
const pendingRequests = new Map<number, Promise<string | null>>();

// Debounced save to localStorage
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
function persistCache() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            const obj: Record<number, string | null> = {};
            logoCache.forEach((v, k) => { obj[k] = v; });
            localStorage.setItem(LOGO_CACHE_KEY, JSON.stringify(obj));
            console.log('[LogoCache] Persisted to storage');
        } catch (e) {
            console.warn('[LogoCache] Failed to persist:', e);
        }
    }, 1000);
}

/**
 * Preload logos for multiple anime IDs in a single batch request
 * Call this when spotlight/trending anime data loads
 */
export async function preloadLogos(anilistIds: number[]): Promise<void> {
    // Filter out already cached IDs
    const uncachedIds = anilistIds.filter(id => !logoCache.has(id));

    if (uncachedIds.length === 0) {
        return; // All cached, no logging needed
    }

    console.log('[LogoPreload] Fetching', uncachedIds.length, 'logos...');

    try {
        const response = await fetch(`${API_BASE}/logo/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ anilistIds: uncachedIds })
        });

        if (response.ok) {
            const data = await response.json();
            let newCount = 0;
            for (const [id, result] of Object.entries(data)) {
                const logoResult = result as { logo: string | null; source: 'fanart' | 'fallback' };
                if (logoResult.source === 'fanart' && logoResult.logo) {
                    logoCache.set(parseInt(id), logoResult.logo);
                    newCount++;
                } else {
                    logoCache.set(parseInt(id), null);
                }
            }
            if (newCount > 0) {
                persistCache();
                console.log('[LogoPreload] ✓', newCount, 'logos cached');
            }
        }
    } catch (error) {
        console.warn('[LogoPreload] Failed:', error);
    }
}

export default function AnimeLogoImage({ anilistId, title, className = '', size = 'medium', style }: AnimeLogoImageProps) {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    // Determine max height based on size prop
    const getMaxHeight = () => {
        switch (size) {
            case 'small': return '80px';
            case 'medium': return '120px';
            case 'large': return '160px';
            default: return '120px';
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchLogo = async () => {
            // Check cache first
            if (logoCache.has(anilistId)) {
                const cached = logoCache.get(anilistId);
                if (isMounted) {
                    if (cached) {
                        setLogoUrl(cached);
                        setHasError(false);
                    } else {
                        setHasError(true);
                    }
                }
                return;
            }

            // Check if there's already a pending request for this ID
            if (pendingRequests.has(anilistId)) {
                const result = await pendingRequests.get(anilistId);
                if (isMounted) {
                    if (result) {
                        setLogoUrl(result);
                        setHasError(false);
                    } else {
                        setHasError(true);
                    }
                }
                return;
            }

            // Make new request
            const fetchPromise = (async () => {
                try {
                    const logoEndpoint = `${API_BASE}/logo/${anilistId}`;
                    const response = await fetch(logoEndpoint);

                    if (!response.ok) {
                        throw new Error('Failed to fetch logo');
                    }

                    const data = await response.json();

                    if (data.logo && data.source === 'fanart') {
                        logoCache.set(anilistId, data.logo);
                        persistCache();
                        return data.logo;
                    } else {
                        logoCache.set(anilistId, null);
                        persistCache();
                        return null;
                    }
                } catch (error) {
                    console.warn('[AnimeLogoImage] Failed to fetch logo:', error);
                    logoCache.set(anilistId, null);
                    persistCache();
                    return null;
                } finally {
                    pendingRequests.delete(anilistId);
                }
            })();

            pendingRequests.set(anilistId, fetchPromise);
            const result = await fetchPromise;

            if (isMounted) {
                if (result) {
                    setLogoUrl(result);
                    setHasError(false);
                } else {
                    setHasError(true);
                }
            }
        };

        fetchLogo();

        return () => {
            isMounted = false;
        };
    }, [anilistId]);

    // If logo is available and no error, show the logo
    if (logoUrl && !hasError) {
        return (
            <img
                src={logoUrl}
                alt={title}
                className={`max-w-full h-auto object-contain fade-in ${className}`}
                style={{
                    maxHeight: getMaxHeight(),
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8))',
                    ...style
                }}
                onError={() => {
                    console.warn('[AnimeLogoImage] Image load error, falling back to text');
                    setHasError(true);
                }}
                loading="eager"
            />
        );
    }

    // Default: Show text title (during loading AND as fallback)
    // This provides instant content - user sees title immediately
    return (
        <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight ${className}`}>
            {title}
        </h1>
    );
}
