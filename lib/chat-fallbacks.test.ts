import { describe, it, expect } from 'vitest';
import { getFallbackResponse, fallbackChatProfile } from './chat-fallbacks';

describe('getFallbackResponse', () => {
  it('should return intro and availability when matching "who are you"', () => {
    const response = getFallbackResponse('who are you', 'en');
    expect(response).toContain(fallbackChatProfile.en.intro);
    expect(response).toContain(fallbackChatProfile.en.availability);
  });

  it('should return skills when matching "what are your skills"', () => {
    const response = getFallbackResponse('what are your skills', 'en');
    expect(response).toBe(fallbackChatProfile.en.skills);
  });

  it('should return experience when matching "tell me about your experience"', () => {
    const response = getFallbackResponse('tell me about your experience', 'en');
    expect(response).toBe(fallbackChatProfile.en.experience);
  });

  it('should return education when matching "where did you study"', () => {
    const response = getFallbackResponse('where did you study', 'en');
    expect(response).toBe(fallbackChatProfile.en.education);
  });

  it('should return location when matching "where are you based"', () => {
    const response = getFallbackResponse('where are you based', 'en');
    expect(response).toBe(fallbackChatProfile.en.location);
  });

  it('should return contact when matching "how can I contact you"', () => {
    const response = getFallbackResponse('how can I contact you', 'en');
    expect(response).toBe(fallbackChatProfile.en.contact);
  });

  it('should return availability when matching "are you available"', () => {
    const response = getFallbackResponse('are you available', 'en');
    expect(response).toBe(fallbackChatProfile.en.availability);
  });

  it('should return intro and availability when matching Spanish "quien eres"', () => {
    const response = getFallbackResponse('quien eres', 'es');
    expect(response).toContain(fallbackChatProfile.es.intro);
    expect(response).toContain(fallbackChatProfile.es.availability);
  });

  it('should return default message when no match is found', () => {
    const response = getFallbackResponse('something unrelated', 'en');
    expect(response).toContain(fallbackChatProfile.en.intro);
    expect(response).toContain(fallbackChatProfile.en.defaultMessage);
  });

  it('should fallback to English when an unsupported language is provided', () => {
    // @ts-expect-error - testing invalid language
    const response = getFallbackResponse('who are you', 'fr' as any);
    expect(response).toContain(fallbackChatProfile.en.intro);
    expect(response).toContain(fallbackChatProfile.en.availability);
  });

  it('should be case-insensitive', () => {
    const response = getFallbackResponse('WHO ARE YOU', 'en');
    expect(response).toContain(fallbackChatProfile.en.intro);
    expect(response).toContain(fallbackChatProfile.en.availability);
  });

  it('should match the first matching topic', () => {
    // "who" matches first topic, "skills" matches second.
    // getFallbackResponse uses find(), so it should return the first one.
    const response = getFallbackResponse('who are you and what are your skills', 'en');
    expect(response).toContain(fallbackChatProfile.en.intro);
    expect(response).toContain(fallbackChatProfile.en.availability);
    expect(response).not.toBe(fallbackChatProfile.en.skills);
  });
});
