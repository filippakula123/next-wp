import { afterEach, describe, expect, it, vi } from 'vitest';
import { wordpressCacheDisabled } from '@/lib/wordpress-cache';

afterEach(() => vi.unstubAllEnvs());
describe('production CMS cache', () => {
  it('cannot accidentally disable published-page caching with a local editing flag', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('WORDPRESS_CACHE_DISABLED', 'true');
    expect(wordpressCacheDisabled()).toBe(false);
  });
  it('keeps local CMS changes visible immediately while developing', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('WORDPRESS_CACHE_DISABLED', 'true');
    expect(wordpressCacheDisabled()).toBe(true);
    vi.stubEnv('WORDPRESS_CACHE_DISABLED', 'false');
    expect(wordpressCacheDisabled()).toBe(false);
  });
});
