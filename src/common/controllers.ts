import { ControllersEnabledSettingId, NotificationsSettingId, SettingKey, SettingKeyFromValue } from './settings';

export enum ControllerId
{
  Pandora = 'controller_id__pandora',
  Youtube = 'controller_id__youtube',
  Spotify = 'controller_id__spotify',
  GenericAudioVideo = 'controller_id__generic_audio_video',
}

export enum ControllerCommand
{
  PlayPause = 'controller_command__play_pause',
  Play = 'controller_command__play',
  Pause = 'controller_command__pause',
  Next = 'controller_command__next',
  Previous = 'controller_command__previous',
  SkipBackward = 'controller_command__skip_backward',
  SkipForward = 'controller_command__skip_foward',
  Like = 'controller_command__like',
  Unlike = 'controller_command__unlike',
  Dislike = 'controller_command__dislike',
  Undislike = 'controller_command__undislike',
  VolumeUp = 'controller_command__volume_up',
  VolumeDown = 'controller_command__volume_down',
}

export interface ControllerMedia
{
  track: string | null;
  artist: string | null;
  album: string | null;
  artwork: string | null;
  liked: boolean;
  disliked: boolean;
}

export const DEFAULT_CONTROLLER_MEDIA: Readonly<ControllerMedia> = {
  track: null,
  artist: null,
  album: null,
  artwork: null,
  liked: false,
  disliked: false,
};

export interface ControllerStatus
{
  enabled: boolean;
  playing: boolean;
  progress: number;
  volume: number;
}

export const DEFAULT_CONTROLLER_STATUS: Readonly<ControllerStatus> = {
  enabled: false,
  playing: false,
  progress: 0.0,
  volume: 0.0,
};

export interface ControllerCapabilities
{
  next: boolean;
  previous: boolean;
  skipBackward: boolean;
  skipForward: boolean;
  like: boolean;
  unlike: boolean;
  dislike: boolean;
  undislike: boolean;
  volume: boolean;
}

export const DEFAULT_CONTROLLER_CAPABILITIES: Readonly<ControllerCapabilities> = {
  next: false,
  previous: false,
  skipBackward: false,
  skipForward: false,
  like: false,
  unlike: false,
  dislike: false,
  undislike: false,
  volume: false,
};

export interface ControllerDetails
{
  id: ControllerId;
  name: string;
  color: string;
  enabledSetting: SettingKeyFromValue<boolean, ControllersEnabledSettingId>;
  notificationsEnabledSetting: SettingKeyFromValue<boolean, NotificationsSettingId>;
}

function createControllerConfig(
  controller: keyof typeof ControllerId,
  config: Pick<ControllerDetails, 'name' | 'color'>
): ControllerDetails
{
  return {
    ...config,
    id: ControllerId[ controller ],
    enabledSetting: SettingKey.ControllersEnabled[ controller ],
    notificationsEnabledSetting: SettingKey.Notifications[ controller ],
  };
}

export const CONTROLLERS: { [ id in ControllerId ]: ControllerDetails } = {
  [ ControllerId.Pandora ]: createControllerConfig( 'Pandora', {
    name: 'Pandora',
    color: '#3668ff',
  } ),
  [ ControllerId.Spotify ]: createControllerConfig( 'Spotify', {
    name: 'Spotify',
    color: '#1db954',
  } ),
  [ ControllerId.Youtube ]: createControllerConfig( 'Youtube', {
    name: 'Youtube',
    color: '#f00',
  } ),
  [ ControllerId.GenericAudioVideo ]: createControllerConfig( 'GenericAudioVideo', {
    name: 'Generic Audio/Video',
    color: '#299af4',
  } ),
};
