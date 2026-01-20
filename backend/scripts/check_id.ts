
import axios from 'axios';

const query = `
query ($id: Int) {
    Media(id: $id, type: MANGA) {
        id
        title {
            romaji
            english
            native
        }
    }
}
`;

async function checkId() {
    try {
        console.log('Checking ID 121496...');
        const response = await axios.post('https://graphql.anilist.co', {
            query,
            variables: { id: 121496 }
        });
        console.log('Result:', JSON.stringify(response.data.data.Media, null, 2));
    } catch (error: any) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

checkId();
