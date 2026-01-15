
const http = require('http');

console.log('Fetching scraper results...');
http.get('http://localhost:3001/api/scraper/search?q=Culling%20Game', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        console.log(JSON.stringify(JSON.parse(data), null, 2));
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
