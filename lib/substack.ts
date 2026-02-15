import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import type { BlogEntry } from "@/content/site-content";
import { transformRSSItemToBlogEntry, type SubstackRSSItem } from "./substack-utils";

const parser = new Parser<unknown, SubstackRSSItem>();

const SUBSTACK_USERNAME = process.env.NEXT_PUBLIC_SUBSTACK_USERNAME || "ivanxbt";

if (!SUBSTACK_USERNAME) {
  console.warn("NEXT_PUBLIC_SUBSTACK_USERNAME not set in environment variables");
}

const RSS_FEED_URL = `https://${SUBSTACK_USERNAME}.substack.com/feed`;

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
      .map((item, index) => transformRSSItemToBlogEntry(item as SubstackRSSItem, index));

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
