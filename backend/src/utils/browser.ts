import { Browser } from 'puppeteer-core';

export const getBrowserInstance = async (): Promise<Browser> => {
    let browser: Browser;

    // Check if we are running locally or on Vercel
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

    if (isProduction) {
        console.log('Launching Serverless Chromium...');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const chromium = require('@sparticuz/chromium');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const puppeteer = require('puppeteer-core');

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        }) as unknown as Browser;
    } else {
        console.log('Launching Local Puppeteer...');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const localPuppeteer = require('puppeteer');
        browser = await localPuppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }) as unknown as Browser;
    }

    return browser;
};

