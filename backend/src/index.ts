import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import scraperRoutes from './api/scraper/scraper.routes';
import mangaScraperRoutes from './api/scraper/mangascraper.routes';
import anilistRoutes from './api/anilist/anilist.routes';
import hianimeRoutes from './api/scraper/hianime.routes';


const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/anilist', anilistRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/manga', mangaScraperRoutes);
app.use('/api/hianime', hianimeRoutes);

import { mappingService } from './api/mapping/mapping.service';
import { getAniListId } from './api/mapping/mapper';

// Mapping Routes
app.get('/api/mapping/:id', async (req, res) => {
    const mapping = await mappingService.getMapping(req.params.id);
    if (mapping) {
        res.json(mapping);
    } else {
        res.status(404).json({ message: 'Mapping not found' });
    }
});

app.post('/api/mapping', async (req, res) => {
    const { anilistId, scraperId, title } = req.body;
    if (!anilistId || !scraperId) {
        return res.status(400).json({ message: 'Missing anilistId or scraperId' });
    }
    const success = await mappingService.saveMapping(anilistId, scraperId, title);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ message: 'Failed to save mapping' });
    }
});

app.post('/api/mapping/identify', async (req, res) => {
    const { slug, title } = req.body;
    if (!slug || !title) {
        return res.status(400).json({ message: 'Missing slug or title' });
    }
    const anilistId = await getAniListId(slug, title);
    if (anilistId) {
        res.json({ anilistId });
    } else {
        res.status(404).json({ message: 'AniList ID not found' });
    }
});


app.get('/', (req, res) => {
    res.send('Yorumi Backend is running');
});

if (process.env.NODE_ENV !== 'production' || process.env.IS_ELECTRON) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

export default app;
