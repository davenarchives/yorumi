
import { searchManga } from '../src/scraper/mangakatana';
import * as fs from 'fs';
import * as path from 'path';

async function test() {
    console.log('Testing MangaKatana Scraper directly...');

    const queries = [
        "The Regressed Mercenary",
        "The Regressed Mercenary's Machinations",
        "The Regressed Mercenary Machinations",
        "The Regressed Mercenarys Machinations"
    ];

    const output: any = {};

    for (const q of queries) {
        console.log(`\n--- Searching: "${q}" ---`);
        try {
            const results = await searchManga(q);
            console.log(`Found ${results.length} results.`);
            output[q] = {
                count: results.length,
                first: results.length > 0 ? results[0] : null
            };
        } catch (e: any) {
            console.error('Error:', e);
            output[q] = { error: e.message };
        }
    }

    fs.writeFileSync(path.join(__dirname, 'test_results.json'), JSON.stringify(output, null, 2));
    console.log('Results written to test_results.json');
}

test();
