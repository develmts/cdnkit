export type GhPagesOptions = {
    owner: string;
    repo?: string;
    basePath?: string;
    normalizeSlashes?: boolean;
};
export declare function createGhPagesCdn(opts: GhPagesOptions): (pathOrUrl: string) => string;
