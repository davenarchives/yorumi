
const axios = require('axios');
const cheerio = require('cheerio');

async function check() {
    try {
        const { data } = await axios.get('https://mangakatana.com');
        const $ = cheerio.load(data);

        console.log('Hot Update ID found:', $('#hot_update').length);
        console.log('Widget Hot Update Class found:', $('.widget-hot-update').length);

        const container = $('#hot_update').length ? $('#hot_update') : $('.widget-hot-update');
        const items = container.find('.item');
        console.log('Items found:', items.length);

        if (items.length > 0) {
            const first = items.first();
            console.log('First Item HTML:', first.html());
            console.log('First Item Title:', first.find('.title a').text());
            console.log('First Item Image:', first.find('.wrap_img img').attr('src'));
        }
    } catch (e) {
        console.error(e.message);
    }
}

check();
