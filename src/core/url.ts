export function isAbsoluteUrl(s: string): boolean {
  return /^(https?:)?\/\//i.test(s) || /^(data|blob):/i.test(s);
}

export function trimSlashes(s: string): string {
  return s.replace(/^\/+|\/+$/g, "");
}

export function joinUrlParts(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .map((p) => trimSlashes(p))
    .join("/");
}

/**
 * Join base + path ensuring exactly one "/" boundary (when normalizeSlashes=true).
 * base is assumed absolute (https://...).
 */
export function joinBase(base: string, path: string, normalizeSlashes: boolean): string {
  if (!normalizeSlashes) return base + path;

  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${b}/${p}`;
}
