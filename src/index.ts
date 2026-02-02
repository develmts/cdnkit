export { cdn, cdnLocal } from "./core/cdn.js";
export type { CdnOptions } from "./core/cdn.js";

export { createGhJsdelivrCdn } from "./providers/gh-jsdelivr.js";
export type { GhJsdelivrOptions } from "./providers/gh-jsdelivr.js";

export { createGhPagesCdn } from "./providers/gh-pages.js";
export type { GhPagesOptions } from "./providers/gh-pages.js";

export {
  asset,
  resolveAsset,
  applyPreset,
  applyPresetByName,
  withKind,
  withPreset,
  withPrefix,
  withSuffix,
  withQuery,
  withHash
} from "./core/asset.js";

export type {
  AssetRef,
  AssetKind,
  AssetPreset,
  PresetMap,
  ResolveAssetOptions,
  CdnResolver,
  QueryValue
} from "./core/asset.js";