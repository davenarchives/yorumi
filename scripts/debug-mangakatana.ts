
import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://mangakatana.com';

async function debugScraper() {
    try {
        const chapterUrl = 'https://mangakatana.com/manga/jujutsu-kaisen.20707/c2';
        console.log('Testing with Chapter URL:', chapterUrl);

        console.log('Fetching chapter HTML...');
        const chapterRes = await axios.get(chapterUrl);
        const html = chapterRes.data;

        // Scan for ALL potential array variables
        console.log('Scanning for all array variables...');
        const allVarsPattern = /var\s+([a-zA-Z0-9_]+)\s*=\s*(\[[^;]+\])/g;

        let match;
        while ((match = allVarsPattern.exec(html)) !== null) {
            const varName = match[1];
            const arrayStr = match[2];

            // Count URLs in this array
            const urls: string[] = [];
            const urlMatch = arrayStr.matchAll(/['"](https?:\/\/[^'"]+)['"]/g);
            for (const m of urlMatch) {
                urls.push(m[1]);
            }

            console.log(`Found variable: ${varName} with ${urls.length} URLs`);
            if (urls.length > 0 && urls.length < 5) {
                console.log(`  - Sample: ${urls[0]}`);
            } else if (urls.length >= 5) {
                console.log(`  - First: ${urls[0]}`);
                console.log(`  - Last: ${urls[urls.length - 1]}`);
            }
        }

    } catch (error) {
        console.error('Debug script error:', error);
    }
}

debugScraper();
