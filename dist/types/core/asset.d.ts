export type QueryValue = string | number | boolean | null | undefined;
export type AssetKind = "image" | "json" | "font" | "other";
export type AssetRef = {
    /** Original input (useful for debugging). */
    input?: string;
    /**
     * If provided, the asset is treated as an absolute URL and will be returned as-is.
     * This is the Sororomo rule: absolute URLs pass through unchanged.
     */
    absolute?: string;
    /**
     * Logical relative path (no base). Example: "people/abc.jpg"
     * Should not include the CDN base. Leading "/" is allowed in input; resolver can normalize.
     */
    path: string;
    /** Optional path prefix/suffix applied at resolve time. */
    prefix?: string;
    suffix?: string;
    /** Query parameters appended at resolve time. */
    query?: Record<string, QueryValue>;
    /** Hash fragment (without #) appended at resolve time. */
    hash?: string;
    /** Optional hints for app-level routing/presets. */
    kind?: AssetKind;
    preset?: string;
};
export type AssetPreset = (ref: AssetRef) => AssetRef;
export type PresetMap = Record<string, AssetPreset>;
export type ResolveAssetOptions = {
    /**
     * Default: true
     * If true, resolver will strip leading slashes from path/prefix to keep it relative.
     */
    normalizePathSlashes?: boolean;
    /**
     * Default: true
     * If true, resolver will normalize hash by stripping leading "#".
     */
    normalizeHash?: boolean;
};
/** A CDN resolver is a Nivell 1 function: string -> string */
export type CdnResolver = (pathOrUrl: string) => string;
/**
 * Create an AssetRef from a string.
 * - If absolute URL => { absolute: url, path: "" }
 * - Else => { path: input }
 */
export declare function asset(input: string, meta?: {
    kind?: AssetKind;
    preset?: string;
}): AssetRef;
/** Pure helper: set/override kind */
export declare function withKind(ref: AssetRef, kind: AssetKind): AssetRef;
/** Pure helper: set/override preset name */
export declare function withPreset(ref: AssetRef, preset: string): AssetRef;
/** Pure helper: prepend a prefix (does not normalize slashes here) */
export declare function withPrefix(ref: AssetRef, prefix: string): AssetRef;
/** Pure helper: append a suffix */
export declare function withSuffix(ref: AssetRef, suffix: string): AssetRef;
/** Pure helper: merge query params (b overwrites a) */
export declare function withQuery(ref: AssetRef, query: Record<string, QueryValue>): AssetRef;
/** Pure helper: set hash fragment */
export declare function withHash(ref: AssetRef, hash: string): AssetRef;
/** Apply a preset function (if provided) */
export declare function applyPreset(ref: AssetRef, preset?: AssetPreset): AssetRef;
/** Lookup and apply by name (if both exist) */
export declare function applyPresetByName(ref: AssetRef, presets?: PresetMap): AssetRef;
/**
 * Resolve an AssetRef into a final URL string.
 * Flow:
 * 1) absolute passthrough
 * 2) build relative path (prefix + path + suffix)
 * 3) feed into provided CDN resolver (nivell 1)
 * 4) append query + hash
 */
export declare function resolveAsset(ref: AssetRef, cdn: CdnResolver, presets?: PresetMap, opts?: ResolveAssetOptions): string;
