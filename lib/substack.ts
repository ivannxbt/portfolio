import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import type { BlogEntry } from "@/content/site-content";
import { publicEnv } from "@/lib/env/public";

interface SubstackRSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  enclosure?: {
    url: string;
    type?: string;
  };
}

const parser = new Parser<unknown, SubstackRSSItem>();

const SUBSTACK_USERNAME = publicEnv.substackUsername;

if (!SUBSTACK_USERNAME) {
  console.warn("NEXT_PUBLIC_SUBSTACK_USERNAME not set in environment variables");
}

const RSS_FEED_URL = `https://${SUBSTACK_USERNAME}.substack.com/feed`;

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function transformRSSItemToBlogEntry(
  item: SubstackRSSItem,
  index: number
): BlogEntry {
  const summary = item.contentSnippet || item.content || "";
  const cleanSummary = stripHtmlTags(summary).slice(0, 200);

  return {
    id: index + 1,
    date: item.pubDate ? formatDate(item.pubDate) : "Unknown",
    title: item.title || "Untitled",
    summary: cleanSummary || "No summary available.",
    url: item.link,
    image: item.enclosure?.url || "/blog/default.svg",
  };
}

const fetchSubstackPosts = async (limit?: number): Promise<BlogEntry[]> => {
  if (!SUBSTACK_USERNAME) {
    console.error("Cannot fetch Substack posts: NEXT_PUBLIC_SUBSTACK_USERNAME is not set");
    return [];
  }

  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    const items = feed.items || [];

    const posts = items
      .slice(0, limit)
      .map((item, index) => transformRSSItemToBlogEntry(item, index));

    return posts;
  } catch (error) {
    console.error("Error fetching Substack RSS feed:", error);
    return [];
  }
};

export const getSubstackPosts = unstable_cache(
  fetchSubstackPosts,
  ["substack-posts"],
  { revalidate: 3600 }
);
