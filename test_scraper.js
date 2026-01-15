
const fetch = require('node-fetch');

async function testSearch() {
    const query = "Jujutsu Kaisen";
    const url = `http://localhost:3001/api/scraper/search?q=${encodeURIComponent(query)}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

testSearch();
