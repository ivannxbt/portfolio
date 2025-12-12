'use client';

import { useEffect, useState } from "react";

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionWeek = {
  days: ContributionDay[];
};

type ApiResponse = {
  total: number | Record<string, number>;
  contributions: Array<{ date: string; count: number; level: number }>;
};

type ContributionsResponse = {
  total: number;
  weeks: ContributionWeek[];
};

interface GithubContributionsProps {
  username: string;
  theme: "dark" | "light";
}

// Cache configuration
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CACHE_KEY_PREFIX = "github-contributions-";

type CachedData = {
  data: ContributionsResponse;
  timestamp: number;
};

// In-memory cache to avoid localStorage access on every render
const memoryCache = new Map<string, CachedData>();

// Cleanup old cache entries periodically
function cleanupExpiredCache(): void {
  const now = Date.now();
  for (const [key, cached] of memoryCache.entries()) {
    if (now - cached.timestamp >= CACHE_TTL_MS) {
      memoryCache.delete(key);
    }
  }
}

function getCacheKey(username: string, year: number): string {
  return `${CACHE_KEY_PREFIX}${username}-${year}`;
}

function getCachedData(username: string, year: number): ContributionsResponse | null {
  const cacheKey = getCacheKey(username, year);
  
  // Cleanup expired entries periodically
  if (Math.random() < 0.1) { // 10% chance on each call
    cleanupExpiredCache();
  }
  
  // Check in-memory cache first
  const memCached = memoryCache.get(cacheKey);
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL_MS) {
    return memCached.data;
  }
  
  // Check localStorage
  try {
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
      const cached: CachedData = JSON.parse(stored);
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        // Update memory cache
        memoryCache.set(cacheKey, cached);
        return cached.data;
      }
    }
  } catch (err) {
    console.warn("Failed to read from cache:", err);
  }
  
  return null;
}

function setCachedData(username: string, year: number, data: ContributionsResponse): void {
  const cacheKey = getCacheKey(username, year);
  const cached: CachedData = {
    data,
    timestamp: Date.now(),
  };
  
  // Update memory cache
  memoryCache.set(cacheKey, cached);
  
  // Update localStorage
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch (err) {
    console.warn("Failed to write to cache:", err);
  }
}

const LEVEL_COLORS: Record<"dark" | "light", Record<number, string>> = {
  dark: {
    0: "bg-[#1f1f1f]",
    1: "bg-teal-900/30",
    2: "bg-teal-800/60",
    3: "bg-teal-600/80",
    4: "bg-teal-400",
  },
  light: {
    0: "bg-neutral-200",
    1: "bg-teal-200",
    2: "bg-teal-300",
    3: "bg-teal-400",
    4: "bg-teal-500",
  },
};

export function GithubContributions({ username, theme }: GithubContributionsProps) {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const year = new Date().getFullYear();

    const load = async () => {
      // Check cache first
      const cached = getCachedData(username, year);
      if (cached) {
        if (!cancelled) {
          setData(cached);
        }
        return;
      }

      // Fetch from API if cache miss
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
        );
        if (!response.ok) throw new Error("Failed to fetch contributions");
        const payload = (await response.json()) as ApiResponse;
        const totalRaw = payload.total;
        const total =
          typeof totalRaw === "number"
            ? totalRaw
            : Number(Object.values(totalRaw ?? {})[0] ?? 0);
        const contributions = payload.contributions ?? [];
        const weeks: ContributionWeek[] = [];
        for (let i = 0; i < contributions.length; i += 7) {
          weeks.push({ days: contributions.slice(i, i + 7) });
        }
        const result = { total, weeks };
        
        if (!cancelled) {
          setData(result);
          setCachedData(username, year, result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("GitHub contribution fetch failed:", err);
          setError("Unable to load latest contributions.");
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return (
    <div
      className={`overflow-hidden rounded-3xl border ${
        theme === "dark"
          ? "border-white/5 bg-[#0c0c0c]"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div
        className={`flex flex-col gap-2 border-b px-6 py-4 ${
          theme === "dark"
            ? "border-white/5 text-neutral-200"
            : "border-neutral-100 text-neutral-800"
        }`}
      >
        <p className="text-sm uppercase tracking-[0.3em] text-teal-400">GitHub</p>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-semibold">Contribution heatmap</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              theme === "dark"
                ? "bg-white/5 text-neutral-300"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {username}
          </span>
        </div>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-neutral-400" : "text-neutral-500"
          }`}
        >
          {data ? (
            <>
              <strong className="text-teal-400">{data.total}</strong> commits this year
            </>
          ) : error ? (
            error
          ) : (
            "Fetching your activity?"
          )}
        </p>
      </div>

      <div className="overflow-x-auto px-6 py-4">
        {data && data.weeks.length > 0 ? (
          <div className="flex gap-1">
            {data.weeks.map((week) => (
              <div key={week.days[0]?.date} className="flex flex-col gap-1">
                {week.days.map((day) => (
                  <span
                    key={day.date}
                    className={`h-3.5 w-3.5 rounded-sm transition-colors ${
                      LEVEL_COLORS[theme][day.level as keyof typeof LEVEL_COLORS["dark"]]
                    }`}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`h-32 rounded-2xl ${
              theme === "dark" ? "bg-white/5" : "bg-neutral-100"
            } animate-pulse`}
          />
        )}
      </div>
    </div>
  );
}
