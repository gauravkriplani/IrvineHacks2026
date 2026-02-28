import fs from 'fs';
import path from 'path';
import puppet from 'puppeteer';

const AOM_JSON_PATH = path.join(process.cwd(), 'aom-output', 'agent-surface.json');
const OUTPUT_FILE = path.join(process.cwd(), 'automation-comparison.txt');

async function generateComparison() {
    console.log('Fetching raw HTML from local Amazon dummy (http://localhost:5000) ...');

    // 1. Get HTML from local dummy amazon
    const browser = await puppet.launch({ headless: 'new' });
    const page = await browser.newPage();

    let htmlContent = '';
    try {
        await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 15000 });
        htmlContent = await page.evaluate(() => document.documentElement.outerHTML);
    } catch (e) {
        console.error('Failed to load local Amazon site:', e.message);
        process.exit(1);
    } finally {
        await browser.close();
    }

    // 2. Get AOM JSON
    let aomContent = '';
    try {
        aomContent = fs.readFileSync(AOM_JSON_PATH, 'utf-8');
    } catch (e) {
        console.error('Failed to read AOM JSON. Please make sure to run parse-aom.js first.');
        process.exit(1);
    }

    // 3. Calculate Stats
    const htmlSizeKB = (htmlContent.length / 1024).toFixed(2);
    const aomSizeKB = (aomContent.length / 1024).toFixed(2);

    const htmlLines = htmlContent.split('\n').length;
    const aomLines = aomContent.split('\n').length;

    // 4. Formatting the Output File
    const output = `================================================================================
AUTOMATION COMPARISON: STANDARD WEB SCRAPING vs. AGENT OBJECT MODEL (AOM)
================================================================================

This file contains a direct comparison of the context an AI agent must process
when automating interactions on the exact same Amazon clone page.

--------------------------------------------------------------------------------
1. THE TRADITIONAL APPROACH: RAW HTML
--------------------------------------------------------------------------------
To use traditional web scraping or DOM-based automation, the agent would need
to process the entire HTML document below.
Size: ${htmlSizeKB} KB
Lines: ${htmlLines.toLocaleString()}
Issues: Highly prone to breakage, massive context window usage, noisy.

--------------------------------------------------------------------------------
2. THE AOM APPROACH: SEMANTIC JSON
--------------------------------------------------------------------------------
Using our Agent Object Model wrappers, the agent only needs to process the 
JSON below, which directly exposes the available actions and inputs.
Size: ${aomSizeKB} KB
Lines: ${aomLines.toLocaleString()}
Benefits: 100% deterministic, minimal context usage, zero DOM-structure dependency.

================================================================================
                           BEGIN RAW HTML (SCENARIO 1)
================================================================================
${htmlContent}


================================================================================
                           BEGIN AOM JSON (SCENARIO 2)
================================================================================
${aomContent}
`;

    fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
    console.log(`\nSuccessfully generated comparison file at:\n${OUTPUT_FILE}\n`);
    console.log(`HTML Size: ${htmlSizeKB} KB`);
    console.log(`AOM Size:  ${aomSizeKB} KB`);
}

generateComparison();
