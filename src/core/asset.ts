import { isAbsoluteUrl, trimSlashes } from "./url.js";

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

function mergeQuery(
  a: Record<string, QueryValue> | undefined,
  b: Record<string, QueryValue> | undefined
): Record<string, QueryValue> | undefined {
  if (!a && !b) return undefined;
  return { ...(a ?? {}), ...(b ?? {}) };
}

function toSearchParams(q: Record<string, QueryValue>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v === null || v === undefined) continue;
    sp.set(k, String(v));
  }
  return sp.toString();
}

/**
 * Create an AssetRef from a string.
 * - If absolute URL => { absolute: url, path: "" }
 * - Else => { path: input }
 */
export function asset(input: string, meta: { kind?: AssetKind; preset?: string } = {}): AssetRef {
  const s = String(input ?? "");
  if (!s) return { input: s, path: "" };

  if (isAbsoluteUrl(s)) {
    return { input: s, absolute: s, path: "", kind: meta.kind, preset: meta.preset };
  }

  return { input: s, path: s, kind: meta.kind, preset: meta.preset };
}

/** Pure helper: set/override kind */
export function withKind(ref: AssetRef, kind: AssetKind): AssetRef {
  return { ...ref, kind };
}

/** Pure helper: set/override preset name */
export function withPreset(ref: AssetRef, preset: string): AssetRef {
  return { ...ref, preset };
}

/** Pure helper: prepend a prefix (does not normalize slashes here) */
export function withPrefix(ref: AssetRef, prefix: string): AssetRef {
  return { ...ref, prefix: prefix ?? "" };
}

/** Pure helper: append a suffix */
export function withSuffix(ref: AssetRef, suffix: string): AssetRef {
  return { ...ref, suffix: suffix ?? "" };
}

/** Pure helper: merge query params (b overwrites a) */
export function withQuery(ref: AssetRef, query: Record<string, QueryValue>): AssetRef {
  return { ...ref, query: mergeQuery(ref.query, query) };
}

/** Pure helper: set hash fragment */
export function withHash(ref: AssetRef, hash: string): AssetRef {
  return { ...ref, hash: hash ?? "" };
}

/** Apply a preset function (if provided) */
export function applyPreset(ref: AssetRef, preset?: AssetPreset): AssetRef {
  return preset ? preset(ref) : ref;
}

/** Lookup and apply by name (if both exist) */
export function applyPresetByName(ref: AssetRef, presets?: PresetMap): AssetRef {
  if (!presets) return ref;
  const name = ref.preset;
  if (!name) return ref;
  const fn = presets[name];
  return fn ? fn(ref) : ref;
}

/**
 * Resolve an AssetRef into a final URL string.
 * Flow:
 * 1) absolute passthrough
 * 2) build relative path (prefix + path + suffix)
 * 3) feed into provided CDN resolver (nivell 1)
 * 4) append query + hash
 */
export function resolveAsset(
  ref: AssetRef,
  cdn: CdnResolver,
  presets?: PresetMap,
  opts: ResolveAssetOptions = {}
): string {
  // 1) absolute passthrough
  if (ref.absolute) return ref.absolute;

  const normalizePathSlashes = opts.normalizePathSlashes ?? true;
  const normalizeHash = opts.normalizeHash ?? true;

  // 2) apply preset(s)
  const withPresetApplied = applyPresetByName(ref, presets);

  // 3) build path
  let p = String(withPresetApplied.path ?? "");

  const pref = String(withPresetApplied.prefix ?? "");
  const suff = String(withPresetApplied.suffix ?? "");

  if (pref) p = pref + p;
  if (suff) p = p + suff;

  if (normalizePathSlashes) {
    // Keep it relative so providers can join safely
    p = trimSlashes(p);
  }

  // 4) pass through CDN resolver (nivell 1)
  let url = cdn(p);

  // 5) append query
  if (withPresetApplied.query) {
    const q = toSearchParams(withPresetApplied.query);
    if (q) url += (url.includes("?") ? "&" : "?") + q;
  }

  // 6) append hash
  if (withPresetApplied.hash) {
    const h = normalizeHash ? withPresetApplied.hash.replace(/^#/, "") : withPresetApplied.hash;
    if (h) url += "#" + h;
  }

  return url;
}
