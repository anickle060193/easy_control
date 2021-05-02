export enum ControllerId
{
  Pandora = 'controller_id__pandora',
  Youtube = 'controller_id__youtube',
  Spotify = 'controller_id__spotify',
}

export interface ControllerMedia
{
  track: string | null;
  artist: string | null;
  album: string | null;
  artwork: string | null;
}

export interface ControllerStatus
{
  playing: boolean;
  progress: number;
}

export const CONTROLLER_COLORS: { [ key in ControllerId ]: string } = {
  [ ControllerId.Pandora ]: '#3668ff',
  [ ControllerId.Youtube ]: '#f00',
  [ ControllerId.Spotify ]: '#1db954',
};

export const CONTROLLER_NAMES: { [ key in ControllerId ]: string } = {
  [ ControllerId.Pandora ]: 'Pandora',
  [ ControllerId.Youtube ]: 'Youtube',
  [ ControllerId.Spotify ]: 'Spotify',
};
