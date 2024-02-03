export interface Spot {
    id?: string,
    name: string,
    latitude: number,
    longitude: number,
    mediaUrls?: MediaFile[]
};

export interface MediaFile {
    url: string;
    type: 'video' | 'image';
};