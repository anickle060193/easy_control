export interface MediaInfo
{
  playing: boolean;
  track: string | null;
  artist: string | null;
  album: string | null;
  artwork: string | null;
  progress: number;
}
