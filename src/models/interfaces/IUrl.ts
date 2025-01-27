export interface IUrl {
    urlId: string;
    origUrl: string;
    shortUrl: string;
    alias: string;
    topic?: string;
    clicks: number;
    createdBy: string;
}

export interface IRequestUrl {
    longUrl : string;
    customAlias ?: string;
    topic ?: string;
}