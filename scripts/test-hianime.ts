
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function testScraper() {
    try {
        const { data } = await axios.get('https://hianime.to/home', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        console.log(`Slider items found: ${$('#slider .swiper-slide .deslide-item').length}`);

        $('#slider .swiper-slide .deslide-item').each((i, element) => {
            if (i > 0) return;
            const title = $(element).find('.desi-head-title').text().trim();
            console.log(`\n--- Item ${i + 1}: ${title} ---`);

            const img = $(element).find('img');
            console.log(`Images found: ${img.length}`);
            img.each((j, imgEl) => {
                console.log(`Image ${j}: src="${$(imgEl).attr('src')}", data-src="${$(imgEl).attr('data-src')}", class="${$(imgEl).attr('class')}"`);
            });

            console.log('Divs with styles (potential bg):');
            $(element).find('div[style*="background"]').each((k, divEl) => {
                console.log(`Div ${k}: style="${$(divEl).attr('style')}"`);
            });
        });


    } catch (error) {
        console.error('Error:', error);
    }
}

testScraper();
