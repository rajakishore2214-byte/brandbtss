import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { format } from "date-fns";
import { Calendar, UserCheck, ShieldAlert } from "lucide-react";

import { getPostBySlug, getAllPostsSlugs } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import VerdictBox from "@/components/VerdictBox";
import SchemaMarkup from "@/components/SchemaMarkup";

// Force static building with Incremental Static Regeneration (1 hour)
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    postType: string;
    slug: string;
  }>;
}

// Pre-render pages at build time
export async function generateStaticParams() {
  const posts = await getAllPostsSlugs();
  return posts.map((post) => ({
    postType: post.postType,
    slug: post.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | BrandBTSS",
      description: "The requested article could not be found.",
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const mainImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : null;

  return {
    title: `${title} | BrandBTSS`,
    description: description.slice(0, 160),
    alternates: {
      canonical: `https://brandbtss.com/${post.postType}/${post.slug}`,
    },
    openGraph: {
      title: `${title} | BrandBTSS`,
      description: description.slice(0, 160),
      url: `https://brandbtss.com/${post.postType}/${post.slug}`,
      type: "article",
      images: mainImageUrl ? [{ url: mainImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | BrandBTSS`,
      description: description.slice(0, 160),
      images: mainImageUrl ? [mainImageUrl] : undefined,
    },
  };
}

// Factory builder for Portable Text blocks, injecting the post slug as GTM/UTM campaign
const createPortableTextComponents = (postSlug: string): PortableTextComponents => ({
  types: {
    productCard: ({ value }) => (
      <div className="my-8">
        <ProductCard product={value} campaign={postSlug} placement="body-inline" />
      </div>
    ),
    comparisonTable: ({ value }) => (
      <div className="my-8">
        <ComparisonTable table={value} campaign={postSlug} />
      </div>
    ),
    verdictBox: ({ value }) => (
      <div className="my-8">
        <VerdictBox
          winnerName={value.winnerName}
          summary={value.summary}
          affiliateSlug={value.affiliateSlug}
          campaign={postSlug}
        />
      </div>
    ),
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(800).url();
      return (
        <figure className="relative my-8 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-2">
          <Image
            src={imageUrl}
            alt={value.alt || "Article illustration image"}
            width={800}
            height={500}
            className="w-full h-auto rounded-2xl object-cover select-none"
            priority={false}
          />
          {value.caption && (
            <figcaption className="text-center text-xs text-slate-400 mt-3 font-medium">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-10 mb-4 tracking-tight leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-bold text-slate-900 mt-6 mb-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-slate-700 leading-relaxed my-5 text-base sm:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-600 pl-5 py-2 my-6 italic text-slate-600 bg-indigo-50/50 rounded-r-2xl text-base sm:text-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2.5 my-5 text-slate-700 pl-5 text-base sm:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2.5 my-5 text-slate-700 pl-5 text-base sm:text-lg">
        {children}
      </ol>
    ),
  },
});

export default async function PostPage({ params }: PageProps) {
  const { postType, slug } = await params;
  const post = await getPostBySlug(slug);

  // Validate slug exists and path matches the correct post type
  if (!post || post.postType !== postType) {
    notFound();
  }

  const mainImageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(675).url() : null;
  const authorImageUrl = post.author?.photo ? urlFor(post.author.photo).width(80).height(80).url() : null;

  const publishedDate = new Date(post.publishedAt);
  const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null;

  const portableTextComponents = createPortableTextComponents(post.slug);

  return (
    <>
      {/* Dynamic Schema Injection */}
      <SchemaMarkup type={post.postType} post={post} />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        
        {/* Breadcrumb path */}
        <nav className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <a href="/" className="hover:text-indigo-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-500">{post.postType === "roundup" ? "Roundups" : "Reviews"}</span>
        </nav>

        {/* Title & Metadata */}
        <div className="space-y-6">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-y border-slate-100 py-4 text-sm text-slate-500">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {authorImageUrl ? (
                    <Image
                      src={authorImageUrl}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-black text-indigo-400">{post.author.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Written By</span>
                  <span className="font-semibold text-slate-800">{post.author.name}</span>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">
                  {updatedDate ? "Last Updated" : "Published On"}
                </span>
                <span className="font-semibold text-slate-700">
                  {format(updatedDate || publishedDate, "MMMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {mainImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 select-none shadow-sm">
            <Image
              src={mainImageUrl}
              alt={`${post.title} cover image`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Affiliate Disclosure callout */}
        <div className="rounded-2xl border border-amber-200 bg-amber-500/5 p-4 text-xs text-slate-600 flex gap-2.5 items-start">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Affiliate Disclosure:</strong> This review is supported by readers. We test products and write honest reviews based on independent testing. We earn affiliate commissions when you purchase via the outbound redirect links on this page. Learn more in our Footer policies.
          </p>
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none prose-indigo">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>

        {/* Author Bio/Credentials E-E-A-T Info Box */}
        {post.author && (post.author.bio || post.author.credentials) && (
          <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <UserCheck className="h-5 w-5" />
              <span>Editorial E-E-A-T Credibility</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-black text-indigo-400 text-xl">{post.author.name.charAt(0)}</span>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display font-bold text-slate-900 text-base">
                  About the Author: {post.author.name}
                </h4>
                {post.author.bio && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {post.author.bio}
                  </p>
                )}
                {post.author.credentials && (
                  <p className="text-[11px] sm:text-xs text-indigo-600/80 font-semibold leading-relaxed border-t border-slate-200/60 pt-2">
                    Credentials: {post.author.credentials}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </article>
    </>
  );
}
