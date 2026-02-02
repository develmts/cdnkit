import type { AssetPreset, QueryValue } from "../core/asset.js";
export declare function devCdnPreset(project: string, opts?: {
    /**
     * Default: "assets"
     * Folder inside each project namespace.
     * Result: "<project>/<assetsDir>/<path>"
     */
    assetsDir?: string;
    /** Optional query params (e.g. cache-busting) */
    query?: Record<string, QueryValue>;
}): AssetPreset;
