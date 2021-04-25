export enum ControllerId
{
  Pandora = 'controller_id__pandora',
  Youtube = 'controller_id__youtube',
  Spotify = 'controller_id__spotify',
}

export interface MediaInfo
{
  playing: boolean;
  track: string | null;
  artist: string | null;
  album: string | null;
  artwork: string | null;
  progress: number;
}

export const CONTROLLER_COLORS: { [ key in ControllerId ]: string } = {
  [ ControllerId.Pandora ]: '#3668ff',
  [ ControllerId.Youtube ]: '#f00',
  [ ControllerId.Spotify ]: '#1db954',
};
