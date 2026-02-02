import { cdn } from "../core/cdn.js";
import { isAbsoluteUrl, trimSlashes, joinUrlParts } from "../core/url.js";

export type GhPagesOptions = {
  owner: string;
  repo?: string;      // if provided => project pages
  basePath?: string;
  normalizeSlashes?: boolean;
};

export function createGhPagesCdn(opts: GhPagesOptions) {
  const owner = opts.owner?.trim();
  if (!owner) throw new Error("createGhPagesCdn: owner is required");

  const normalize = opts.normalizeSlashes ?? true;

  const root = `https://${owner}.github.io`;
  const repoPart = opts.repo?.trim() ? trimSlashes(opts.repo.trim()) : "";
  const basePath = opts.basePath ? trimSlashes(opts.basePath) : "";

  const base = repoPart ? joinUrlParts(root, repoPart) : root;

  return (pathOrUrl: string) => {
    const s = String(pathOrUrl ?? "");
    if (!s) return s;
    if (isAbsoluteUrl(s)) return s;

    const rel = trimSlashes(s);
    const fullPath = basePath ? joinUrlParts(basePath, rel) : rel;

    return cdn(fullPath, { base, normalizeSlashes: normalize });
  };
}
