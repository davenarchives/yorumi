export interface Anime {
    mal_id: number;
    title: string;
    title_japanese?: string;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    score: number;
    rank?: number;
    status: string;
    type: string;
    episodes: number | null;
    year?: number;
    synopsis?: string;
    genres?: { mal_id: number; name: string; }[];
    studios?: { mal_id: number; name: string; }[];
    producers?: { mal_id: number; name: string; }[];
    aired?: {
        from?: string;
        to?: string;
        string?: string;
    };
    duration?: string;
    rating?: string;
    season?: string;

    anilist_banner_image?: string;
    anilist_cover_image?: string;
    latestEpisode?: number; // For ongoing anime - the latest aired episode
    characters?: {
        edges: {
            role: string;
            node: {
                id: number;
                name: { full: string };
                image: { large: string };
            };
            voiceActors: {
                id: number;
                name: { full: string };
                image: { large: string };
                languageV2: string;
            }[];
        }[];
    };
    trailer?: {
        id: string; // Youtube ID
        site: string;
        thumbnail: string;
    };
}

export interface Episode {
    session: string;
    episodeNumber: string;
    duration?: string;
    title?: string;
}
