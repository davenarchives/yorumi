import axios from 'axios';
import { load } from 'cheerio';

const BASE_URL = 'https://myanimelist.net';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const axiosInstance = axios.create({
    headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    }
});

interface ScrapedResult {
    mal_id: number;
    title: string;
    url: string;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    score: number;
    rank?: number;
    type: string;
    episodes?: number;
    chapters?: number;
    volumes?: number;
    status?: string;
    synopsis?: string;
}

function extractIdFromUrl(url: string | undefined): number {
    if (!url) return 0;
    const match = url.match(/\/(\d+)\//);
    return match ? parseInt(match[1]) : 0;
}

function processImageUrl(url: string | undefined): { jpg: { image_url: string, large_image_url: string } } {
    if (!url) return { jpg: { image_url: '', large_image_url: '' } };

    let large = url;
    if (url.includes('/r/')) {
        large = url.replace(/\/r\/\d+x\d+/, ''); // Remove /r/50x70
        const queryIndex = large.indexOf('?');
        if (queryIndex !== -1) {
            large = large.substring(0, queryIndex);
        }
    }

    return {
        jpg: {
            image_url: url,
            large_image_url: large
        }
    };
}

export async function scrapeSearch(query: string, type: 'anime' | 'manga', page: number = 1): Promise<ScrapedResult[]> {
    try {
        const offset = (page - 1) * 50;
        const cat = type === 'anime' ? 'anime' : 'manga';
        const url = `${BASE_URL}/${cat}.php?q=${encodeURIComponent(query)}&show=${offset}`;

        console.log(`Scraping MAL Search: ${url}`);
        const { data } = await axiosInstance.get(url);
        const $ = load(data);

        const results: ScrapedResult[] = [];
        const rows = $('div.js-categories-seasonal table tr');

        rows.each((index, element) => {
            if (index === 0) return; // Skip header

            const cells = $(element).find('td');
            if (cells.length < 5) return;

            const imgEl = $(cells[0]).find('img');
            const rawImg = imgEl.attr('data-src') || imgEl.attr('src') || '';
            const images = processImageUrl(rawImg);

            const linkEl = $(cells[1]).find('a').first();
            const title = linkEl.find('strong').text().trim() || linkEl.text().trim();
            const itemUrl = linkEl.attr('href') || '';
            const mal_id = extractIdFromUrl(itemUrl);
            const synopsis = $(cells[1]).find('div.pt4').text().trim();

            const typeStr = $(cells[2]).text().trim();

            const countStr = $(cells[3]).text().trim();
            const count = countStr === '-' ? 0 : parseInt(countStr);

            const scoreStr = $(cells[4]).text().trim();
            const score = scoreStr === 'N/A' ? 0 : parseFloat(scoreStr);

            results.push({
                mal_id,
                title,
                url: itemUrl,
                images,
                score,
                type: typeStr,
                episodes: type === 'anime' ? count : undefined,
                chapters: type === 'manga' ? count : undefined,
                synopsis
            });
        });

        return results;
    } catch (error) {
        console.error('Error scraping MAL search:', error);
        return [];
    }
}

export async function scrapeTop(type: 'anime' | 'manga', page: number = 1): Promise<ScrapedResult[]> {
    try {
        const offset = (page - 1) * 50;
        const url = `${BASE_URL}/top${type}.php?limit=${offset}`;

        console.log(`Scraping MAL Top: ${url}`);
        const { data } = await axiosInstance.get(url);
        const $ = load(data);

        const results: ScrapedResult[] = [];
        const rows = $('tr.ranking-list');

        rows.each((index, element) => {
            const rankStr = $(element).find('td:nth-child(1) span.rank').text().trim();
            const rank = parseInt(rankStr) || 0;

            const titleCell = $(element).find('td:nth-child(2)');
            const linkEl = titleCell.find('h3 a');
            const title = linkEl.text().trim();
            const itemUrl = linkEl.attr('href') || '';
            const mal_id = extractIdFromUrl(itemUrl);

            const imgEl = titleCell.find('img');
            const rawImg = imgEl.attr('data-src') || imgEl.attr('src') || '';
            const images = processImageUrl(rawImg);

            const infoText = titleCell.find('.information').text().trim();
            const parts = infoText.split('\n')[0].trim();
            const typeMatch = parts.match(/^([^(]+)/);
            const typeStr = typeMatch ? typeMatch[1].trim() : 'Unknown';

            let count = 0;
            const countMatch = parts.match(/\((\d+)\s*(eps|vols)\)/);
            if (countMatch) {
                count = parseInt(countMatch[1]);
            }

            const scoreStr = $(element).find('td:nth-child(3)').text().trim();
            const score = parseFloat(scoreStr) || 0;

            results.push({
                mal_id,
                title: title,
                url: itemUrl,
                images,
                score,
                rank,
                type: typeStr,
                episodes: type === 'anime' ? count : undefined,
                volumes: type === 'manga' ? count : undefined,
                status: 'Finished Airing'
            });
        });

        return results;
    } catch (error) {
        console.error('Error scraping MAL Top:', error);
        return [];
    }
}

export async function scrapeDetails(id: number, type: 'anime' | 'manga'): Promise<any> {
    try {
        const url = `${BASE_URL}/${type}/${id}`;
        // console.log(`Scraping MAL Details: ${url}`);
        const { data } = await axiosInstance.get(url);
        const $ = load(data);

        const title = $('h1.title-name').text().trim() || $('span[itemprop="name"]').text().trim();
        const scoreStr = $('.score-label').text().trim();
        const score = scoreStr === 'N/A' ? 0 : parseFloat(scoreStr);
        const synopsis = $('p[itemprop="description"]').text().trim();
        const imgEl = $('.leftside img');
        const rawImg = imgEl.attr('data-src') || imgEl.attr('src') || '';
        const images = processImageUrl(rawImg);

        const genres: { mal_id: number; name: string; }[] = [];
        $('span.dark_text:contains("Genres:")').parent().find('a').each((_, el) => {
            const name = $(el).text().trim();
            const href = $(el).attr('href');
            const id = extractIdFromUrl(href);
            if (name && id) {
                genres.push({ mal_id: id, name });
            }
        });

        // Also try "Themes" or "Demographic" if desired, but user asked for Genres.
        // Sometimes MAL splits them. Let's stick to "Genres:" first.

        return {
            mal_id: id,
            title,
            images,
            score,
            synopsis,
            type: type === 'anime' ? 'TV' : 'Manga',
            status: 'Finished Airing', // TODO: Scrape actual status
            genres
        };
    } catch (error) {
        console.error(`Error scraping MAL details for ${id}:`, error);
        throw error;
    }
}
