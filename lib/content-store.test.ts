import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import os from "os";

const fsMocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

// Mock server-only to prevent it from throwing errors in tests
vi.mock("server-only", () => ({
  default: {},
}));

vi.mock("fs/promises", () => ({
  default: fsMocks,
  ...fsMocks,
}));
vi.mock("node:fs/promises", () => ({
  default: fsMocks,
  ...fsMocks,
}));

// Mock react cache
vi.mock("react", () => ({
  cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

// Mock the site-content module
vi.mock("@/content/site-content", () => ({
  defaultContent: {
    en: { hero: { headline: "Default English" } },
    es: { hero: { headline: "Default Spanish" } },
  },
}));

// Mock the i18n module
vi.mock("@/lib/i18n", () => ({
  locales: ["en", "es"],
}));

const loadContentStore = () => import("./content-store");

describe("content-store", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    fsMocks.mkdir.mockResolvedValue(undefined);
    fsMocks.readFile.mockResolvedValue("{}");
    fsMocks.writeFile.mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe("getOverridesPath", () => {
    it("should use default path when file is accessible", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue("{}");
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      await readOverrides();

      expect(fsMocks.mkdir).toHaveBeenCalledWith(
        expect.stringContaining("data"),
        { recursive: true },
      );
    });

    it("should fall back to temp directory on EROFS error", async () => {
      const erofError = new Error(
        "Read-only file system",
      ) as NodeJS.ErrnoException;
      erofError.code = "EROFS";

      let callCount = 0;
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw erofError;
        }
        return Promise.resolve("{}");
      });
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Primary overrides path is not writable"),
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(os.tmpdir()),
      );
    });

    it("should fall back to temp directory on EPERM error", async () => {
      const epermError = new Error(
        "Operation not permitted",
      ) as NodeJS.ErrnoException;
      epermError.code = "EPERM";

      let callCount = 0;
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw epermError;
        }
        return Promise.resolve("{}");
      });
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Primary overrides path is not writable"),
      );
    });

    it("should fall back to temp directory on EACCES error", async () => {
      const eaccesError = new Error(
        "Permission denied",
      ) as NodeJS.ErrnoException;
      eaccesError.code = "EACCES";

      let callCount = 0;
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw eaccesError;
        }
        return Promise.resolve("{}");
      });
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Primary overrides path is not writable"),
      );
    });

    it("should throw on unexpected errors", async () => {
      const unexpectedError = new Error("Unexpected error");

      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockRejectedValue(unexpectedError);

      const { readOverrides } = await loadContentStore();

      await expect(readOverrides()).rejects.toThrow("Unexpected error");
    });

    it("should handle race condition with multiple concurrent calls", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue("{}");
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      // Make multiple concurrent calls
      const promises = [readOverrides(), readOverrides(), readOverrides()];

      await Promise.all(promises);

      // mkdir should only be called once for the data directory
      // (not 3 times, which would indicate a race condition)
      const dataDirCalls = fsMocks.mkdir.mock.calls.filter(
        ([dirPath]) => typeof dirPath === "string" && dirPath.includes("data"),
      );
      expect(dataDirCalls.length).toBeLessThanOrEqual(1);
    });
  });

  describe("readOverrides", () => {
    it("should return empty object for empty file", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue("   ");
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      const result = await readOverrides();

      expect(result).toEqual({});
    });

    it("should parse valid JSON", async () => {
      const validOverrides = {
        en: { hero: { headline: "Custom English" } },
      };

      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue(JSON.stringify(validOverrides));
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      const result = await readOverrides();

      expect(result).toEqual(validOverrides);
    });

    it("should reset file and log warning on invalid JSON", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue("{ invalid json }");
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      const result = await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid overrides file detected"),
        expect.any(String),
      );
      expect(fsMocks.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        "{}",
        "utf-8",
      );
      expect(result).toEqual({});
    });

    it("should create file with empty object on ENOENT", async () => {
      const enoentError = new Error("File not found") as NodeJS.ErrnoException;
      enoentError.code = "ENOENT";

      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile
        .mockRejectedValueOnce(enoentError)
        .mockResolvedValue("{}");
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { readOverrides } = await loadContentStore();

      await readOverrides();

      expect(fsMocks.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        "{}",
        "utf-8",
      );
    });
  });

  describe("writeOverrides", () => {
    it("should write formatted JSON to file", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue("{}");
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { writeOverrides } = await loadContentStore();

      const overrides = {
        en: { hero: { headline: "Test" } },
      };

      await writeOverrides(overrides);

      expect(fsMocks.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(overrides, null, 2),
        "utf-8",
      );
    });

    it("should create directory before writing", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue("{}");
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { writeOverrides } = await loadContentStore();

      await writeOverrides({});

      expect(fsMocks.mkdir).toHaveBeenCalled();
    });
  });

  describe("deepMerge", () => {
    it("should merge objects deeply", async () => {
      const { deepMerge } = await loadContentStore();

      const target = { a: { b: 1, c: 2 } };
      const source = { a: { b: 3, d: 4 } };

      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { b: 3, c: 2, d: 4 } });
    });

    it("should replace arrays instead of merging", async () => {
      const { deepMerge } = await loadContentStore();

      const target = { arr: [1, 2, 3] };
      const source = { arr: [4, 5] };

      const result = deepMerge(target, source);

      expect(result).toEqual({ arr: [4, 5] });
    });

    it("should not merge non-plain objects", async () => {
      const { deepMerge } = await loadContentStore();

      const sourceDate = new Date("2024-01-01T00:00:00.000Z");
      const result = deepMerge(
        { value: { nested: true } },
        { value: sourceDate },
      );

      expect(result).toEqual({ value: sourceDate });
    });

    it("should skip denylisted keys and preserve global prototype safety", async () => {
      const { deepMerge } = await loadContentStore();

      const beforePolluted = (Object.prototype as { polluted?: boolean })
        .polluted;
      const source = JSON.parse('{"__proto__":{"polluted":true},"safe":1}');

      const result = deepMerge({}, source) as Record<string, unknown>;

      expect(result).toEqual({ safe: 1 });
      expect((Object.prototype as { polluted?: boolean }).polluted).toBe(
        beforePolluted,
      );
      expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
    });

    it("should block constructor.prototype pollution payloads", async () => {
      const { deepMerge } = await loadContentStore();

      const beforePolluted = (Object.prototype as { polluted?: boolean })
        .polluted;
      const source = JSON.parse(
        '{"constructor":{"prototype":{"polluted":true}},"safe":2}',
      );

      const result = deepMerge({}, source) as Record<string, unknown>;

      expect(result).toEqual({ safe: 2 });
      expect((Object.prototype as { polluted?: boolean }).polluted).toBe(
        beforePolluted,
      );
      expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
    });

    it("should throw error on deep circular references", async () => {
      const { deepMerge } = await loadContentStore();

      const target = {};
      const source: { a: Record<string, unknown> } = { a: {} };

      // Create a deeply nested structure that exceeds MAX_MERGE_DEPTH
      let current: Record<string, unknown> = source.a;
      for (let i = 0; i < 60; i++) {
        current.b = {};
        current = current.b as Record<string, unknown>;
      }

      expect(() => deepMerge(target, source)).toThrow("Maximum merge depth");
    });

    it("should handle undefined source", async () => {
      const { deepMerge } = await loadContentStore();

      const target = { a: 1 };

      const result = deepMerge(target, undefined);

      expect(result).toEqual({ a: 1 });
    });
  });

  describe("mergeWithDefaults", () => {
    it("should merge overrides with defaults", async () => {
      const { mergeWithDefaults } = await loadContentStore();

      const overrides = { hero: { headline: "Custom" } };

      const result = mergeWithDefaults("en", overrides);

      expect(result.hero.headline).toBe("Custom");
    });

    it("should use defaults when no overrides provided", async () => {
      const { mergeWithDefaults } = await loadContentStore();

      const result = mergeWithDefaults("en");

      expect(result.hero.headline).toBe("Default English");
    });
  });

  describe("getLandingContent", () => {
    it("should return merged content for locale", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue(
        JSON.stringify({
          en: { hero: { headline: "Override" } },
        }),
      );
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { getLandingContent } = await loadContentStore();

      const result = await getLandingContent("en");

      expect(result.hero.headline).toBe("Override");
    });
  });

  describe("getAllLandingContent", () => {
    it("should return content for all locales", async () => {
      fsMocks.mkdir.mockResolvedValue(undefined);
      fsMocks.readFile.mockResolvedValue(
        JSON.stringify({
          en: { hero: { headline: "English Override" } },
          es: { hero: { headline: "Spanish Override" } },
        }),
      );
      fsMocks.writeFile.mockResolvedValue(undefined);

      const { getAllLandingContent } = await loadContentStore();

      const result = await getAllLandingContent();

      expect(result.en.hero.headline).toBe("English Override");
      expect(result.es.hero.headline).toBe("Spanish Override");
    });
  });
});
