export type GhJsdelivrOptions = {
    owner: string;
    repo: string;
    ref?: string;
    basePath?: string;
    normalizeSlashes?: boolean;
};
export declare function createGhJsdelivrCdn(opts: GhJsdelivrOptions): (pathOrUrl: string) => string;
