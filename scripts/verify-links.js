const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

const projectRoot = path.join(__dirname, '..');
const linksFilePath = path.join(projectRoot, 'lib', 'affiliateLinks.ts');
const csvOutputPath = path.join(projectRoot, 'data', 'affiliate_links_registry.csv');

// Helper to escape CSV values
function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Regex to extract http/https URLs from a block of text
function extractUrls(text) {
  if (!text) return [];
  const urlRegex = /https?:\/\/[^\s"'<>\`\)]+/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    let cleanUrl = match[0];
    // Remove trailing punctuation marks that might be part of sentence structure but captured by regex
    cleanUrl = cleanUrl.replace(/[.,;:?!]+$/, '');
    if (!urls.includes(cleanUrl)) {
      urls.push(cleanUrl);
    }
  }
  return urls;
}

// Parse affiliate network from URL
function detectNetwork(url) {
  const lowercaseUrl = url.toLowerCase();
  if (lowercaseUrl.includes('amazon.in') || lowercaseUrl.includes('amazon.com') || lowercaseUrl.includes('link.amazon') || lowercaseUrl.includes('amzn.to')) {
    return 'Amazon Associates';
  }
  if (lowercaseUrl.includes('flipkart.com')) {
    return 'Flipkart Affiliate';
  }
  if (lowercaseUrl.includes('hostinger.in') || lowercaseUrl.includes('hostinger.com')) {
    return 'Hostinger';
  }
  if (lowercaseUrl.includes('sjv.io') || lowercaseUrl.includes('pxf.io')) {
    return 'Impact';
  }
  if (lowercaseUrl.includes('partnerstack')) {
    return 'PartnerStack';
  }
  if (lowercaseUrl.includes('grsm.io')) {
    return 'GrowSumo';
  }
  return 'Direct/Other';
}

async function run() {
  const checkMode = process.argv.includes('--check');
  const checkIndex = process.argv.indexOf('--check');
  const checkValue = checkMode && checkIndex !== -1 ? process.argv[checkIndex + 1] : null;

  console.log('🔍 Scanning BrandBTSS affiliate links...');
  const registry = [];

  // 1. Scan Static Config (lib/affiliateLinks.ts)
  if (fs.existsSync(linksFilePath)) {
    const content = fs.readFileSync(linksFilePath, 'utf8');
    // Extract definitions like: "bonsai-invoicing": { url: "...", network: "..." }
    const regex = /"([^"]+)"\s*:\s*\{\s*url\s*:\s*"([^"]+)"(?:\s*,\s*network\s*:\s*"([^"]+)")?/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const slug = match[1];
      const url = match[2];
      const network = match[3] || detectNetwork(url);
      registry.push({
        source: 'Static Config',
        identifier: slug,
        network: network,
        originalUrl: url,
        redirectUrl: `/go/${slug}`
      });
    }
  }

  // 2. Scan Products Database Table
  try {
    const products = await prisma.product.findMany();
    for (const p of products) {
      let affs = [];
      try {
        affs = JSON.parse(p.affiliateUrls || '[]');
      } catch (e) {
        affs = [];
      }
      
      // If parsed JSON is not an array but an object or empty, wrap it
      if (!Array.isArray(affs)) {
        affs = typeof affs === 'object' && affs !== null ? [affs] : [];
      }

      affs.forEach((aff) => {
        if (aff && aff.url) {
          const network = aff.network || detectNetwork(aff.url);
          registry.push({
            source: `Product: ${p.name}`,
            identifier: p.id,
            network: network,
            originalUrl: aff.url,
            redirectUrl: `/api/redirect?productId=${p.id}&network=${encodeURIComponent(network)}&url=${encodeURIComponent(aff.url)}`
          });
        }
      });
    }
  } catch (err) {
    console.warn('⚠️ Warning: Failed to scan products database table.', err.message);
  }

  // 3. Scan Articles Database Table (Extract links embedded in content/markdown)
  try {
    const articles = await prisma.article.findMany();
    for (const art of articles) {
      // Gather all text fields that can contain links
      const textToScan = [
        art.introduction,
        art.content,
        art.verdict,
        art.buyingGuide,
        art.faqs
      ].filter(Boolean).join('\n');

      const urls = extractUrls(textToScan);
      urls.forEach((url) => {
        // Filter out internal application links or local paths
        if (url.startsWith('/') || url.includes('localhost') || url.includes('127.0.0.1')) {
          return;
        }
        
        const network = detectNetwork(url);
        registry.push({
          source: `Article: ${art.title}`,
          identifier: art.slug,
          network: network,
          originalUrl: url,
          redirectUrl: 'Embedded Link (Direct Navigation)'
        });
      });
    }
  } catch (err) {
    console.warn('⚠️ Warning: Failed to scan articles database table.', err.message);
  }

  // Close Prisma connection
  await prisma.$disconnect();

  // 4. Update the CSV Sheet
  const csvHeaders = ['Source', 'Identifier', 'Network', 'Original URL', 'Redirect URL'];
  const csvLines = [csvHeaders.join(',')];
  registry.forEach((item) => {
    const line = [
      escapeCSV(item.source),
      escapeCSV(item.identifier),
      escapeCSV(item.network),
      escapeCSV(item.originalUrl),
      escapeCSV(item.redirectUrl)
    ].join(',');
    csvLines.push(line);
  });

  try {
    // Ensure parent dir exists
    const dir = path.dirname(csvOutputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(csvOutputPath, csvLines.join('\n'), 'utf8');
    console.log(`📊 Updated link registry CSV sheet at: ${csvOutputPath}`);
    console.log(`📈 Scanned total: ${registry.length} affiliate/outbound links.`);
  } catch (err) {
    console.error('❌ Error writing link registry CSV:', err.message);
  }

  // 5. Handle Check Mode
  if (checkMode) {
    if (!checkValue) {
      console.log('\n❌ Error: Please specify a URL to check. Example: node scripts/verify-links.js --check "https://amazon.in/dp/B08XYXFSN4"');
      process.exit(1);
    }
    
    console.log(`\n🔎 Checking registry for link: "${checkValue}"`);
    const cleanCheckVal = checkValue.toLowerCase().trim();
    
    const matches = registry.filter(item => 
      item.originalUrl.toLowerCase().includes(cleanCheckVal) || 
      item.identifier.toLowerCase().includes(cleanCheckVal)
    );

    if (matches.length > 0) {
      console.log(`\n🚨 MATCH FOUND: The affiliate link already exists in ${matches.length} place(s):\n`);
      matches.forEach((match, idx) => {
        console.log(`[Match #${idx + 1}]`);
        console.log(`📍 Source:      ${match.source}`);
        console.log(`🆔 Identifier:  ${match.identifier}`);
        console.log(`🔌 Network:     ${match.network}`);
        console.log(`🔗 Original:    ${match.originalUrl}`);
        console.log(`↪️ Redirect:    ${match.redirectUrl}`);
        console.log('--------------------------------------------------');
      });
      process.exit(0);
    } else {
      console.log('\n✅ NO MATCH: This affiliate link does NOT exist in the website yet. Safe to place!');
      process.exit(0);
    }
  }
}

run().catch(console.error);
