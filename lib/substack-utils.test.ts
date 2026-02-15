import { describe, it, expect } from "vitest";
import { transformRSSItemToBlogEntry, stripHtmlTags, formatDate } from "./substack-utils";

describe('substack-utils', () => {
  describe('stripHtmlTags', () => {
    it('should remove HTML tags', () => {
      expect(stripHtmlTags('<p>Hello <b>World</b></p>')).toBe('Hello World');
    });

    it('should trim whitespace', () => {
      expect(stripHtmlTags('   Hello World   ')).toBe('Hello World');
    });

    it('should handle nested tags', () => {
      expect(stripHtmlTags('<div><span>Text</span></div>')).toBe('Text');
    });
  });

  describe('formatDate', () => {
    it('should format valid date strings', () => {
      expect(formatDate('2024-03-20')).toBe('Mar 2024');
      expect(formatDate('2025-01-01T12:00:00Z')).toBe('Jan 2025');
    });

    it('should handle short dates', () => {
      expect(formatDate('2023-12')).toBe('Dec 2023');
    });
  });

  describe('transformRSSItemToBlogEntry', () => {
    it('should correctly transform a complete RSS item', () => {
      const mockItem = {
        title: 'Test Post',
        link: 'https://example.com/test',
        pubDate: '2024-03-20T12:00:00.000Z',
        contentSnippet: 'This is a test summary with <p>HTML</p> tags.',
        enclosure: {
          url: 'https://example.com/image.jpg',
        },
      };
      const index = 0;

      const result = transformRSSItemToBlogEntry(mockItem, index);

      expect(result).toEqual({
        id: 1,
        date: 'Mar 2024',
        title: 'Test Post',
        summary: 'This is a test summary with HTML tags.',
        url: 'https://example.com/test',
        image: 'https://example.com/image.jpg',
      });
    });

    it('should handle missing optional fields and use fallbacks', () => {
      const mockItem = {};
      const index = 5;

      const result = transformRSSItemToBlogEntry(mockItem, index);

      expect(result).toEqual({
        id: 6,
        date: 'Unknown',
        title: 'Untitled',
        summary: 'No summary available.',
        url: undefined,
        image: '/blog/default.svg',
      });
    });

    it('should fall back to content if contentSnippet is missing', () => {
      const mockItem = {
        content: 'Content text here',
      };

      const result = transformRSSItemToBlogEntry(mockItem, 0);

      expect(result.summary).toBe('Content text here');
    });

    it('should truncate summary to 200 characters', () => {
      const longSummary = 'A'.repeat(300);
      const mockItem = {
        contentSnippet: longSummary,
      };

      const result = transformRSSItemToBlogEntry(mockItem, 0);

      expect(result.summary.length).toBe(200);
      expect(result.summary).toBe('A'.repeat(200));
    });

    it('should use the provided index to generate the id (+1)', () => {
      expect(transformRSSItemToBlogEntry({}, 0).id).toBe(1);
      expect(transformRSSItemToBlogEntry({}, 99).id).toBe(100);
    });
  });
});
