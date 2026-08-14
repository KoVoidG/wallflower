import { describe, it, expect } from 'vitest';
import enMessages from '../../src/messages/en.json';
import thMessages from '../../src/messages/th.json';

function getLeafKeyPaths(obj: unknown, prefix = ''): string[] {
  let paths: string[] = [];
  if (obj !== null && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        paths = paths.concat(getLeafKeyPaths(item, `${prefix}[${index}]`));
      });
    } else {
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        paths = paths.concat(getLeafKeyPaths(value, fullPath));
      }
    }
  } else {
    paths.push(prefix);
  }
  return paths;
}

function getValueByPath(obj: unknown, path: string): unknown {
  const normalized = path.replace(/\[(\d+)\]/g, '.$1');
  const segments = normalized.split('.').filter(Boolean);
  let current: unknown = obj;
  for (const seg of segments) {
    if (current && typeof current === 'object' && seg in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return current;
}

describe('i18n Translation Catalogs Parity', () => {
  const enPaths = getLeafKeyPaths(enMessages).sort();
  const thPaths = getLeafKeyPaths(thMessages).sort();

  it('should have the exact same number of translation keys in en and th', () => {
    expect(thPaths.length).toBe(enPaths.length);
  });

  it('all keys present in en.json should exist in th.json', () => {
    const missingInThai = enPaths.filter((path) => !thPaths.includes(path));
    expect(missingInThai).toEqual([]);
  });

  it('all keys present in th.json should exist in en.json', () => {
    const missingInEnglish = thPaths.filter((path) => !enPaths.includes(path));
    expect(missingInEnglish).toEqual([]);
  });

  it('should have non-empty string values for all keys', () => {
    for (const path of enPaths) {
      const enVal = getValueByPath(enMessages, path);
      const thVal = getValueByPath(thMessages, path);
      expect(enVal, `en.json empty value at ${path}`).toBeTruthy();
      expect(thVal, `th.json empty value at ${path}`).toBeTruthy();
    }
  });

  it('interpolation parameters like {name} should match between en and th', () => {
    const paramRegex = /\{([a-zA-Z0-9_]+)\}/g;
    for (const path of enPaths) {
      const enVal = String(getValueByPath(enMessages, path) ?? '');
      const thVal = String(getValueByPath(thMessages, path) ?? '');
      const enParams = [...enVal.matchAll(paramRegex)].map((m) => m[1]).sort();
      const thParams = [...thVal.matchAll(paramRegex)].map((m) => m[1]).sort();
      expect(thParams, `Mismatch in interpolation variables at ${path}: en=${enParams} vs th=${thParams}`).toEqual(enParams);
    }
  });
});
