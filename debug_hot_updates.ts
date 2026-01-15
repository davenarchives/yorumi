
import { getHotUpdates } from './backend/src/scraper/mangakatana.ts';

async function test() {
    console.log('Testing getHotUpdates...');
    try {
        const updates = await getHotUpdates();
        console.log(`Found ${updates.length} updates`);
        if (updates.length > 0) {
            console.log('First update:', updates[0]);
        } else {
            console.log('No updates found. Check selectors.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
