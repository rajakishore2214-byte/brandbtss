export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string; // 'hosting' | 'email-marketing' | 'seo-tools' | 'link-trackers'
  price: number; // in INR or equivalent monthly
  originalPrice?: number; // for deals
  rating: number;
  image: string;
  affiliateUrl: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  specs: {
    [key: string]: string;
  };
  dealTag?: string; // e.g. "Save 30%", "Best Value"
}

export const products: Product[] = [
  {
    id: "hostinger-managed-wordpress",
    name: "Hostinger Business WordPress",
    brand: "Hostinger",
    category: "hosting",
    price: 269, // monthly price in INR
    originalPrice: 599,
    rating: 4.7,
    image: "/images/web_hosting.png",
    affiliateUrl: "https://hostinger.in/brandbtss",
    description: "Highly optimized Managed WordPress hosting offering top-tier loading speeds, LiteSpeed cache engine, free domain name, and robust NVMe storage.",
    features: [
      "LiteSpeed Cache & object cache for sub-second page loads",
      "Free domain registration, SSL certificates, and professional email",
      "Automatic daily backups and easy 1-click staging tools",
      "Robust NVMe storage limits up to 200 GB"
    ],
    pros: [
      "Incredibly budget-friendly hosting plans for new affiliate sites",
      "Superb speed and TTFB (Time to First Byte) via LiteSpeed servers",
      "24/7 fast customer support via chat and ticket console"
    ],
    cons: [
      "Renewal prices increase significantly after initial term",
      "No phone-based support options available"
    ],
    specs: {
      "Storage": "200 GB NVMe Storage",
      "Bandwidth": "Unlimited Bandwidth",
      "Free Domain": "Yes (First Year)",
      "SSL Certificate": "Free & Unlimited",
      "Backup": "Daily Automatic Backups"
    },
    dealTag: "Save 55%"
  },
  {
    id: "bluehost-shared-hosting",
    name: "Bluehost Choice Plus Plan",
    brand: "Bluehost",
    category: "hosting",
    price: 399,
    originalPrice: 899,
    rating: 4.4,
    image: "/images/web_hosting.png",
    affiliateUrl: "https://bluehost.com/brandbtss",
    description: "The industry standard shared hosting plan officially recommended by WordPress.org, featuring built-in CDN, staging, and domain privacy.",
    features: [
      "Free Cloudflare CDN integration for global content delivery",
      "Built-in staging environment to test design adjustments safely",
      "Domain privacy protection and automated malware scanning",
      "Recommended officially by WordPress core team"
    ],
    pros: [
      "1-click installation with intuitive dashboard guidelines",
      "Free domain name and privacy settings included in first year",
      "Uptime consistency is highly reliable (99.98% benchmarked)"
    ],
    cons: [
      "In-house speed tools are basic compared to LiteSpeed",
      "Upsells during the checkout flow can be annoying"
    ],
    specs: {
      "Storage": "40 GB SSD Storage",
      "Bandwidth": "Unmetered Bandwidth",
      "Free Domain": "Yes (with privacy shield)",
      "SSL Certificate": "Free Let's Encrypt",
      "Backup": "Daily Backups (First Year)"
    },
    dealTag: "55% Off Choice Plus"
  },
  {
    id: "wpengine-managed-cloud",
    name: "WP Engine Startup Managed Cloud",
    brand: "WP Engine",
    category: "hosting",
    price: 2450,
    originalPrice: 3000,
    rating: 4.8,
    image: "/images/web_hosting.png",
    affiliateUrl: "https://wpengine.com/brandbtss",
    description: "Premium managed hosting designed specifically for heavy-traffic affiliate sites, utilizing Google Cloud infrastructure and advanced security layers.",
    features: [
      "Google Cloud Platform nodes with custom server architecture",
      "EverCache proprietary caching solution engineered for WordPress",
      "Free automated migration plugin with live status tracker",
      "Built-in EverClean security monitoring and automated patching"
    ],
    pros: [
      "Incredible page load performance handles traffic spikes easily",
      "Staging and development environments are highly integrated",
      "Expert-level WordPress developer support available 24/7"
    ],
    cons: [
      "Premium pricing is high for beginners",
      "Does not include free email accounts or domains"
    ],
    specs: {
      "Storage": "10 GB Local Storage",
      "Bandwidth": "50 GB Bandwidth (25K visits)",
      "Free Domain": "No",
      "SSL Certificate": "Free Automated SSL",
      "Backup": "Daily Manual & Auto Backups"
    },
    dealTag: "Save 18%"
  },
  {
    id: "convertkit-creator",
    name: "Kit (formerly ConvertKit) Creator Plan",
    brand: "Kit",
    category: "email-marketing",
    price: 2350, // approx monthly conversion in INR for standard plan
    originalPrice: 2900,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=600",
    affiliateUrl: "https://convertkit.com/brandbtss",
    description: "The gold standard for creators and affiliate marketers. Features visual automation builders, subscriber tagging, and high email deliverability.",
    features: [
      "Visual automation funnel builders for targeted sequences",
      "Infinite landing page templates and customizable form elements",
      "Precise subscriber segmentation using tag categories",
      "Highly optimized SMTP relay yielding 99.7% delivery rates"
    ],
    pros: [
      "Tag-based system is much cleaner than list-based platforms",
      "Incredible deliverability ensures emails land in the primary inbox",
      "Extensive integrations with checkout, WooCommerce, and CRM tools"
    ],
    cons: [
      "Email visual designer is strictly text-based and basic",
      "Steeper pricing curve as your subscriber base scales"
    ],
    specs: {
      "Subscribers Limit": "Up to 1,000 Subscribers",
      "Automations": "Unlimited funnels & sequences",
      "Sending Limit": "Unlimited Emails",
      "Support": "Live Chat & Email Support",
      "Integrations": "Over 100+ platforms supported"
    },
    dealTag: "Free Trial Available"
  },
  {
    id: "getresponse-email",
    name: "GetResponse Email Marketing",
    brand: "GetResponse",
    category: "email-marketing",
    price: 1550,
    originalPrice: 1950,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    affiliateUrl: "https://getresponse.com/brandbtss",
    description: "An all-in-one marketing platform offering landing pages, webinar hosting, AI email generators, and autoresponder setups.",
    features: [
      "Autoresponder systems for scheduled email sequences",
      "AI-powered campaign creator and content suggestion writer",
      "Built-in webinar funnels and conversion popups",
      "Drag-and-drop template editor with thousands of assets"
    ],
    pros: [
      "Highly affordable entry plans for builders on a budget",
      "Built-in tools like landing page creators are feature-rich",
      "Webinar hosting is built directly into email funnel dashboard"
    ],
    cons: [
      "Automation logic interface can feel slow and outdated",
      "Deliverability is slightly lower than dedicated SMTP relays"
    ],
    specs: {
      "Subscribers Limit": "Up to 1,000 Subscribers",
      "Automations": "Basic sequences & workflows",
      "Sending Limit": "Unlimited Emails",
      "Support": "24/7 Live Chat Support",
      "Integrations": "Over 150+ software products"
    },
    dealTag: "Save 20% Annual"
  },
  {
    id: "semrush-pro",
    name: "Semrush Pro Plan",
    brand: "Semrush",
    category: "seo-tools",
    price: 9999, // monthly price in INR (approx value)
    originalPrice: 11999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    affiliateUrl: "https://semrush.com/brandbtss",
    description: "The ultimate marketing toolkit. Semrush Pro provides deep competitor analysis, keyword research, rank tracking, and site audit features.",
    features: [
      "Keyword Magic Tool with billions of search intent points",
      "Competitor organic research reveals keywords driving traffic",
      "Automated site audit checks on 140+ ranking issues",
      "Backlink analytics tracking domain authority scores"
    ],
    pros: [
      "Deepest keyword and intent data database on the market",
      "Competitor gap analysis lets you target easy opportunities",
      "Accurate localized ranking trackers with daily updates"
    ],
    cons: [
      "User interface is complex with a steep learning curve",
      "Expensive pricing point represents a major investment"
    ],
    specs: {
      "Projects Limit": "Track up to 5 sites",
      "Keywords to Track": "500 Keywords tracked daily",
      "Reports Per Day": "3,000 keyword searches daily",
      "SEO Audit Pages": "100,000 pages crawlable monthly",
      "Historical Data": "Available as a separate add-on"
    },
    dealTag: "7-Day Free Trial"
  },
  {
    id: "ahrefs-lite",
    name: "Ahrefs Lite Plan",
    brand: "Ahrefs",
    category: "seo-tools",
    price: 8200,
    originalPrice: 9900,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=600",
    affiliateUrl: "https://ahrefs.com/brandbtss",
    description: "Industry-leading backlink analysis index and keyword researcher, featuring the Site Explorer, Keywords Explorer, and Rank Tracker dashboard.",
    features: [
      "Site Explorer crawls live backlink profiles in real-time",
      "Keywords Explorer provides search volume models for 10 engines",
      "Site Audit crawling analyzes basic technical performance metrics",
      "Rank Tracker maps desktop and mobile ranking trends"
    ],
    pros: [
      "Most comprehensive and accurate link graph/backlink crawler",
      "Clean UI makes finding organic keyword opportunities easy",
      "Keyword difficulty (KD) calculation is highly accurate"
    ],
    cons: [
      "No longer offers a free trial for evaluation",
      "Credit-based system limits searches and dashboard queries"
    ],
    specs: {
      "Projects Limit": "Unlimited verified domains",
      "Keywords to Track": "750 Keywords updated weekly",
      "Reports Per Day": "Credit consumption metrics",
      "SEO Audit Pages": "10,000 crawl credits monthly",
      "Historical Data": "Included in standard plans"
    },
    dealTag: "Save 15% Yearly"
  },
  {
    id: "pretty-links-pro",
    name: "Pretty Links Pro (Beginner Plan)",
    brand: "Pretty Links",
    category: "link-trackers",
    price: 7999, // yearly price in INR
    originalPrice: 11999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    affiliateUrl: "https://prettylinks.com/brandbtss",
    description: "The premier WordPress plugin for link cloaking, management, and redirect automation, allowing affiliates to create clean, branded links.",
    features: [
      "Clean 301, 302, and 307 redirects using your domain brand",
      "Keyword replacement engine links keywords in posts automatically",
      "Dynamic tracking redirects based on geographical tags",
      "Detailed click report dashboards within the WordPress admin"
    ],
    pros: [
      "Extremely easy link cloaking keeps URLs short and clean",
      "Automatic keyword linking speeds up affiliate site management",
      "Prevents link hijacking and commission theft by hiding URLs"
    ],
    cons: [
      "Only operates inside WordPress sites (no standalone SaaS option)",
      "Database tables can bloat if tracking millions of redirect clicks"
    ],
    specs: {
      "Sites Allowed": "Use on 1 WordPress Site",
      "Redirect Types": "301, 302, 307 redirects",
      "Link Categories": "Unlimited categories & tags",
      "Support": "1 Year Premium Developer Support",
      "Automation": "Auto-create links & keyword mapping"
    },
    dealTag: "Save ₹4,000"
  },
  {
    id: "thirstyaffiliates-plugin",
    name: "ThirstyAffiliates Pro (One Site)",
    brand: "ThirstyAffiliates",
    category: "link-trackers",
    price: 5999,
    originalPrice: 8999,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=600",
    affiliateUrl: "https://thirstyaffiliates.com/brandbtss",
    description: "An advanced link management utility for WordPress, offering geo-location links, Amazon API importing, and automatic link insertion.",
    features: [
      "Automatic Amazon Product Advertising API importer Integration",
      "Geo-location links redirect traffic by visitor country",
      "Uncloaking option specifically for Amazon Associates guidelines",
      "Built-in Google Analytics click event injection script"
    ],
    pros: [
      "compliance-friendly features for Amazon Associates guidelines",
      "Import products directly from Amazon API inside editor console",
      "Fast database queries won't slow down server load times"
    ],
    cons: [
      "Keyword linking script can cause high CPU load on shared hosts",
      "Geo-redirecting can occasionally fail with proxy servers"
    ],
    specs: {
      "Sites Allowed": "Use on 1 WordPress Site",
      "Redirect Types": "301, 302, 307 redirects",
      "Link Categories": "Unlimited links & images",
      "Support": "1 Year Email Support",
      "Automation": "Amazon import & auto link insertion"
    },
    dealTag: "Save ₹3,000"
  }
];
