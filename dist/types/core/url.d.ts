export declare function isAbsoluteUrl(s: string): boolean;
export declare function trimSlashes(s: string): string;
export declare function joinUrlParts(...parts: string[]): string;
/**
 * Join base + path ensuring exactly one "/" boundary (when normalizeSlashes=true).
 * base is assumed absolute (https://...).
 */
export declare function joinBase(base: string, path: string, normalizeSlashes: boolean): string;
