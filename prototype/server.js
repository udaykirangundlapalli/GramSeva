const express = require('express');
const path = require('path');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Enable CORS for local development API fetching
app.use(cors());

// Serve all static files from the root directory so /html, /css, and /js folders are accessible
app.use(express.static(__dirname));

// Set the default route to automatically serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// In-memory cache to store the scraped schemes
let cachedSchemes = [
  {
    title: "[LIVE] PM Vishwakarma Yojana",
    dept: "Ministry of Micro, Small & Medium Enterprises",
    benefit: "Collateral free credit support up to ₹3 lakh for traditional artisans and craftspeople.",
    eligibility: "Artisans engaged in traditional trades (carpenters, tailors, blacksmiths).",
    docs: "Aadhaar Card, Mobile Number, Bank Account."
  }
];

// The Automated Node.js Web Scraper Engine
const scrapeGovernmentSchemes = async () => {
  try {
    console.log("🔍 Launching invisible browser to scrape real government schemes...");
    
    // Launch Puppeteer (Headless Chrome)
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();

    // Navigate to the real National Portal of India schemes page
    await page.goto('https://www.india.gov.in/my-government/schemes', { waitUntil: 'networkidle2' });

    // Run JavaScript inside that webpage to extract the data
    const newSchemes = await page.evaluate(() => {
      const extractedData = [];
      // Target the specific CSS classes used by india.gov.in
      const items = document.querySelectorAll('.view-content .views-row');
      
      items.forEach(item => {
        const titleElement = item.querySelector('.field-content a');
        if (titleElement) {
          extractedData.push({
            title: `[GOVT] ${titleElement.innerText.trim()}`,
            dept: "Government of India",
            benefit: "Visit the official portal to read the full benefits of this newly released scheme.",
            eligibility: "Open to eligible Indian citizens.",
            docs: "Please refer to official guidelines for required documents."
          });
        }
      });
      return extractedData;
    });
    
    await browser.close();

    // Filter the scraped schemes for "Farmer" or "Youth"
    const filteredSchemes = newSchemes.filter(scheme => {
      const titleLower = scheme.title.toLowerCase();
      return titleLower.includes('farmer') || titleLower.includes('youth');
    });

    if (filteredSchemes.length > 0) {
      cachedSchemes = filteredSchemes;
      console.log(`✅ Successfully scraped ${filteredSchemes.length} real schemes from india.gov.in related to Farmers or Youth!`);
    } else {
      console.log("⚠️ Scrape completed, but no newly scraped schemes matched the 'Farmer' or 'Youth' filter.");
    }
  } catch (error) {
    console.error("❌ Scraping failed (Check URL or network blocks):", error.message);
  }
};

// Run the scraper once immediately when the server starts
scrapeGovernmentSchemes();

// Then set it to automatically scrape again every 12 hours (43,200,000 milliseconds)
setInterval(scrapeGovernmentSchemes, 43200000);

// Endpoint that your frontend app.js fetches every 3 minutes
app.get('/api/schemes/latest', (req, res) => {
  res.json({ success: true, data: cachedSchemes });
});

// 404 Catch-All Route (Triggers if the user types a URL that doesn't exist)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🌱 GramSeva Dev Server is running!`);
  console.log(`👉 Access the portal here: http://localhost:${PORT}`);
  console.log(`🛑 Press Ctrl+C in this terminal to stop the server.\n`);
});