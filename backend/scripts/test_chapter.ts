import axios from 'axios';
import * as cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function testChapterPages(url: string) {
    console.log('Testing:', url);
    const start = Date.now();

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': USER_AGENT },
            timeout: 10000
        });

        console.log('Response status:', response.status);
        console.log('Response length:', response.data.length);

        const html = response.data;

        // Check for variable names
        const varNames = ['thzq', 'ytaw', 'htnc'];
        for (const varName of varNames) {
            const hasVar = html.includes(`var ${varName}`);
            console.log(`Has "${varName}": ${hasVar}`);

            if (hasVar) {
                const pattern = new RegExp(`var\\s+${varName}\\s*=\\s*\\[([\\s\\S]*?)\\];`, 'm');
                const match = html.match(pattern);
                if (match) {
                    console.log(`Matched ${varName}, array length:`, match[1].length);

                    // Count URLs
                    const urlPattern = /['"]([^'"]+)['"]/g;
                    const urls: string[] = [];
                    let urlMatch;
                    while ((urlMatch = urlPattern.exec(match[1])) !== null) {
                        const foundUrl = urlMatch[1];
                        if (foundUrl.includes('http') || foundUrl.startsWith('//')) {
                            urls.push(foundUrl);
                        }
                    }
                    console.log(`Found ${urls.length} URLs`);
                    if (urls.length > 0) {
                        console.log('First URL:', urls[0].slice(0, 80) + '...');
                    }
                }
            }
        }

        // Also check cheerio
        const $ = cheerio.load(html);
        const imgCount = $('#imgs img').length;
        console.log('Cheerio #imgs img count:', imgCount);

        console.log('Time taken:', Date.now() - start, 'ms');
    } catch (err: any) {
        console.error('Error:', err.message);
    }
}

testChapterPages('https://mangakatana.com/manga/chainsaw-man.21890/c1');
