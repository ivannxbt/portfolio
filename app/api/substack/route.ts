import { NextResponse } from "next/server";
import { getSubstackPosts } from "@/lib/substack";
import type { BlogEntry } from "@/content/site-content";
import fs from "fs/promises";
import path from "path";

export const revalidate = 3600;

interface SubstackCache {
  timestamp: number;
  ttl: number;
  posts: BlogEntry[];
}

const CACHE_FILE_PATH = path.join(process.cwd(), "data", "substack-cache.json");
const CACHE_TTL = 3600000;

async function readCache(): Promise<SubstackCache | null> {
  try {
    const fileContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const cache: SubstackCache = JSON.parse(fileContent);

    const now = Date.now();
    if (now - cache.timestamp < cache.ttl) {
      return cache;
    }

    return null;
  } catch {
    return null;
  }
}

async function writeCache(posts: BlogEntry[]): Promise<void> {
  try {
    const cache: SubstackCache = {
      timestamp: Date.now(),
      ttl: CACHE_TTL,
      posts,
    };

    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing Substack cache:", error);
  }
}

export async function GET() {
  try {
    const cachedData = await readCache();
    if (cachedData) {
      return NextResponse.json({ posts: cachedData.posts });
    }

    const posts = await getSubstackPosts();

    await writeCache(posts);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Substack API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Substack posts.", posts: [] },
      { status: 500 }
    );
  }
}
