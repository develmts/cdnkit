import { cdn } from "../core/cdn.js";
import { isAbsoluteUrl, trimSlashes, joinUrlParts } from "../core/url.js";

export type GhJsdelivrOptions = {
  owner: string;
  repo: string;
  ref?: string;       // tag/branch/sha
  basePath?: string;  // path inside repo
  normalizeSlashes?: boolean;
};

export function createGhJsdelivrCdn(opts: GhJsdelivrOptions) {
  const owner = opts.owner?.trim();
  const repo = opts.repo?.trim();
  if (!owner || !repo) throw new Error("createGhJsdelivrCdn: owner and repo are required");

  const normalize = opts.normalizeSlashes ?? true;
  const refPart = opts.ref?.trim() ? `@${opts.ref.trim()}` : "";
  const base = `https://cdn.jsdelivr.net/gh/${owner}/${repo}${refPart}`;
  const basePath = opts.basePath ? trimSlashes(opts.basePath) : "";

  return (pathOrUrl: string) => {
    const s = String(pathOrUrl ?? "");
    if (!s) return s;
    if (isAbsoluteUrl(s)) return s;

    const rel = trimSlashes(s);
    const fullPath = basePath ? joinUrlParts(basePath, rel) : rel;

    return cdn(fullPath, { base, normalizeSlashes: normalize });
  };
}
