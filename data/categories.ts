export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  featuredProducts: string[]; // Product IDs
  seoTitle: string;
  seoDescription: string;
}

export const categories: Category[] = [
  {
    slug: "hosting",
    name: "Web Hosting & Servers",
    description: "Speed, uptime, and server response time are crucial for affiliate conversions. We test and review managed WordPress hosting, shared plans, and cloud VPS for affiliate sites.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800",
    featuredProducts: ["hostinger-managed-wordpress", "bluehost-shared-hosting", "wpengine-managed-cloud"],
    seoTitle: "Best Web Hosting for Affiliate Marketing Websites | BrandBTSS",
    seoDescription: "Find the best hosting solutions for your affiliate blog or store. Independent response time metrics, uptime testing, and budget-friendly plan breakdowns."
  },
  {
    slug: "email-marketing",
    name: "Email Marketing & Automation",
    description: "Your email list is your most valuable asset. We evaluate and rate delivery success rates, landing page builders, automation builders, and user pricing on top email tools.",
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800",
    featuredProducts: ["convertkit-creator", "getresponse-email"],
    seoTitle: "Best Email Marketing Tools for Affiliates | BrandBTSS",
    seoDescription: "Compare the best email autoresponders, newsletter platforms, and funnel software. Maximize your affiliate click rates with expert software recommendations."
  },
  {
    slug: "seo-tools",
    name: "SEO & Keyword Research Tools",
    description: "Rank higher on Google and discover high-value keywords. We review search volumes databases, backlink crawlers, competitor auditing systems, and site audit utilities.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    featuredProducts: ["semrush-pro", "ahrefs-lite"],
    seoTitle: "Best SEO & Keyword Research Tools Reviewed | BrandBTSS",
    seoDescription: "Grow your organic traffic. In-depth comparisons and reviews of SEMrush, Ahrefs, and alternative keyword research software for niche affiliate sites."
  },
  {
    slug: "link-trackers",
    name: "Affiliate Link Trackers & Plugins",
    description: "Clean up long affiliate URLs and track your click analytics. We test WordPress link cloaking plugins and advanced SaaS tracker tools for conversion optimization.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    featuredProducts: ["pretty-links-pro", "thirstyaffiliates-plugin"],
    seoTitle: "Best Affiliate Link Cloaking & Tracking Tools | BrandBTSS",
    seoDescription: "Discover the best link tracking software and WordPress plugins. Manage your links, prevent commission theft, and track your referral traffic."
  }
];
