import { describe, it, expect } from 'vitest';
import { nestMessages } from '@/lib/i18n/nest-messages';

describe('nestMessages', () => {
  it('should convert flat dot-separated keys to nested structure', () => {
    const flat = {
      'landing.title': 'Package Tracker',
      'landing.subtitle': 'Track your packages',
      'landing.feature.title': 'Feature',
    };

    const nested = nestMessages(flat);

    expect(nested).toEqual({
      landing: {
        title: 'Package Tracker',
        subtitle: 'Track your packages',
        feature: {
          title: 'Feature',
        },
      },
    });
  });

  it('should handle single-level keys', () => {
    const flat = { title: 'Hello', description: 'World' };
    expect(nestMessages(flat)).toEqual({ title: 'Hello', description: 'World' });
  });

  it('should handle empty object', () => {
    expect(nestMessages({})).toEqual({});
  });

  it('should handle deep nesting', () => {
    const flat = {
      'a.b.c.d.e': 'deep',
      'a.b.c.d.f': 'also deep',
    };

    const nested = nestMessages(flat);

    expect(nested).toEqual({
      a: {
        b: {
          c: {
            d: {
              e: 'deep',
              f: 'also deep',
            },
          },
        },
      },
    });
  });

  it('should preserve string values unchanged', () => {
    const flat = { 'msg.hello': 'Hello, {name}!' };
    const nested = nestMessages(flat);
    expect(nested).toEqual({ msg: { hello: 'Hello, {name}!' } });
  });
});
