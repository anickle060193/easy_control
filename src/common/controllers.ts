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
}

export interface ControllerStatus
{
  enabled: boolean;
  playing: boolean;
  progress: number;
}

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
