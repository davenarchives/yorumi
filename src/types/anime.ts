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
}

export interface Episode {
    session: string;
    episodeNumber: string;
    duration?: string;
    title?: string;
}
