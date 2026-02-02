import { isAbsoluteUrl, joinBase } from "./url.js";

export type CdnOptions = {
  base?: string;
  normalizeSlashes?: boolean;
};

/**
 * Core Sororomo-style resolver:
 * - absolute => passthrough
 * - no base => passthrough (local/noCDN)
 * - base => prefix (safe join)
 */
export function cdn(pathOrUrl: string, opts: CdnOptions = {}): string {
  const s = String(pathOrUrl ?? "");
  if (!s) return s;

  if (isAbsoluteUrl(s)) return s;
  if (!opts.base) return s;

  return joinBase(opts.base, s, opts.normalizeSlashes ?? true);
}

/** Explicit alias for readability in apps */
export function cdnLocal(pathOrUrl: string): string {
  return cdn(pathOrUrl);
}
