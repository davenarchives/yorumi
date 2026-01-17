import { Redis } from '@upstash/redis';
import { request, gql } from 'graphql-request';
import Fuse from 'fuse.js';

// --- CONFIGURATION ---
// 1. Get these from your Upstash Console
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

// --- TYPES ---
interface AniListResponse {
    Page: {
        media: Array<{
            id: number;
            title: {
                romaji: string;
                english: string | null;
                native: string | null;
            };
            synonyms: string[];
        }>;
    };
}

/**
 * The Main Function
 * @param mkSlug The unique MangaKatana slug (e.g., 'one-piece.2040')
 * @param mkTitle The title string from MangaKatana (e.g., 'One Piece')
 */
export async function getAniListId(mkSlug: string, mkTitle: string): Promise<number | null> {
    const CACHE_KEY = `map:mk:${mkSlug}`;

    // STEP 1: Check Redis (The "mapping.json" in the cloud)
    const cachedId = await redis.get<number>(CACHE_KEY);
    if (cachedId) {
        console.log(`⚡ Cache Hit: ${mkSlug} -> ${cachedId}`);
        return cachedId;
    }

    console.log(`🐢 Cache Miss: Fetching AniList for "${mkTitle}"...`);

    // STEP 2: Fetch from AniList API
    // We search for the top 5 results to perform a fuzzy check locally
    const query = gql`
    query ($search: String) {
      Page(perPage: 5) {
        media(search: $search, type: MANGA, sort: SEARCH_MATCH) {
          id
          title {
            romaji
            english
            native
          }
          synonyms
        }
      }
    }
  `;

    try {
        // Sanitize title (Remove 'Hot', 'New', or Volume numbers common on MK)
        const cleanQuery = mkTitle.replace(/\(Vol\.\d+\)/i, '').trim();

        const data = await request<AniListResponse>(ANILIST_ENDPOINT, query, { search: cleanQuery });
        const candidates = data.Page.media;

        if (!candidates || candidates.length === 0) return null;

        // STEP 3: Verify the Match (Fuzzy Check)
        // We double-check because AniList search can be weird.
        const fuse = new Fuse(candidates, {
            keys: ['title.romaji', 'title.english', 'synonyms'],
            includeScore: true,
            threshold: 0.4, // 0.0 is exact, 0.4 allows small differences
        });

        const result = fuse.search(mkTitle);

        if (result.length > 0) {
            const bestMatch = result[0].item;
            const anilistId = bestMatch.id;

            // STEP 4: Learn (Save to Redis)
            // This persists the mapping forever (or until you delete it)
            await redis.set(CACHE_KEY, anilistId);

            return anilistId;
        }

    } catch (error) {
        console.error("AniList API Error:", error);
    }

    return null;
}

// Export the redis instance for other services to use
export { redis };
