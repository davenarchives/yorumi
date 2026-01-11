
import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://mangakatana.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

async function testSearch() {
    try {
        console.log('Fetching mangakatana search...');
        const response = await axios.get(BASE_URL, {
            params: {
                search: 'Estate Developer',
                search_by: 'book_name',
            },
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': BASE_URL,
            },
        });

        console.log('Status:', response.status);
        console.log('Content Length:', response.data.length);

        const $ = cheerio.load(response.data);
        const items = $('#book_list > div.item');
        console.log('Items found:', items.length);

        if (items.length === 0) {
            console.log('No items found. Dumping partial HTML...');
            console.log(response.data.substring(0, 500)); // Print start of HTML to see if it's cloudflare
        } else {
            items.each((_, element) => {
                const title = $(element).find('div.text > h3 > a').text().trim();
                console.log('Found:', title);
            });
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Error:', error);
        }
    }
}

testSearch();
