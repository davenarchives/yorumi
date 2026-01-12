import * as malScraper from '../../scraper/mal';

export const searchAnime = async (query: string, page: number = 1, limit: number = 24) => {
    try {
        const startIndex = (page - 1) * limit;
        const malPage = Math.floor(startIndex / 50) + 1;
        const malIndex = startIndex % 50;

        const results = await malScraper.scrapeSearch(query, 'anime', malPage);
        const sliced = results.slice(malIndex, malIndex + limit);

        return {
            data: sliced,
            pagination: {
                last_visible_page: 20,
                has_next_page: results.length > malIndex + limit,
                items: { count: sliced.length, total: 1000, per_page: limit }
            }
        };
    } catch (error) {
        console.error('Error searching anime (scraped):', error);
        throw error;
    }
};

export const getAnimeById = async (id: number) => {
    try {
        const data = await malScraper.scrapeDetails(id, 'anime');
        return { data };
    } catch (error) {
        console.error(`Error fetching anime with ID ${id}:`, error);
        throw error;
    }
};

export const getTopAnime = async (page: number = 1, limit: number = 24) => {
    try {
        const startIndex = (page - 1) * limit;
        const malPage = Math.floor(startIndex / 50) + 1;
        const malIndex = startIndex % 50;

        const results = await malScraper.scrapeTop('anime', malPage);
        const sliced = results.slice(malIndex, malIndex + limit);

        return {
            data: sliced,
            pagination: {
                last_visible_page: 20,
                has_next_page: true,
                items: { count: sliced.length, total: 1000, per_page: limit }
            }
        };
    } catch (error) {
        console.error('Error fetching top anime (scraped):', error);
        throw error;
    }
}

export const getTopManga = async (page: number = 1, limit: number = 24) => {
    try {
        const startIndex = (page - 1) * limit;
        const malPage = Math.floor(startIndex / 50) + 1;
        const malIndex = startIndex % 50;

        const results = await malScraper.scrapeTop('manga', malPage);

        // Handle potentially different slice needs or just slice same way
        const sliced = results.slice(malIndex, malIndex + limit);

        return {
            data: sliced,
            pagination: {
                last_visible_page: 20,
                has_next_page: true,
                items: { count: sliced.length, total: 1000, per_page: limit }
            }
        };
    } catch (error) {
        console.error('Error fetching top manga (scraped):', error);
        throw error;
    }
}

export const getMangaById = async (id: number) => {
    try {
        const data = await malScraper.scrapeDetails(id, 'manga');
        return { data };
    } catch (error) {
        console.error(`Error fetching manga with ID ${id}:`, error);
        throw error;
    }
};

export const searchManga = async (query: string, page: number = 1, limit: number = 24) => {
    try {
        const startIndex = (page - 1) * limit;
        const malPage = Math.floor(startIndex / 50) + 1;
        const malIndex = startIndex % 50;

        const results = await malScraper.scrapeSearch(query, 'manga', malPage);
        const sliced = results.slice(malIndex, malIndex + limit);

        return {
            data: sliced,
            pagination: {
                last_visible_page: 20,
                has_next_page: results.length > malIndex + limit,
                items: { count: sliced.length, total: 1000, per_page: limit }
            }
        };
    } catch (error) {
        console.error('Error searching manga (scraped):', error);
        throw error;
    }
}
