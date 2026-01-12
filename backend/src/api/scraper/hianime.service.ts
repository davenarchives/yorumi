import axios from 'axios';
import * as cheerio from 'cheerio';

export class HiAnimeScraper {
    private readonly BASE_URL = 'https://hianime.to';

    async getSpotlightTitles(): Promise<string[]> {
        try {
            const { data } = await axios.get(`${this.BASE_URL}/home`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            const $ = cheerio.load(data);
            const titles: string[] = [];

            $('#slider .swiper-slide .deslide-item').each((_, element) => {
                const title = $(element).find('.desi-head-title').text().trim();
                if (title) {
                    titles.push(title);
                }
            });

            return titles;

        } catch (error) {
            console.error('Error scraping HiAnime spotlight:', error);
            // Fallback to empty array so the app doesn't crash, 
            // the frontend can fall back to standard Jikan top anime.
            return [];
        }
    }
}
