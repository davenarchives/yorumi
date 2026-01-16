import axios from 'axios';
import * as cheerio from 'cheerio';

export class HiAnimeScraper {
    private readonly BASE_URL = 'https://hianime.to';

    async getSpotlightAnime(): Promise<any[]> {
        try {
            const { data } = await axios.get(`${this.BASE_URL}/home`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': this.BASE_URL
                }
            });

            const $ = cheerio.load(data);
            const spotlight: any[] = [];

            $('#slider .swiper-slide .deslide-item').each((_, element) => {
                const $el = $(element);
                const title = $el.find('.desi-head-title').text().trim();
                const description = $el.find('.desi-description').text().trim();

                // Extract IDs and Links
                const link = $el.find('.desi-buttons a').first().attr('href') || '';
                // link format: /watch/title-id
                const id = link.split('-').pop();

                // Extract Images
                const poster = $el.find('.film-poster-img').attr('data-src') || $el.find('.film-poster-img').attr('src');

                // Banner is usually in a style attribute, but sometimes just implied or separate. 
                // In HiAnime structure, the background might be the `.deslide-cover` image itself if it's wide 
                // OR it's a separate div. 
                // Based on common structure, let's look for the biggest image or the specific class.
                // The slider usually has `img.deslide-cover-img` or similar.
                // If not found, fall back to poster.
                // Checking previous logs (truncated), there was `deslide-cover`.
                let banner = $el.find('.deslide-cover .film-poster-img').attr('data-src') || $el.find('.deslide-cover .film-poster-img').attr('src');

                // Metadata
                const quality = $el.find('.tick-quality').text().trim();
                const sub = $el.find('.tick-sub').text().trim();
                const dub = $el.find('.tick-dub').text().trim();

                if (title) {
                    spotlight.push({
                        id,
                        title,
                        description,
                        poster,
                        banner,
                        link: this.BASE_URL + link,
                        quality,
                        sub: parseInt(sub) || 0,
                        dub: parseInt(dub) || 0
                    });
                }
            });

            return spotlight;

        } catch (error) {
            console.error('Error scraping HiAnime spotlight:', error);
            return [];
        }
    }
}
