import { ControllersEnabledSettingId, NotificationsSettingId, SettingKey, SettingKeyFromValue } from './settings';

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
  name: string;
  color: string;
  enabledSetting: SettingKeyFromValue<boolean, ControllersEnabledSettingId>;
  notificationsEnabledSetting: SettingKeyFromValue<boolean, NotificationsSettingId>;
}

export const CONTROLLERS: { [ id in ControllerId ]: ControllerDetails } = {
  [ ControllerId.Pandora ]: {
    name: 'Pandora',
    color: '#3668ff',
    enabledSetting: SettingKey.ControllersEnabled.Pandora,
    notificationsEnabledSetting: SettingKey.Notifications.Pandora,
  },
  [ ControllerId.Spotify ]: {
    name: 'Spotify',
    color: '#1db954',
    enabledSetting: SettingKey.ControllersEnabled.Spotify,
    notificationsEnabledSetting: SettingKey.Notifications.Spotify,
  },
  [ ControllerId.Youtube ]: {
    name: 'Youtube',
    color: '#f00',
    enabledSetting: SettingKey.ControllersEnabled.Youtube,
    notificationsEnabledSetting: SettingKey.Notifications.Youtube,
  },
};
