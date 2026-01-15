import axios from 'axios';


const query = `
query ($search: String) {
  Media(search: $search, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    streamingEpisodes {
      title
      thumbnail
      url
      site
    }
  }
}
`;

async function checkEpisodes(search) {
    try {
        const response = await axios.post('https://graphql.anilist.co', {
            query: query,
            variables: { search }
        });
        const media = response.data.data.Media;
        console.log(`Title: ${media.title.english || media.title.romaji}`);
        console.log(`Streaming Episodes Count: ${media.streamingEpisodes.length}`);
        if (media.streamingEpisodes.length > 0) {
            console.log('First 3 Episodes:', JSON.stringify(media.streamingEpisodes.slice(0, 3), null, 2));
        } else {
            console.log('No streaming episodes found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
}

checkEpisodes("Seven Mortal Sins");
