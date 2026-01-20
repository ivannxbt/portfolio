import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFile, writeFile, mkdir } from 'fs/promises';
import os from 'os';
import path from 'path';

// Mock server-only to prevent it from throwing errors in tests
vi.mock('server-only', () => ({
  default: {},
}));

// Mock the fs/promises module
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  },
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

// Mock react cache
vi.mock('react', () => ({
  cache: (fn: Function) => fn,
}));

// Mock the site-content module
vi.mock('@/content/site-content', () => ({
  defaultContent: {
    en: { hero: { headline: 'Default English' } },
    es: { hero: { headline: 'Default Spanish' } },
  },
}));

// Mock the i18n module
vi.mock('@/lib/i18n', () => ({
  locales: ['en', 'es'],
}));

describe('content-store', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Set default mock implementations
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(readFile).mockResolvedValue('{}');
    vi.mocked(writeFile).mockResolvedValue(undefined);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('getOverridesPath', () => {
    it('should use default path when file is accessible', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue('{}');
      vi.mocked(writeFile).mockResolvedValue(undefined);

      // Import fresh module
      const { readOverrides } = await import('./content-store');

      await readOverrides();

      expect(mkdir).toHaveBeenCalledWith(
        expect.stringContaining('data'),
        { recursive: true }
      );
    });

    it('should fall back to temp directory on EROFS error', async () => {
      const erofError = new Error('Read-only file system') as NodeJS.ErrnoException;
      erofError.code = 'EROFS';

      let callCount = 0;
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw erofError;
        }
        return Promise.resolve('{}');
      });
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Primary overrides path is not writable'),
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(os.tmpdir()),
      );
    });

    it('should fall back to temp directory on EPERM error', async () => {
      const epermError = new Error('Operation not permitted') as NodeJS.ErrnoException;
      epermError.code = 'EPERM';

      let callCount = 0;
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw epermError;
        }
        return Promise.resolve('{}');
      });
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Primary overrides path is not writable'),
      );
    });

    it('should fall back to temp directory on EACCES error', async () => {
      const eaccesError = new Error('Permission denied') as NodeJS.ErrnoException;
      eaccesError.code = 'EACCES';

      let callCount = 0;
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw eaccesError;
        }
        return Promise.resolve('{}');
      });
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Primary overrides path is not writable'),
      );
    });

    it('should throw on unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected error');

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockRejectedValue(unexpectedError);

      const { readOverrides } = await import('./content-store');

      await expect(readOverrides()).rejects.toThrow('Unexpected error');
    });

    it('should handle race condition with multiple concurrent calls', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue('{}');
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      // Make multiple concurrent calls
      const promises = [
        readOverrides(),
        readOverrides(),
        readOverrides(),
      ];

      await Promise.all(promises);

      // mkdir should only be called once for the data directory
      // (not 3 times, which would indicate a race condition)
      const dataDirCalls = vi.mocked(mkdir).mock.calls.filter(
        ([dirPath]) => typeof dirPath === 'string' && dirPath.includes('data')
      );
      expect(dataDirCalls.length).toBeLessThanOrEqual(1);
    });
  });

  describe('readOverrides', () => {
    it('should return empty object for empty file', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue('   ');
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      const result = await readOverrides();

      expect(result).toEqual({});
    });

    it('should parse valid JSON', async () => {
      const validOverrides = {
        en: { hero: { headline: 'Custom English' } },
      };

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify(validOverrides));
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      const result = await readOverrides();

      expect(result).toEqual(validOverrides);
    });

    it('should reset file and log warning on invalid JSON', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue('{ invalid json }');
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      const result = await readOverrides();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid overrides file detected'),
        expect.any(String)
      );
      expect(vi.mocked(writeFile)).toHaveBeenCalledWith(
        expect.any(String),
        '{}',
        'utf-8'
      );
      expect(result).toEqual({});
    });

    it('should create file with empty object on ENOENT', async () => {
      const enoentError = new Error('File not found') as NodeJS.ErrnoException;
      enoentError.code = 'ENOENT';

      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile)
        .mockRejectedValueOnce(enoentError)
        .mockResolvedValue('{}');
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { readOverrides } = await import('./content-store');

      await readOverrides();

      expect(vi.mocked(writeFile)).toHaveBeenCalledWith(
        expect.any(String),
        '{}',
        'utf-8'
      );
    });
  });

  describe('writeOverrides', () => {
    it('should write formatted JSON to file', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue('{}');
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { writeOverrides } = await import('./content-store');

      const overrides = {
        en: { hero: { headline: 'Test' } },
      };

      await writeOverrides(overrides);

      expect(vi.mocked(writeFile)).toHaveBeenCalledWith(
        expect.any(String),
        JSON.stringify(overrides, null, 2),
        'utf-8'
      );
    });

    it('should create directory before writing', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue('{}');
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { writeOverrides } = await import('./content-store');

      await writeOverrides({});

      expect(vi.mocked(mkdir)).toHaveBeenCalled();
    });
  });

  describe('deepMerge', () => {
    it('should merge objects deeply', async () => {
      const { deepMerge } = await import('./content-store');

      const target = { a: { b: 1, c: 2 } };
      const source = { a: { b: 3, d: 4 } };

      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { b: 3, c: 2, d: 4 } });
    });

    it('should replace arrays instead of merging', async () => {
      const { deepMerge } = await import('./content-store');

      const target = { arr: [1, 2, 3] };
      const source = { arr: [4, 5] };

      const result = deepMerge(target, source);

      expect(result).toEqual({ arr: [4, 5] });
    });

    it('should throw error on deep circular references', async () => {
      const { deepMerge } = await import('./content-store');

      const target = {};
      const source = { a: {} } as any;

      // Create a deeply nested structure that exceeds MAX_MERGE_DEPTH
      let current = source.a;
      for (let i = 0; i < 60; i++) {
        current.b = {};
        current = current.b;
      }

      expect(() => deepMerge(target, source)).toThrow('Maximum merge depth');
    });

    it('should handle undefined source', async () => {
      const { deepMerge } = await import('./content-store');

      const target = { a: 1 };

      const result = deepMerge(target, undefined);

      expect(result).toEqual({ a: 1 });
    });
  });

  describe('mergeWithDefaults', () => {
    it('should merge overrides with defaults', async () => {
      const { mergeWithDefaults } = await import('./content-store');

      const overrides = { hero: { headline: 'Custom' } };

      const result = mergeWithDefaults('en', overrides);

      expect(result.hero.headline).toBe('Custom');
    });

    it('should use defaults when no overrides provided', async () => {
      const { mergeWithDefaults } = await import('./content-store');

      const result = mergeWithDefaults('en');

      expect(result.hero.headline).toBe('Default English');
    });
  });

  describe('getLandingContent', () => {
    it('should return merged content for locale', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify({
        en: { hero: { headline: 'Override' } },
      }));
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { getLandingContent } = await import('./content-store');

      const result = await getLandingContent('en');

      expect(result.hero.headline).toBe('Override');
    });
  });

  describe('getAllLandingContent', () => {
    it('should return content for all locales', async () => {
      vi.mocked(mkdir).mockResolvedValue(undefined);
      vi.mocked(readFile).mockResolvedValue(JSON.stringify({
        en: { hero: { headline: 'English Override' } },
        es: { hero: { headline: 'Spanish Override' } },
      }));
      vi.mocked(writeFile).mockResolvedValue(undefined);

      const { getAllLandingContent } = await import('./content-store');

      const result = await getAllLandingContent();

      expect(result.en.hero.headline).toBe('English Override');
      expect(result.es.hero.headline).toBe('Spanish Override');
    });
  });
});
