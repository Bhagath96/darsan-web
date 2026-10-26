/**
 * Returns `target` only if it is a path on this site, else `fallback`.
 * Blocks open redirects such as "//evil.com", "/\evil.com" or "https://evil.com".
 */
export function safeRedirect(target: string | null | undefined, fallback = '/'): string {
  if (!target || !target.startsWith('/')) return fallback
  if (target.startsWith('//') || target.startsWith('/\\')) return fallback
  return target
}
