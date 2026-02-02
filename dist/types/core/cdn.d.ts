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
export declare function cdn(pathOrUrl: string, opts?: CdnOptions): string;
/** Explicit alias for readability in apps */
export declare function cdnLocal(pathOrUrl: string): string;
