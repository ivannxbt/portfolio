import type { BlogEntry } from "@/content/site-content";

export interface SubstackRSSItem {
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

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function formatDate(dateString: string): string {
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
