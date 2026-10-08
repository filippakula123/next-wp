// Local uploads bypass the optimizer; public uploads use responsive optimization.
export function wordpressImageUnoptimized(src: string) {
  try {
    const hostname = new URL(src).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname.endsWith(".local");
  } catch { return false; }
}
