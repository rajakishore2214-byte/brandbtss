import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Clean existing tables
  await prisma.click.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.comparison.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Cleaned existing database records.");

  // 1. Seed Categories
  const categoriesData = [
    // B2B Categories (Retained)
    {
      slug: "hosting",
      name: "Web Hosting & Servers",
      description: "Speed, uptime, and server response time are crucial for affiliate conversions. We test and review managed WordPress hosting, shared plans, and cloud VPS for affiliate sites.",
      image: "/images/web_hosting.png",
      seoTitle: "Best Web Hosting for Affiliate Marketing Websites | BrandBTSS",
      seoDescription: "Find the best hosting solutions for your affiliate blog or store. Independent response time metrics, uptime testing, and budget-friendly plan breakdowns.",
      parentSlug: null,
    },
    {
      slug: "email-marketing",
      name: "Email Marketing & Automation",
      description: "Your email list is your most valuable asset. We evaluate and rate delivery success rates, landing page builders, automation builders, and user pricing on top email tools.",
      image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Email Marketing Tools for Affiliates | BrandBTSS",
      seoDescription: "Compare the best email autoresponders, newsletter platforms, and funnel software. Maximize your affiliate click rates with expert software recommendations.",
      parentSlug: null,
    },
    {
      slug: "seo-tools",
      name: "SEO & Keyword Research Tools",
      description: "Rank higher on Google and discover high-value keywords. We review search volumes databases, backlink crawlers, competitor auditing systems, and site audit utilities.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best SEO & Keyword Research Tools Reviewed | BrandBTSS",
      seoDescription: "Grow your organic traffic. In-depth comparisons and reviews of SEMrush, Ahrefs, and alternative keyword research software for niche affiliate sites.",
      parentSlug: null,
    },
    {
      slug: "link-trackers",
      name: "Affiliate Link Trackers & Plugins",
      description: "Clean up long affiliate URLs and track your click analytics. We test WordPress link cloaking plugins and advanced SaaS tracker tools for conversion optimization.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Affiliate Link Cloaking & Tracking Tools | BrandBTSS",
      seoDescription: "Discover the best link tracking software and WordPress plugins. Manage your links, prevent commission theft, and track your referral traffic.",
      parentSlug: null,
    },

    // New Consumer Categories (Parent)
    {
      slug: "home-kitchen",
      name: "Home & Kitchen",
      description: "Discover high-performance kitchen appliances, durable cookware, smart storage solutions, and home cleaning products that elevate your everyday living.",
      image: "/images/philips_airfryer.png",
      seoTitle: "Best Home & Kitchen Products - Tested & Reviewed | BrandBTSS",
      seoDescription: "Read unbiased reviews of the best home and kitchen appliances, cookware sets, and smart home utility products.",
      parentSlug: null,
    },
    {
      slug: "gadgets",
      name: "Gadgets & Electronics",
      description: "Unbiased reviews of the latest smart watches, wireless earbuds, bluetooth speakers, and mobile accessories. Tech recommendations you can trust.",
      image: "/images/samsung_watch.png",
      seoTitle: "Top Gadgets & Personal Electronics Reviews | BrandBTSS",
      seoDescription: "Stay ahead with the latest in consumer technology. From budget smartwatches to high-fidelity earbuds and speakers, we benchmark specs and performance.",
      parentSlug: null,
    },
    {
      slug: "home-decor",
      name: "Home Decor",
      description: "Transform your spaces with modern decorative lighting, unique wall decor, artificial plants, and room decoration products curated for visual excellence.",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Modern Home Decor Inspiration & Products | BrandBTSS",
      seoDescription: "Enhance your interiors. We review wall decorations, lighting fixtures, decorative frames, and indoor planter products for stylish homes.",
      parentSlug: null,
    },
    {
      slug: "lifestyle",
      name: "Lifestyle & Fitness",
      description: "Smart personal health items, fitness gear, travel accessories, and home office setups optimized for productivity, comfort, and active living.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Lifestyle, Fitness & Home Office Gear | BrandBTSS",
      seoDescription: "Maximize your productivity and wellness. Independent reviews of fitness treadmills, dumbbells, travel accessories, and office desk setups.",
      parentSlug: null,
    },

    // Subcategories - Home & Kitchen
    {
      slug: "kitchen-appliances",
      name: "Kitchen Appliances",
      description: "Air fryers, ovens, blenders, and smart kitchen tools designed to make healthy cooking efficient.",
      image: "/images/philips_airfryer.png",
      seoTitle: "Best Kitchen Appliances Reviewed | BrandBTSS",
      seoDescription: "In-depth testing of kitchen appliances. Find the best air fryers, mixers, and cookers for your Indian kitchen.",
      parentSlug: "home-kitchen",
    },
    {
      slug: "cookware",
      name: "Cookware & Kitchen Sets",
      description: "Non-stick frying pans, heavy-duty pressure cookers, and cookware combo sets that last.",
      image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Cookware & Cooking Sets Reviewed | BrandBTSS",
      seoDescription: "Top non-stick cookware, anodized pressure cookers, and stainless steel pans tested for heat distribution and durability.",
      parentSlug: "home-kitchen",
    },
    {
      slug: "storage-solutions",
      name: "Kitchen Storage & Containers",
      description: "Aesthetic container sets, spice racks, and pantry organizers to maximize your kitchen space.",
      image: "https://images.unsplash.com/photo-1595348020910-87cfdae90e3f?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Kitchen Storage Solutions & Containers | BrandBTSS",
      seoDescription: "Keep your kitchen clutter-free. Read reviews of air-tight storage boxes, jar sets, and modular shelf stands.",
      parentSlug: "home-kitchen",
    },

    // Subcategories - Gadgets
    {
      slug: "smart-watches",
      name: "Smart Watches",
      description: "Fitness bands, Apple Watch alternatives, and budget fitness trackers evaluated on sensor accuracy.",
      image: "/images/samsung_watch.png",
      seoTitle: "Best Smart Watches Reviewed for Fitness & Style | BrandBTSS",
      seoDescription: "Track your health. Side-by-side comparison of budget smartwatches, GPS sports trackers, and fitness wearables.",
      parentSlug: "gadgets",
    },
    {
      slug: "wireless-earbuds",
      name: "Wireless Earbuds & TWS",
      description: "True wireless stereo earbuds with active noise cancellation (ANC), heavy bass, and stellar battery lives.",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Wireless Earbuds (TWS) Under Budget | BrandBTSS",
      seoDescription: "Listen on the go. In-depth comparisons of bass, battery backup, and noise cancellation quality on TWS earbuds.",
      parentSlug: "gadgets",
    },
    {
      slug: "bluetooth-speakers",
      name: "Bluetooth Speakers",
      description: "Portable wireless speakers, outdoor party speakers, and mini audio docks reviewed on sound signature.",
      image: "/images/jbl_speaker.png",
      seoTitle: "Best Portable Bluetooth Speakers | BrandBTSS",
      seoDescription: "Find the best bluetooth speaker for your bedroom or outdoor treks. Uptime battery, audio response, and water resistance testing.",
      parentSlug: "gadgets",
    },

    // Subcategories - Home Decor
    {
      slug: "decorative-lighting",
      name: "Decorative Lighting",
      description: "Smart bulbs, fairy string lights, wall sconces, and ambient desk lamps for warm interiors.",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Decorative Lighting Fixtures & Lamps | BrandBTSS",
      seoDescription: "Light up your home. Independent analysis of LED strips, floor lamps, and smart decorative bulbs.",
      parentSlug: "home-decor",
    },
    {
      slug: "wall-decor",
      name: "Wall Decor & Frames",
      description: "Paintings, collage photo frames, metal wall art, and floating shelves for modern homes.",
      image: "https://images.unsplash.com/photo-1531243269054-5ebf6f3b0b6e?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Creative Wall Decor & Artistic Frames | BrandBTSS",
      seoDescription: "Personalize your living room. Reviews of aesthetic hangings, shelves, and modern wall artwork sets.",
      parentSlug: "home-decor",
    },

    // Subcategories - Lifestyle
    {
      slug: "fitness-equipment",
      name: "Fitness Equipment",
      description: "Treadmills, yoga mats, resistance bands, and home dumbbell sets for daily calorie burning.",
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Home Gym & Fitness Equipment | BrandBTSS",
      seoDescription: "Stay active at home. In-depth testing of home dumbbells, resistance cords, yoga mats, and treadmills.",
      parentSlug: "lifestyle",
    },
    {
      slug: "travel-accessories",
      name: "Travel Accessories",
      description: "Durable hardshell suitcases, modular tech organizers, passport wallets, and gym duffel bags.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
      seoTitle: "Best Travel Gear, Suitcases & Bags | BrandBTSS",
      seoDescription: "Travel smart. Reviews of trolley suitcases, anti-theft backpacks, and high-utility tech cases.",
      parentSlug: "lifestyle",
    }
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log("Seeded 18 Categories and Subcategories successfully.");

  // 2. Seed Products
  const productsData = [
    // B2B Products (Retained)
    {
      id: "hostinger-managed-wordpress",
      name: "Hostinger Business WordPress",
      brand: "Hostinger",
      categorySlug: "hosting",
      price: 269,
      originalPrice: 599,
      rating: 4.7,
      image: "/images/web_hosting.png",
      description: "Highly optimized Managed WordPress hosting offering top-tier loading speeds, LiteSpeed cache engine, free domain name, and robust NVMe storage.",
      features: JSON.stringify([
        "LiteSpeed Cache & object cache for sub-second page loads",
        "Free domain registration, SSL certificates, and professional email",
        "Automatic daily backups and easy 1-click staging tools",
        "Robust NVMe storage limits up to 200 GB"
      ]),
      pros: JSON.stringify([
        "Incredibly budget-friendly hosting plans for new affiliate sites",
        "Superb speed and TTFB (Time to First Byte) via LiteSpeed servers",
        "24/7 fast customer support via chat and ticket console"
      ]),
      cons: JSON.stringify([
        "Renewal prices increase significantly after initial term",
        "No phone-based support options available"
      ]),
      specs: JSON.stringify({
        "Storage": "200 GB NVMe Storage",
        "Bandwidth": "Unlimited Bandwidth",
        "Free Domain": "Yes (First Year)",
        "SSL Certificate": "Free & Unlimited",
        "Backup": "Daily Automatic Backups"
      }),
      dealTag: "Save 55%",
      score: 91,
      affiliateUrls: JSON.stringify([
        { network: "Impact", url: "https://hostinger.in/brandbtss", price: 269 }
      ])
    },
    {
      id: "bluehost-shared-hosting",
      name: "Bluehost Choice Plus Plan",
      brand: "Bluehost",
      categorySlug: "hosting",
      price: 399,
      originalPrice: 899,
      rating: 4.4,
      image: "/images/web_hosting.png",
      description: "The industry standard shared hosting plan officially recommended by WordPress.org, featuring built-in CDN, staging, and domain privacy.",
      features: JSON.stringify([
        "Free Cloudflare CDN integration for global content delivery",
        "Built-in staging environment to test design adjustments safely",
        "Domain privacy protection and automated malware scanning",
        "Recommended officially by WordPress core team"
      ]),
      pros: JSON.stringify([
        "1-click installation with intuitive dashboard guidelines",
        "Free domain name and privacy settings included in first year",
        "Uptime consistency is highly reliable (99.98% benchmarked)"
      ]),
      cons: JSON.stringify([
        "In-house speed tools are basic compared to LiteSpeed",
        "Upsells during the checkout flow can be annoying"
      ]),
      specs: JSON.stringify({
        "Storage": "40 GB SSD Storage",
        "Bandwidth": "Unmetered Bandwidth",
        "Free Domain": "Yes (with privacy shield)",
        "SSL Certificate": "Free Let's Encrypt",
        "Backup": "Daily Backups (First Year)"
      }),
      dealTag: "55% Off Choice Plus",
      score: 84,
      affiliateUrls: JSON.stringify([
        { network: "CJ Affiliate", url: "https://bluehost.com/brandbtss", price: 399 }
      ])
    },
    {
      id: "wpengine-managed-cloud",
      name: "WP Engine Startup Managed Cloud",
      brand: "WP Engine",
      categorySlug: "hosting",
      price: 2450,
      originalPrice: 3000,
      rating: 4.8,
      image: "/images/web_hosting.png",
      description: "Premium managed hosting designed specifically for heavy-traffic affiliate sites, utilizing Google Cloud infrastructure and advanced security layers.",
      features: JSON.stringify([
        "Google Cloud Platform nodes with custom server architecture",
        "EverCache proprietary caching solution engineered for WordPress",
        "Free automated migration plugin with live status tracker",
        "Built-in EverClean security monitoring and automated patching"
      ]),
      pros: JSON.stringify([
        "Incredible page load performance handles traffic spikes easily",
        "Staging and development environments are highly integrated",
        "Expert-level WordPress developer support available 24/7"
      ]),
      cons: JSON.stringify([
        "Premium pricing is high for beginners",
        "Does not include free email accounts or domains"
      ]),
      specs: JSON.stringify({
        "Storage": "10 GB Local Storage",
        "Bandwidth": "50 GB Bandwidth (25K visits)",
        "Free Domain": "No",
        "SSL Certificate": "Free Automated SSL",
        "Backup": "Daily Manual & Auto Backups"
      }),
      dealTag: "Save 18%",
      score: 94,
      affiliateUrls: JSON.stringify([
        { network: "ShareASale", url: "https://wpengine.com/brandbtss", price: 2450 }
      ])
    },

    // New Consumer Products: Kitchen Appliances
    {
      id: "philips-air-fryer-hd9252",
      name: "Philips Essential Air Fryer HD9252/90",
      brand: "Philips",
      categorySlug: "kitchen-appliances",
      price: 7299,
      originalPrice: 9995,
      rating: 4.6,
      image: "/images/philips_airfryer.png",
      description: "Bring home the World's No. 1 Airfryer for a 100% taste profile satisfaction with up to 90% less oil. Powered by Rapid Air technology with a unique starfish design for crispier outcomes.",
      features: JSON.stringify([
        "Rapid Air Technology swirls hot air for crispy food",
        "Touch screen with 7 presets for quick recipe selection",
        "Keep warm function maintains food temperature up to 30 mins",
        "Easy clean basket with non-stick coating safety"
      ]),
      pros: JSON.stringify([
        "Consistently cooks food evenly without drying it out",
        "Pre-sets work perfectly for frozen snacks and baking",
        "Requires virtually zero pre-heating time"
      ]),
      cons: JSON.stringify([
        "Capacity is 4.1 Liters, suitable for only 2-3 people maximum",
        "Short power chord makes placement restricted"
      ]),
      specs: JSON.stringify({
        "Capacity": "4.1 Liters",
        "Power Wattage": "1400 Watts",
        "Presets": "7 One-Touch presets",
        "Technology": "Rapid Air Starfish",
        "Warranty": "2 Years Global Warranty"
      }),
      dealTag: "Best Seller - 27% Off",
      score: 95,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B08XYXFSN4?tag=brandbtss-21", price: 7299 },
        { network: "Flipkart", url: "https://flipkart.com/philips-hd9252-air-fryer/p/itmd1", price: 7499 }
      ])
    },
    {
      id: "solara-digital-air-fryer",
      name: "SOLARA Digital Air Fryer Large 5.5L",
      brand: "Solara",
      categorySlug: "kitchen-appliances",
      price: 4999,
      originalPrice: 8999,
      rating: 4.3,
      image: "/images/philips_airfryer.png",
      description: "Large capacity digital air fryer featuring 6 presets and an elegant blue touch interface. Offers excellent cooking capacity for Indian families at a budget friendly price point.",
      features: JSON.stringify([
        "Large 5.5-liter pan holds whole chicken or large fries batch",
        "8 Presets for convenient automated cooking steps",
        "Solara Recipe Mobile App with 100+ items included",
        "Nonstick dishwasher safe pan insert"
      ]),
      pros: JSON.stringify([
        "Excellent price-to-volume ratio (5.5L under ₹5,000)",
        "Stellar touch responsiveness on the glass display",
        "Extremely quiet fan operation compared to competitors"
      ]),
      cons: JSON.stringify([
        "Heat shielding is basic; body gets warm during long baking sessions",
        "Needs a 16 Amp power plug slot"
      ]),
      specs: JSON.stringify({
        "Capacity": "5.5 Liters",
        "Power Wattage": "1800 Watts",
        "Presets": "8 Digital presets",
        "Technology": "360 Degree Hot Air Circulation",
        "Warranty": "1 Year Brand Warranty"
      }),
      dealTag: "Budget King - 44% Off",
      score: 89,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B09GDQDZ6R?tag=brandbtss-21", price: 4999 },
        { network: "Flipkart", url: "https://flipkart.com/solara-digital-air-fryer/p/itm2", price: 5199 }
      ])
    },

    // New Consumer Products: Smart Watches
    {
      id: "noise-colorfit-pulse-grand",
      name: "Noise ColorFit Pulse Grand Smartwatch",
      brand: "Noise",
      categorySlug: "smart-watches",
      price: 1799,
      originalPrice: 3999,
      rating: 4.1,
      image: "/images/samsung_watch.png",
      description: "An incredibly feature-rich entry-level smartwatch containing a large 1.69 inch LCD display, 60 sports tracking modes, instant reply, and health tracking sensors.",
      features: JSON.stringify([
        "1.69-inch vibrant LCD touchscreen display",
        "24/7 heart rate monitor, SpO2 tracker, and sleep analyst",
        "IP68 sweat and water resistance certificate rating",
        "Up to 7 days battery charge capacity"
      ]),
      pros: JSON.stringify([
        "Very inexpensive point of entry for tracking basics",
        "NoiseFit App syncs smoothly with Google Fit",
        "Premium looks with cloud customizable watch faces"
      ]),
      cons: JSON.stringify([
        "Sensor readings can fluctuate during heavy gym workouts",
        "Display is not AMOLED; basic sunlight visibility"
      ]),
      specs: JSON.stringify({
        "Display Size": "1.69 Inches TFT LCD",
        "Battery backup": "Up to 7 Days",
        "Waterproofing": "IP68 Certified",
        "Sports Modes": "60 Sports Profiles",
        "Health Sensors": "Heart rate, SpO2, Sleep monitor"
      }),
      dealTag: "Under ₹2000 Best Seller",
      score: 86,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B09NV9J5F2?tag=brandbtss-21", price: 1799 },
        { network: "Flipkart", url: "https://flipkart.com/noise-colorfit-pulse-grand/p/itm3", price: 1899 }
      ])
    },
    {
      id: "samsung-galaxy-watch6",
      name: "Samsung Galaxy Watch6 LTE (44mm)",
      brand: "Samsung",
      categorySlug: "smart-watches",
      price: 24999,
      originalPrice: 36999,
      rating: 4.7,
      image: "/images/samsung_watch.png",
      description: "The ultimate Android smartwatch experience. Features a premium Super AMOLED display, sapphire crystal screen cover, ECG monitor, blood pressure sensor, and LTE cellular functionality.",
      features: JSON.stringify([
        "Super AMOLED Display with sapphire glass cover",
        "Exynos W930 dual-core processor with Wear OS powered by Samsung",
        "BioActive Sensor tracks skeletal muscle and fat body ratios",
        "LTE Standalone cellular capabilities via eSIM mapping"
      ]),
      pros: JSON.stringify([
        "Peerless app ecosystem (Google Maps, Spotify, Assistant on wrist)",
        "Extreme accuracy in steps, heart rate, and sleep metrics",
        "Stunning display with fluid 60Hz scroll refresh rates"
      ]),
      cons: JSON.stringify([
        "Battery lasts barely 1.5 days under moderate usage",
        "Advanced features like ECG require a Samsung Galaxy phone"
      ]),
      specs: JSON.stringify({
        "Display Size": "1.5 Inches Super AMOLED",
        "Battery backup": "Up to 40 Hours (1.5 Days)",
        "Waterproofing": "5ATM + IP68 + MIL-STD-810H",
        "Operating System": "Wear OS 4 (Samsung One UI Watch)",
        "Health Sensors": "BioActive sensor, ECG, SpO2, Temperature"
      }),
      dealTag: "Premium Pick - Save 32%",
      score: 93,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B0CBJDVKK7?tag=brandbtss-21", price: 24999 },
        { network: "Flipkart", url: "https://flipkart.com/samsung-galaxy-watch6/p/itm4", price: 25499 }
      ])
    },

    // New Consumer Products: Bluetooth Speakers
    {
      id: "jbl-go-4",
      name: "JBL Go 4 Ultra-Portable Waterproof Speaker",
      brand: "JBL",
      categorySlug: "bluetooth-speakers",
      price: 3999,
      originalPrice: 4999,
      rating: 4.5,
      image: "/images/jbl_speaker.png",
      description: "JBL Pro Sound delivers surprisingly big audio and punchy bass from Go 4's ultra-compact size. Completely redesigned with a stylish carrying strap, IP67 rating, and Auracast support.",
      features: JSON.stringify([
        "Ultra-portable JBL Pro Sound signature",
        "IP67 Waterproof and dustproof build for beach or pool treks",
        "Up to 7 hours of playback time plus 2 hours extension via Playtime Boost",
        "Multi-speaker connection via Auracast pairing technology"
      ]),
      pros: JSON.stringify([
        "Exceptionally pocketable and lightweight (200g)",
        "Stunning bass response for its tiny dimensions",
        "Eco-friendly build utilizing recycled plastics and fabrics"
      ]),
      cons: JSON.stringify([
        "No speakerphone mic built-in for picking up calls",
        "High charging duration (takes about 3 hours to top up)"
      ]),
      specs: JSON.stringify({
        "Output Power": "4.2 Watts RMS",
        "Battery backup": "Up to 7 Hours (Boost to 9)",
        "Waterproofing": "IP67 Rated",
        "Bluetooth Version": "Bluetooth 5.3 LE",
        "Weight": "190 grams"
      }),
      dealTag: "Hot Release - 20% Off",
      score: 91,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B0D1YGDFSL?tag=brandbtss-21", price: 3999 },
        { network: "Flipkart", url: "https://flipkart.com/jbl-go-4/p/itm5", price: 3899 }
      ])
    },
    {
      id: "sony-srs-xb100",
      name: "Sony SRS-XB100 Compact Wireless Speaker",
      brand: "Sony",
      categorySlug: "bluetooth-speakers",
      price: 4490,
      originalPrice: 5990,
      rating: 4.4,
      image: "/images/jbl_speaker.png",
      description: "Take powerful, clear sound wherever you go with the Sony SRS-XB100. Featuring a passive radiator, Sound Diffusion Processor, and a multiway strap.",
      features: JSON.stringify([
        "Sound Diffusion Processor spreads audio widely",
        "Passive radiator yields deep, thumping low frequencies",
        "Up to 16 hours of continuous battery life",
        "Built-in mic with Echo Cancelling technology for call picking"
      ]),
      pros: JSON.stringify([
        "Huge battery life (lasts 14-16 hours easily)",
        "Built-in microphone for hands-free call capabilities",
        "Clear sound at high volumes without distortion"
      ]),
      cons: JSON.stringify([
        "Bass signature is soft compared to JBL's direct punch",
        "Slightly bulkier vertical cylinder shape"
      ]),
      specs: JSON.stringify({
        "Output Power": "5 Watts",
        "Battery backup": "Up to 16 Hours",
        "Waterproofing": "IP67 Rated",
        "Bluetooth Version": "Bluetooth 5.3",
        "Weight": "274 grams"
      }),
      dealTag: "Long Battery King",
      score: 90,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B0CCSKHNVH?tag=brandbtss-21", price: 4490 },
        { network: "Flipkart", url: "https://flipkart.com/sony-srs-xb100/p/itm6", price: 4590 }
      ])
    },

    // New Consumer Products: Decorative Lighting
    {
      id: "philips-decorative-lights",
      name: "Philips Smart LED decorative copper string lights",
      brand: "Philips",
      categorySlug: "decorative-lighting",
      price: 1299,
      originalPrice: 2499,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600",
      description: "Brighten your room walls or festival decorations using Philips Smart Wi-Fi string lights. Fully compatible with Amazon Alexa and Google Assistant for hands-free voice operations.",
      features: JSON.stringify([
        "10-meter long flexible copper string with 100 warm LEDs",
        "Wi-Fi connected; controls via WiZ App on smartphones",
        "Alexa and Google Assistant integrations out of the box",
        "Custom schedules and warm glow dimming thresholds"
      ]),
      pros: JSON.stringify([
        "Extremely elegant and warm golden-amber visual vibe",
        "Smart App allows custom twinkle and flash configurations",
        "USB powered; can run off a power bank easily"
      ]),
      cons: JSON.stringify([
        "Copper wire is thin and requires careful handling to prevent snaps",
        "Not waterproof (strict indoor usage recommendations)"
      ]),
      specs: JSON.stringify({
        "Length": "10 Meters",
        "LED Count": "100 Warm LEDs",
        "Power Source": "USB 5V Adapter",
        "Connectivity": "Wi-Fi 2.4GHz (WiZ App)",
        "Voice Assistant": "Alexa, Google Assistant"
      }),
      dealTag: "Festival Sale - 48% Off",
      score: 87,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B0BGDW27M5?tag=brandbtss-21", price: 1299 }
      ])
    },

    // New Consumer Products: Fitness Equipment
    {
      id: "fitkit-treadmill",
      name: "Fitkit FT100 Series 3.25HP Motorized Treadmill",
      brand: "Fitkit",
      categorySlug: "fitness-equipment",
      price: 18999,
      originalPrice: 35000,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=600",
      description: "Start your weight loss journey at home with the Fitkit FT100 motorized treadmill. Featuring a 3.25 HP peak motor capacity, auto lubrication system, and free smart trainer app coaching.",
      features: JSON.stringify([
        "3.25 HP Peak efficient DC motor",
        "Speed capacity ranging from 1 to 14 km/hr",
        "Folds vertically to save living room spaces",
        "LCD console tracks Speed, Time, Distance, and Calories burned"
      ]),
      pros: JSON.stringify([
        "Incredibly feature-rich setup for a treadmill under ₹20,000",
        "Quiet motor won't disturb family members in next rooms",
        "Includes a free dietitian session and trainer workout plans"
      ]),
      cons: JSON.stringify([
        "Max user weight recommendation is strictly 110 kg",
        "Manual inclination tuning is tedious (requires stopping treadmill)"
      ]),
      specs: JSON.stringify({
        "Motor Power": "1.75 HP Continuous (3.25 HP Peak)",
        "Max User Weight": "110 kg",
        "Max Speed": "14 km/hr",
        "Incline Type": "Manual (3 levels)",
        "Belt Size": "1200 x 400 mm"
      }),
      dealTag: "Home Gym Deal - 45% Off",
      score: 88,
      affiliateUrls: JSON.stringify([
        { network: "Amazon", url: "https://amazon.in/dp/B075S76XYK?tag=brandbtss-21", price: 18999 },
        { network: "Flipkart", url: "https://flipkart.com/fitkit-ft100-motorized-treadmill/p/itm7", price: 19499 }
      ])
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({ data: prod });
  }
  console.log(`Seeded ${productsData.length} Products successfully.`);

  // 3. Seed Comparisons
  const comparisonsData = [
    {
      slug: "hostinger-vs-bluehost",
      title: "Hostinger Business vs Bluehost Choice Plus",
      productAId: "hostinger-managed-wordpress",
      productBId: "bluehost-shared-hosting",
      introduction: "Choosing between Hostinger and Bluehost for your new affiliate blog? While both offer affordable entry-level shared plans, their backend technology and speed optimizations are completely different. Hostinger relies on high-speed LiteSpeed servers, while Bluehost offers a highly integrated, classic Apache setup endorsed by WordPress.org. Let's compare them side-by-side.",
      featureBreakdown: JSON.stringify([
        {
          feature: "Server Caching Speed",
          productAValue: "LiteSpeed Web Server with LSCache engine (Sub-second loading speed)",
          productBValue: "Standard Apache setup (Moderate caching tools)",
          winner: "A"
        },
        {
          feature: "Storage limits",
          productAValue: "200 GB NVMe Storage (Ultra-fast file transfers)",
          productBValue: "40 GB SSD Storage (Standard file transfers)",
          winner: "A"
        },
        {
          feature: "Domain Features",
          productAValue: "Free Domain (No privacy shield in basic plans)",
          productBValue: "Free Domain + Privacy protection included",
          winner: "B"
        },
        {
          feature: "Pricing & Value",
          productAValue: "₹269 / month (Renewals are relatively cheaper)",
          productBValue: "₹399 / month (Renewal prices increase significantly)",
          winner: "A"
        }
      ]),
      verdict: "Buy **Hostinger Business** if you want the absolute best speed performance and value for your money. Its LiteSpeed caching engine delivers faster page loads. Buy **Bluehost Choice Plus** if you prefer a classic, WordPress.org-recommended dashboard with domain privacy protections included out-of-the-box.",
      seoTitle: "Hostinger vs Bluehost: Which is Best for Affiliate Sites? | BrandBTSS",
      seoDescription: "In-depth web hosting comparison: Hostinger Business vs Bluehost Choice Plus. We compare page speed, server caching, storage, pricing, and support metrics."
    },
    {
      slug: "philips-vs-solara-air-fryer",
      title: "Philips Essential HD9252 vs Solara Digital 5.5L Air Fryer",
      productAId: "philips-air-fryer-hd9252",
      productBId: "solara-digital-air-fryer",
      introduction: "Cooking with less oil is the best health decision for your family. Two of the most popular digital air fryers in India are the Philips Essential 4.1L and the Solara Digital 5.5L. While Philips represents premium build and brand lineage, Solara offers maximum capacity and high-end controls at a budget cost. Let's look at them side-by-side.",
      featureBreakdown: JSON.stringify([
        {
          feature: "Basket Capacity",
          productAValue: "4.1 Liters (Ideal for couples or small batches)",
          productBValue: "5.5 Liters (Perfect for larger family sizes)",
          winner: "B"
        },
        {
          feature: "Heating Technology",
          productAValue: "Rapid Air Starfish (Crisps food incredibly fast and even)",
          productBValue: "360 degree hot air circulation (Takes 2-3 mins longer)",
          winner: "A"
        },
        {
          feature: "Power Consumption",
          productAValue: "1400 Watts (Highly efficient, works on 5A/16A plug)",
          productBValue: "1800 Watts (Requires dedicated 16A power socket)",
          winner: "A"
        },
        {
          feature: "Pricing Value",
          productAValue: "₹7,299 (Premium pricing for brand warranty)",
          productBValue: "₹4,999 (Incredible budget value for its size)",
          winner: "B"
        }
      ]),
      verdict: "Buy the **Philips Essential HD9252** if you live in a small household and value speed, even crispiness, and premium build quality above all. Buy the **Solara 5.5L Air Fryer** if you need larger cooking capacities to prepare meals for a family of 4+ members and want to stay strictly under a ₹5,000 budget.",
      seoTitle: "Philips vs Solara Air Fryer: Best Digital Air Fryer Comparison | BrandBTSS",
      seoDescription: "Searching for the best air fryer under budget? Check out our side-by-side comparison of Philips Essential 4.1L vs Solara 5.5L specs, capacities, and ratings."
    },
    {
      slug: "jbl-go-4-vs-sony-xb100",
      title: "JBL Go 4 vs Sony SRS-XB100 Bluetooth Speaker",
      productAId: "jbl-go-4",
      productBId: "sony-srs-xb100",
      introduction: "If you want a pocketable bluetooth speaker for hiking, treks, or study desks, the JBL Go 4 and Sony SRS-XB100 represent the best compact offerings. While JBL provides modern pocket-friendly aesthetics and punchy direct sound, Sony promises an astronomical 16-hour battery backup and call functionalities. Let's compare them.",
      featureBreakdown: JSON.stringify([
        {
          feature: "Battery Life",
          productAValue: "Up to 7 Hours (Boost to 9 hours via app settings)",
          productBValue: "Up to 16 Hours (Stellar and long lasting)",
          winner: "B"
        },
        {
          feature: "Bass & Audio Punch",
          productAValue: "JBL Pro Sound with heavy low-frequency kick",
          productBValue: "Sound Diffusion Processor (Softer, wider soundstage)",
          winner: "A"
        },
        {
          feature: "Hands-Free Calling",
          productAValue: "No microphone (Cannot pick up calls)",
          productBValue: "Built-in mic with echo cancelling capabilities",
          winner: "B"
        },
        {
          feature: "Weight & Portability",
          productAValue: "190 grams (Flat rectangular easy pocket slide)",
          productBValue: "274 grams (Slightly taller cylindrical block)",
          winner: "A"
        }
      ]),
      verdict: "Buy the **JBL Go 4** if you want the absolute best bass punch and flat portable aesthetic to slide into your jean pockets. Buy the **Sony SRS-XB100** if you value call conferencing functionalities, speakerphone mics, and massive battery backups for overnight outdoor camping treks.",
      seoTitle: "JBL Go 4 vs Sony SRS-XB100: Best Mini Bluetooth Speaker | BrandBTSS",
      seoDescription: "Mini speaker duel: JBL Go 4 vs Sony SRS-XB100. Side-by-side testing of battery life, waterproofing, speakerphone mic, and sound quality."
    }
  ];

  for (const comp of comparisonsData) {
    await prisma.comparison.create({ data: comp });
  }
  console.log("Seeded Comparisons successfully.");

  // 4. Seed Articles
  const articlesData = [
    // B2B Article (Retained)
    {
      slug: "best-web-hosting-for-affiliate-marketing",
      type: "best",
      title: "Best Web Hosting for Affiliate Marketing Sites (Tested & Rated)",
      description: "Hosting speed directly impacts your conversion rates and search engine rankings. We benchmarked response times, uptime, and load capacity of the top hosting providers.",
      categorySlug: "hosting",
      date: "June 6, 2026",
      author: "Rohan Sharma, Tech Analyst",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800",
      introduction: "In affiliate marketing, page speed is money. A one-second delay can drop conversions by up to 20%. For review blogs and landing pages, you need a web host that provides fast Time to First Byte (TTFB), handles massive traffic spikes when campaigns go viral, and features solid uptime safeguards. We set up identical test WordPress sites on Hostinger, Bluehost, and WP Engine, and monitored them using premium speed monitoring tools.",
      quickRecommendation: JSON.stringify({
        overallPickId: "wpengine-managed-cloud",
        budgetPickId: "hostinger-managed-wordpress",
        premiumPickId: "wpengine-managed-cloud",
        summary: "For starting affiliate sites, Hostinger Business WordPress is the undisputed value king. It uses high-speed LiteSpeed servers and is budget-friendly. If you have traffic or a high-paying niche, WP Engine's managed cloud provides industry-leading stability and speeds."
      }),
      topPicks: JSON.stringify([
        {
          productId: "hostinger-managed-wordpress",
          tag: "Best Budget Choice",
          awardReason: "Offers sub-second loading speeds via LiteSpeed caching, a free domain name, and automated backups starting under ₹300 a month."
        },
        {
          productId: "wpengine-managed-cloud",
          tag: "Best Premium & Performance",
          awardReason: "Utilizes advanced Google Cloud hosting nodes and EverCache caching. Handles huge traffic spikes seamlessly and offers outstanding developer tools."
        }
      ]),
      productIds: JSON.stringify(["hostinger-managed-wordpress", "bluehost-shared-hosting", "wpengine-managed-cloud"]),
      buyingGuide: JSON.stringify([
        {
          title: "How to Choose an Affiliate Web Host",
          content: "When evaluating hosting providers, look at server response times (TTFB) and disk speed (NVMe SSD storage). Basic hosting providers often overload their servers, causing site load slowdowns. Look for hosts offering server caching integrations (like LiteSpeed or WP Engine EverCache). Also, make sure they perform automated daily backups to protect your site data."
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Can I host multiple websites on Hostinger Business?",
          answer: "Yes! The Hostinger Business plan allows you to host up to 100 websites on a single account, making it perfect for managing multiple niche review sites."
        }
      ]),
      verdict: null,
      rating: null,
      seoTitle: "Best Web Hosting for Affiliate Sites (Tested Benchmarks) | BrandBTSS",
      seoDescription: "Searching for the fastest hosting for your review website? Read our independent comparisons of Hostinger, Bluehost, and WP Engine speed metrics."
    },

    // Consumer Article 1: Best Air Fryers Under 5000 (Buying Guide)
    {
      slug: "best-air-fryers-under-5000",
      type: "best",
      title: "Best Air Fryers Under ₹5000 in India (2026 Buying Guide)",
      description: "Fried food doesn't have to be oily and unhealthy. We tested and compared leading budget digital air fryers under ₹5000 on heating speeds and volume.",
      categorySlug: "kitchen-appliances",
      date: "June 12, 2026",
      author: "Sneha Nair, Nutritionist & Chef",
      image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=800",
      introduction: "Healthy cooking is taking Indian kitchens by storm, and air fryers have quickly transitioned from luxury gadgets to daily kitchen essentials. If you want crispy French fries, samosas, or grilled paneer with 90% less oil but want to stay strictly under a ₹5,000 budget, you are in the right place. We purchased and tested 4 budget air fryers to review which one delivers the absolute best crunch, capacity, and power efficiency.",
      quickRecommendation: JSON.stringify({
        overallPickId: "solara-digital-air-fryer",
        budgetPickId: "solara-digital-air-fryer",
        premiumPickId: "philips-air-fryer-hd9252", // Philips is a premium benchmark
        summary: "For larger families, the Solara Digital 5.5L Air Fryer is the undisputed budget king under ₹5,000. It offers massive space and a beautiful digital glass top. If you can stretch your budget slightly, the Philips HD9252 provides unmatched cooking consistency."
      }),
      topPicks: JSON.stringify([
        {
          productId: "solara-digital-air-fryer",
          tag: "Best Budget & Capacity",
          awardReason: "Provides an enormous 5.5 Liter capacity, blue touch screen presets, and quiet operation under ₹5000."
        }
      ]),
      productIds: JSON.stringify(["solara-digital-air-fryer", "philips-air-fryer-hd9252"]),
      buyingGuide: JSON.stringify([
        {
          title: "What is an Air Fryer and How Does It Work?",
          content: "Air fryers do not actually fry food. Instead, they operate like supercharged convection ovens. A heating element generates high heat, and a powerful fan circulates this hot air around your food at high velocities. This creates a crispy, browned outer layer (via the Maillard chemical reaction) using only the natural oils in the food."
        },
        {
          title: "Basket Size: Why Liters Matter in Indian Cooking",
          content: "For a single user or couple, a 2.5L to 4.1L air fryer is sufficient. However, for Indian households preparing larger batches of gobi manchurian or chicken tikkas, look for 5L+ capacities. Buying too small leads to crowding the basket, which results in soggy, unevenly cooked food."
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Can we use aluminum foil inside a budget air fryer?",
          answer: "Yes, you can use aluminum foil or parchment paper in an air fryer basket. However, never place it alone without food on top, otherwise the powerful airflow will push it into the heating element, causing a fire hazard."
        },
        {
          question: "Does an air fryer consume high electricity?",
          answer: "An average air fryer consumes between 1400 to 1800 Watts of power. Since cooking times are short (typically 12-18 minutes), the overall electricity consumption is very low, costing under ₹3 to ₹5 per session."
        }
      ]),
      verdict: null,
      rating: null,
      seoTitle: "Best Digital Air Fryers Under ₹5000 in India (2026) | BrandBTSS",
      seoDescription: "Searching for a budget air fryer? Read our hands-on reviews of the best air fryers under ₹5000 with comparison charts, specs, and pros & cons."
    },

    // Consumer Article 2: Best Portable Speakers (Guide)
    {
      slug: "best-portable-bluetooth-speakers",
      type: "best",
      title: "Best Portable Bluetooth Speakers to Buy in 2026",
      description: "Compare the best compact wireless bluetooth speakers on battery backup, audio crispness, and waterproofing durability.",
      categorySlug: "bluetooth-speakers",
      date: "June 10, 2026",
      author: "Kabir Mehta, Audio Journalist",
      image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=800",
      introduction: "Whether you are listing to acoustic tracks at your study table or hosting a weekend pool party, a portable bluetooth speaker is a must-have accessory. In this guide, we evaluate pocket-friendly mini speakers. We put the JBL Go 4 and Sony SRS-XB100 through rigorous frequency testing, water submersions, and continuous battery run-downs.",
      quickRecommendation: JSON.stringify({
        overallPickId: "jbl-go-4",
        budgetPickId: "jbl-go-4",
        premiumPickId: "sony-srs-xb100",
        summary: "If you prioritize bass response, modern design, and quick carrying handles, buy the JBL Go 4. If you require long-lasting batteries (16 hours) and hands-free calling mics, choose the Sony SRS-XB100."
      }),
      topPicks: JSON.stringify([
        {
          productId: "jbl-go-4",
          tag: "Best Sound & Portability",
          awardReason: "Combines 4.2W JBL Pro audio output with an ultra-flat design, making it the most pocketable bass speaker."
        },
        {
          productId: "sony-srs-xb100",
          tag: "Best Battery Uptime & Calling",
          awardReason: "Includes a built-in speakerphone microphone and runs up to 16 hours on a single charge."
        }
      ]),
      productIds: JSON.stringify(["jbl-go-4", "sony-srs-xb100"]),
      buyingGuide: JSON.stringify([
        {
          title: "IP Ratings Explained: IP67 vs IPX7",
          content: "An IP rating determines dust and water resistance. IP67 means the speaker is completely dustproof (6) and can survive immersion in up to 1 meter of water for 30 minutes (7). IPX7 means it is waterproof but not rated for dust exclusion. For outdoor hikes, choose IP67 speakers."
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Can we connect multiple speakers together?",
          answer: "Yes, the JBL Go 4 features Auracast pairing which allows you to link multiple Auracast-compatible speakers together to play synchronized stereo sound."
        }
      ]),
      verdict: null,
      rating: null,
      seoTitle: "Best Portable Bluetooth Speakers: Sound & Battery Tests | BrandBTSS",
      seoDescription: "Looking for a portable speaker? Read our independent reviews and comparisons of JBL Go 4, Sony SRS-XB100, and more on bass and battery."
    },

    // Consumer Article 3: Philips Air Fryer Single Review
    {
      slug: "philips-air-fryer-hd9252-review",
      type: "review",
      title: "Philips Essential HD9252/90 Air Fryer Review: Is It Worth the Premium?",
      description: "We spent 30 days cooking samosas, fries, and baking cakes in the Philips Essential HD9252 air fryer. Read our comprehensive review.",
      categorySlug: "kitchen-appliances",
      date: "June 14, 2026",
      author: "Sneha Nair, Nutritionist & Chef",
      image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=800",
      introduction: "Philips pioneered the air frying category, and its HD9252 digital air fryer is currently one of the top-rated appliances on Amazon. However, at a price point that is almost double that of entry-level brands, is it actually worth the premium? We put it through daily cooking tests to analyze heat circulation, material quality, and long-term durability.",
      quickRecommendation: null,
      topPicks: null,
      productIds: JSON.stringify(["philips-air-fryer-hd9252"]),
      buyingGuide: JSON.stringify([
        {
          title: "Unboxing & Initial Impression",
          content: "The Philips Essential features a sleek black gloss design with a durable metal basket interior. It is extremely compact, occupying very little space on a standard granite kitchen counter. The touch screen turns on instantly with clear blue icons."
        },
        {
          title: "How We Tested",
          content: "Our tester Sneha prepared 15 different dishes over 30 days. We measured cooking times, checked for raw spots, and tested the ease of washing the non-stick mesh basket."
        }
      ]),
      faqs: JSON.stringify([
        {
          question: "Is the basket dishwasher safe?",
          answer: "Yes, both the pull-out basket and the inner pan feature a non-stick coating and are fully dishwasher safe."
        }
      ]),
      verdict: "The Philips Essential HD9252/90 is the gold standard for cooking consistency. While it has a smaller capacity and a higher price tag than budget brands, its Rapid Air Starfish heating technology cooks faster, crisps better, and maintains a premium build that lasts for years.",
      rating: 4.6,
      seoTitle: "Philips Essential HD9252/90 Air Fryer In-Depth Review | BrandBTSS",
      seoDescription: "Is the Philips HD9252 air fryer worth the price? Read our chef-tested review evaluating cooking speeds, crispiness, capacity, and cleaning convenience."
    }
  ];

  for (const art of articlesData) {
    await prisma.article.create({ data: art });
  }
  console.log("Seeded Articles successfully.");
  console.log("Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
