import { describe, it, expect } from 'vitest';
import esMessages from '../../../messages/es.json' with { type: 'json' };
import enMessages from '../../../messages/en.json' with { type: 'json' };

describe('message file key parity', () => {
  const esKeys = Object.keys(esMessages).sort();
  const enKeys = Object.keys(enMessages).sort();

  it('should have the same number of keys in both locales', () => {
    expect(esKeys.length).toBe(enKeys.length);
  });

  it('should have identical key sets between es and en', () => {
    expect(esKeys).toEqual(enKeys);
  });

  it('should have non-empty translations in es.json (source of truth)', () => {
    for (const key of esKeys) {
      expect(esMessages[key as keyof typeof esMessages]).toBeTruthy();
    }
  });

  it('should have non-empty translations in en.json', () => {
    for (const key of enKeys) {
      expect(enMessages[key as keyof typeof enMessages]).toBeTruthy();
    }
  });

  it('should not have placeholder text in en.json', () => {
    // Every English translation should be a real translation, not the key name
    const placeholderPatterns = [/^en\./, /^admin\./, /^landing\./, /^track\./, /^login\./];
    for (const key of enKeys) {
      const value = enMessages[key as keyof typeof enMessages];
      if (typeof value === 'string') {
        const isPlaceholder = placeholderPatterns.some((p) => p.test(value));
        expect(isPlaceholder).toBe(false);
      }
    }
  });
});
