'use client';

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

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

type ContributionsCacheEntry = {
  data: ContributionsResponse;
  timestamp: number;
};

type GithubContributionsCopy = {
  heatmapLabel: string;
  commitsLabel: string;
  loadingText: string;
  errorText: string;
  tooltipSuffix: string;
};

interface GithubContributionsProps {
  username: string;
  theme: "dark" | "light";
  copy: GithubContributionsCopy;
}

// Cache TTL: 1 hour (in milliseconds)
const CACHE_TTL = 60 * 60 * 1000;

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

export function GithubContributions({ username, theme, copy }: GithubContributionsProps) {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const cacheRef = useRef<Map<string, ContributionsResponse | null>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const year = new Date().getFullYear();
    const cacheKey = `github-contributions-${username}-${year}`;

    const getCachedData = (): ContributionsResponse | null => {
      // Check in-memory cache first
      if (cacheRef.current.has(cacheKey)) {
        return cacheRef.current.get(cacheKey) ?? null;
      }

      try {
        const cached = localStorage.getItem(cacheKey);
        if (!cached) {
          cacheRef.current.set(cacheKey, null);
          return null;
        }

        const parsed = JSON.parse(cached);

        // Validate the structure of cached data
        if (!parsed || typeof parsed !== 'object' ||
            !parsed.data || !parsed.timestamp ||
            typeof parsed.timestamp !== 'number') {
          localStorage.removeItem(cacheKey);
          cacheRef.current.set(cacheKey, null);
          return null;
        }

        const { data, timestamp }: ContributionsCacheEntry = parsed;
        const now = Date.now();

        // Check if cache is still valid (within TTL)
        if (now - timestamp < CACHE_TTL) {
          cacheRef.current.set(cacheKey, data);
          return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(cacheKey);
        cacheRef.current.set(cacheKey, null);
        return null;
      } catch (err) {
        console.error("Error reading cache:", err);
        // Clean up corrupted cache
        try {
          localStorage.removeItem(cacheKey);
        } catch {
          // Ignore cleanup errors
        }
        cacheRef.current.set(cacheKey, null);
        return null;
      }
    };

    const setCachedData = (contributionsData: ContributionsResponse) => {
      // Update in-memory cache immediately
      cacheRef.current.set(cacheKey, contributionsData);

      const cacheData: ContributionsCacheEntry = {
        data: contributionsData,
        timestamp: Date.now(),
      };
      const cacheString = JSON.stringify(cacheData);

      try {
        localStorage.setItem(cacheKey, cacheString);
      } catch (err) {
        // Handle quota exceeded or other storage errors
        if (err instanceof Error && err.name === 'QuotaExceededError') {
          console.warn("localStorage quota exceeded, clearing old cache");
          try {
            // Clear all github-contributions caches to make room
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('github-contributions-')) {
                localStorage.removeItem(key);
              }
            });
            // Clear in-memory cache too
            cacheRef.current.clear();
            // Retry saving
            localStorage.setItem(cacheKey, cacheString);
            cacheRef.current.set(cacheKey, contributionsData);
          } catch {
            console.error("Failed to cache even after cleanup");
          }
        } else {
          console.error("Error writing to cache:", err);
        }
      }
    };

    const load = async () => {
      setHasError(false);
      // Check cache first
      const cachedData = getCachedData();
      if (cachedData && !cancelled) {
        setData(cachedData);
        return;
      }

      // Fetch fresh data if no valid cache
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
          { cache: "default" }
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
        
        const contributionsData = { total, weeks };
        
        if (!cancelled) {
          setData(contributionsData);
          setCachedData(contributionsData);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("GitHub contribution fetch failed:", err);
          setHasError(true);
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
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-semibold">{copy.heatmapLabel}</h3>
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
              <strong className="text-teal-400">{data.total}</strong> {copy.commitsLabel}
            </>
          ) : hasError ? (
            copy.errorText
          ) : (
            copy.loadingText
          )}
        </p>
      </div>

      <div className="overflow-x-auto py-4">
        <div className="px-6">
          {data && data.weeks.length > 0 ? (
            <motion.div
              className="flex gap-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.01,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {data.weeks.map((week, weekIndex) => (
                <motion.div
                  key={week.days[0]?.date}
                  className="flex flex-col gap-1 flex-shrink-0"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  {week.days.map((day, dayIndex) => (
                    <motion.span
                      key={day.date}
                      className={`h-3.5 w-3.5 rounded-sm transition-colors flex-shrink-0 ${
                        LEVEL_COLORS[theme][day.level as keyof typeof LEVEL_COLORS["dark"]]
                      }`}
                      title={`${day.date}: ${day.count} ${copy.tooltipSuffix}`}
                      whileHover={!prefersReducedMotion ? {
                        scale: 1.4,
                        transition: { type: "spring", stiffness: 400, damping: 30 }
                      } : {}}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                          delay: (weekIndex * 7 + dayIndex) * 0.005,
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        },
                      }}
                    />
                  ))}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div
              className={`h-32 rounded-2xl ${
                theme === "dark" ? "bg-white/5" : "bg-neutral-100"
              } animate-pulse`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
