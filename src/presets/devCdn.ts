import type { AssetPreset, QueryValue } from "../core/asset.js";

export function devCdnPreset(
  project: string,
  opts: {
    /**
     * Default: "assets"
     * Folder inside each project namespace.
     * Result: "<project>/<assetsDir>/<path>"
     */
    assetsDir?: string;

    /** Optional query params (e.g. cache-busting) */
    query?: Record<string, QueryValue>;
  } = {}
): AssetPreset {
  const p = String(project ?? "").trim();
  if (!p) throw new Error("devCdnPreset: project is required");

  const assetsDir = String(opts.assetsDir ?? "assets").trim();
  if (!assetsDir) throw new Error("devCdnPreset: assetsDir must not be empty");

  // Make it resilient: allow user to pass "neptune/" or "/neptune"
  const cleanProject = p.replace(/^\/+|\/+$/g, "");
  const cleanAssets = assetsDir.replace(/^\/+|\/+$/g, "");

  const prefix = `${cleanProject}/${cleanAssets}/`;

  return (ref) => ({
    ...ref,
    prefix,
    query: { ...(ref.query ?? {}), ...(opts.query ?? {}) }
  });
}
