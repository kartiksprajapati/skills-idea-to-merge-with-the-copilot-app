const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SLUG_PATTERN = /^mona-[0-9a-zA-Z]+$/;

export function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('Enter a URL.');
  }

  const candidate = /^[a-z][a-z\d+\-.]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(candidate);

  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
    throw new Error('Enter a valid HTTP or HTTPS URL.');
  }

  return url.href;
}

export function loadBookmarks(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (bookmark) =>
        bookmark &&
        typeof bookmark === 'object' &&
        typeof bookmark.url === 'string' &&
        bookmark.url.length > 0 &&
        typeof bookmark.slug === 'string' &&
        SLUG_PATTERN.test(bookmark.slug),
    );
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks) {
  return JSON.stringify(bookmarks);
}

export function createSlug(existingSlugs = [], seed = Date.now()) {
  const used = new Set(existingSlugs);
  let value = Math.max(0, Math.floor(seed));
  let slug = `mona-${toBase62(value)}`;

  while (used.has(slug)) {
    value += 1;
    slug = `mona-${toBase62(value)}`;
  }

  return slug;
}

export function formatBookmark({ url, slug }) {
  return `${url} :: ${slug}`;
}

function toBase62(value) {
  if (value === 0) {
    return '0';
  }

  let result = '';
  let remaining = value;
  while (remaining > 0) {
    result = BASE62[remaining % 62] + result;
    remaining = Math.floor(remaining / 62);
  }
  return result;
}
