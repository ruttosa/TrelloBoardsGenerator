import { SpotifyService } from "./spotify.service";

export class SpotyifyCommon{
    name: string;
    id: string;
    images: SpotifyImage[]
}
export class Artista extends SpotyifyCommon {
}

export class SpotifyImage{
    width: number;
    height: number;
    url: string;
}

export class Album extends SpotyifyCommon{
    release_date: Date;
    total_tracks: number;
    type: string;
}