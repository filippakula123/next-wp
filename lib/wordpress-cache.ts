/** Local CMS editing may bypass cache; published production pages always use it. */
export function wordpressCacheDisabled(): boolean {
  return process.env.NODE_ENV !== 'production' && process.env.WORDPRESS_CACHE_DISABLED === 'true';
}
