
import axios from 'axios';
import * as cheerio from 'cheerio';

async function check() {
    try {
        console.log('Fetching...');
        const { data } = await axios.get('https://mangakatana.com');
        const $ = cheerio.load(data);

        console.log('Hot Update ID found:', $('#hot_update').length);
        console.log('Widget Hot Update Class found:', $('.widget-hot-update').length);

        const container = $('#hot_update').length ? $('#hot_update') : $('.widget-hot-update');
        const items = container.find('.item');
        console.log('Items found:', items.length);

        if (items.length > 0) {
            const first = items.first();
            console.log('First Item HTML:', first.html().substring(0, 200));
            console.log('First Item Title:', first.find('.title a').text());
            const img = first.find('.wrap_img img').attr('src') || first.find('.wrap_img img').attr('data-src');
            console.log('First Item Image:', img);
        }
    } catch (e) {
        console.error(e.message);
    }
}

check();
