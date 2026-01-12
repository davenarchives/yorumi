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
    trailer?: {
        youtube_id?: string;
        url?: string;
        embed_url?: string;
        images?: {
            image_url?: string;
            small_image_url?: string;
            medium_image_url?: string;
            large_image_url?: string;
            maximum_image_url?: string;
        };
    };
    anilist_banner_image?: string;
    anilist_cover_image?: string;
    latestEpisode?: number; // For ongoing anime - the latest aired episode
}

export interface Episode {
    session: string;
    episodeNumber: string;
    duration?: string;
    title?: string;
}
