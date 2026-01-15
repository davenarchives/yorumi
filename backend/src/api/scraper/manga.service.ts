import * as mangakatana from '../../scraper/mangakatana';

export interface MangaSearchResult extends mangakatana.MangaSearchResult {
    source: 'mangakatana';
}

/**
 * Search manga (MangaKatana only)
 */
export async function searchManga(query: string) {
    const mkResults = await mangakatana.searchManga(query).catch(err => {
        console.error('MangaKatana Search Error:', err.message);
        return [];
    });

    // Prefix IDs to namespace them (optional now, but keeps consistency if we add others later)
    return mkResults.map(r => ({
        ...r,
        id: `mk:${r.id}`,
        source: 'mangakatana' as const
    }));
}

/**
 * Get details
 */
export async function getMangaDetails(id: string) {
    // Strip prefix if present
    const realId = id.startsWith('mk:') ? id.replace('mk:', '') : id;

    // Fallback for legacy or if user tries to load an old asura ID (will fail or default to MK?)
    // If ID starts with asura:, we can't really load it from MK with that ID. 
    // We'll just assume everything is MK.

    const details = await mangakatana.getMangaDetails(realId);
    return { ...details, id: `mk:${details.id}` };
}

/**
 * Get chapter list
 */
export async function getChapterList(id: string) {
    const realId = id.startsWith('mk:') ? id.replace('mk:', '') : id;
    const chapters = await mangakatana.getChapterList(realId);
    return chapters.map(c => ({ ...c, id: `mk:${c.id}` }));
}

/**
 * Get pages
 */
export async function getChapterPages(url: string) {
    return mangakatana.getChapterPages(url);
}

export async function getHotUpdates() {
    const updates = await mangakatana.getHotUpdates();
    return updates.map(u => ({ ...u, id: `mk:${u.id}` }));
}
