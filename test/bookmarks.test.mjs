import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, loadBookmarks, normalizeUrl } from '../src/lib/bookmarks.mjs';

test('normalizes URLs with and without https to the same saved value', () => {
  assert.equal(normalizeUrl('www.example.com'), normalizeUrl('https://www.example.com'));
});

test('recovers from empty, corrupted, legacy, and non-array storage values', () => {
  for (const value of [null, '', '{not json', '{"url":"https://example.com"}', 'null', '[]']) {
    assert.deepEqual(loadBookmarks(value), []);
  }

  assert.deepEqual(
    loadBookmarks(
      JSON.stringify([
        { url: 'https://example.com/', slug: 'mona-7fk2' },
        { url: 'https://example.org/', slug: 'not-a-mona-slug' },
        { url: 42, slug: 'mona-abc' },
      ]),
    ),
    [{ url: 'https://example.com/', slug: 'mona-7fk2' }],
  );
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com/', slug: 'mona-7fk2' }),
    'https://www.example.com/ :: mona-7fk2',
  );
});
