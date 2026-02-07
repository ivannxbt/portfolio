'use client';

import { useEffect, useState, useRef } from "react";

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

type Theme = "dark" | "light" | "brutal";

interface GithubContributionsProps {
  username: string;
  theme: Theme;
  copy: GithubContributionsCopy;
}

// Cache TTL: 1 hour (in milliseconds)
const CACHE_TTL = 60 * 60 * 1000;

// SVG cell dimensions
const CELL_SIZE = 14;  // h-3.5 w-3.5 = 14px
const GAP = 4;         // gap-1 = 4px

// SVG colors (replacing Tailwind classes)
const SVG_COLORS: Record<Theme, Record<number, string>> = {
  dark: {
    0: "#1f1f1f",
    1: "rgba(20, 83, 45, 0.3)",   // teal-900/30
    2: "rgba(17, 94, 117, 0.6)",  // teal-800/60
    3: "rgba(13, 148, 136, 0.8)", // teal-600/80
    4: "#2dd4bf",                  // teal-400
  },
  light: {
    0: "#e5e5e5",    // neutral-200
    1: "#99f6e4",    // teal-200
    2: "#5eead4",    // teal-300
    3: "#2dd4bf",    // teal-400
    4: "#14b8a6",    // teal-500
  },
  brutal: {
    0: "#e5e5e5",    // neutral-200
    1: "#ffdd00",    // yellow accent
    2: "#fbbf24",    // amber-400
    3: "#f59e0b",    // amber-500
    4: "#000000",    // black
  },
};

export function GithubContributions({ username, theme, copy }: GithubContributionsProps) {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<Map<string, ContributionsResponse | null>>(new Map());
  const hasLoadedRef = useRef(false);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0.1,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Fetch data only when visible
  useEffect(() => {
    if (!isVisible || hasLoadedRef.current) return;

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
      hasLoadedRef.current = true;

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
  }, [username, isVisible]);

  // Calculate SVG dimensions
  const weeksCount = data?.weeks.length ?? 53;
  const daysCount = 7;
  const svgWidth = weeksCount * (CELL_SIZE + GAP) - GAP;
  const svgHeight = daysCount * (CELL_SIZE + GAP) - GAP;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden border ${
        theme === "brutal"
          ? "border-black border-[3px] bg-white"
          : theme === "dark"
            ? "rounded-3xl border-white/5 bg-[#0c0c0c]"
            : "rounded-3xl border-neutral-200 bg-white"
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
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto contrib-chart"
              style={{ minWidth: svgWidth }}
              role="img"
              aria-label={`${copy.heatmapLabel} - ${data.total} ${copy.commitsLabel}`}
            >
              <style>{`
                .contrib-chart {
                  opacity: 0;
                  animation: chart-fade-in 0.5s ease-out forwards;
                }
                .contrib-cell {
                  transition: transform 0.15s ease-out;
                  transform-origin: center;
                  transform-box: fill-box;
                }
                .contrib-cell:hover {
                  transform: scale(1.3);
                }
                @keyframes chart-fade-in {
                  to { opacity: 1; }
                }
              `}</style>
              {data.weeks.map((week, weekIndex) =>
                week.days.map((day, dayIndex) => (
                  <rect
                    key={day.date}
                    x={weekIndex * (CELL_SIZE + GAP)}
                    y={dayIndex * (CELL_SIZE + GAP)}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={2}
                    fill={SVG_COLORS[theme][day.level as keyof typeof SVG_COLORS["dark"]]}
                    className="contrib-cell"
                  >
                    <title>{`${day.date}: ${day.count} ${copy.tooltipSuffix}`}</title>
                  </rect>
                ))
              )}
            </svg>
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
