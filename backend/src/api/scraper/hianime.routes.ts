import { Router } from 'express';
import { HiAnimeScraper } from './hianime.service';

const router = Router();
const scraper = new HiAnimeScraper();

router.get('/spotlight', async (req, res) => {
    try {
        const titles = await scraper.getSpotlightTitles();
        res.json({ titles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch spotlight titles' });
    }
});

export default router;
