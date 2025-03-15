export type TIconSet = {
    id: string;
    name: string;
    total: number;
    version?: string;
    author: {
        name: string;
        url: string;
    };
    license: {
        title: string;
        spdx: string;
        url: string;
    };
    samples?: string[];
    height: number;
    displayHeight?: number;
    category: string;
    palette: boolean;
};

export type TIconSetWithIconData = {
    id: string;
    name: string;
    height: number;
    palette: boolean;
    data: {
        aliases?: Record<string, string>;
        height?: number;
        width?: number;
        lastModified?: number;
        icons: TIcon[];
        prefix?: string;
    }
}

export type TIcon = {
    id: string;
    first: boolean
    body: string;
    bodyWithTransform?: string;
    transform?: {
        attributeName: string | null
        dur: string | null
        from: string | null
        repeatCount: string | null
        to: string | null
        type: string | null
    };
    height?: number;
    width?: number;
    left?: number;
    top?: number;
}


export type TSearchResult = {
    collections: Record<string, TIconSet>,
    icons: string[],
    total: number,
    start: number,
    limit: number,
    request: {
        query: string,
    },
}
export type TSearchResultWithIconData = {
    collections: TIconSetWithIconData[],
    total: number,
    start: number,
    limit: number,
    request: {
        query: string,
    },
}


export type TFavIcon = {
    collection: {
        id: string;
        height?: number;
        width?: number;
    },
    icon: TIcon
}