import { describe, it, expect } from 'vitest';
import { getFallbackResponse, fallbackTopicMatchers, fallbackChatProfile } from './chat-fallbacks';
import type { Language } from './types';

describe('getFallbackResponse', () => {
  it('should return the correct answer for all items in fallbackTopicMatchers for both locales', () => {
    const locales: Language[] = ['en', 'es'];

    locales.forEach((lang) => {
      const profile = fallbackChatProfile[lang];

      fallbackTopicMatchers.forEach((matcher) => {
        // Use the first keyword for testing
        const keyword = matcher.keywords[0];
        const response = getFallbackResponse(`Tell me about ${keyword}`, lang);

        expect(response).toBe(matcher.getAnswer(profile));
      });
    });
  });

  it('should work with different keywords from the same matcher', () => {
    // Testing experience matcher with different keywords
    expect(getFallbackResponse('work', 'en')).toBe(fallbackChatProfile.en.experience);
    expect(getFallbackResponse('project', 'en')).toBe(fallbackChatProfile.en.experience);
    expect(getFallbackResponse('proyecto', 'es')).toBe(fallbackChatProfile.es.experience);
  });

  it('should work with location keywords', () => {
    expect(getFallbackResponse('city', 'en')).toBe(fallbackChatProfile.en.location);
    expect(getFallbackResponse('ubicación', 'es')).toBe(fallbackChatProfile.es.location);
  });

  it('should be case insensitive', () => {
    expect(getFallbackResponse('SKILLS', 'en')).toBe(fallbackChatProfile.en.skills);
    expect(getFallbackResponse('Quien', 'es')).toBe(`${fallbackChatProfile.es.intro} ${fallbackChatProfile.es.availability}`);
  });

  it('should return default response when no keywords match', () => {
    const profile = fallbackChatProfile.en;
    const expected = `${profile.intro} ${profile.defaultMessage}`;
    expect(getFallbackResponse('something completely unrelated', 'en')).toBe(expected);
  });

  it('should default to English profile if an unsupported language is provided', () => {
    // We cast to any to test the runtime fallback
    const response = getFallbackResponse('skills', 'fr' as any);
    expect(response).toBe(fallbackChatProfile.en.skills);
  });

  it('should return default English response when no keywords match and language is unsupported', () => {
    const profile = fallbackChatProfile.en;
    const expected = `${profile.intro} ${profile.defaultMessage}`;
    const response = getFallbackResponse('unrelated', 'fr' as any);
    expect(response).toBe(expected);
  });
});
