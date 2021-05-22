import { EventEmitter } from './EventEmitter';
import { SingleFireEventEmitter } from './SingleFireEventEmitter';

export enum NotificationsSettingId
{
  // AmazonMusic = 'key__notifications__amazon_music',
  // AmazonVideo = 'key__notifications__amazon_video',
  // Bandcamp = 'key__notifications__bandcamp',
  // GooglePlayMusic = 'key__notifications__google_play_music',
  // HboGo = 'key__notifications__hbo_go',
  // Hulu = 'key__notifications__hulu',
  // Netflix = 'key__notifications__netflix',
  Pandora = 'key__notifications__pandora',
  Spotify = 'key__notifications__spotify',
  // Twitch = 'key__notifications__twitch',
  Youtube = 'key__notifications__youtube',
  GenericAudioVideo = 'key__notifications__generic_audio_video',
}

export enum ControllersEnabledSettingId
{
  // AmazonMusic = 'key__controllers_enabled__amazon_music',
  // AmazonVideo = 'key__controllers_enabled__amazon_video',
  // Bandcamp = 'key__controllers_enabled__bandcamp',
  // GooglePlayMusic = 'key__controllers_enabled__google_play_music',
  // HboGo = 'key__controllers_enabled__hbo_go',
  // Hulu = 'key__controllers_enabled__hulu',
  // Netflix = 'key__controllers_enabled__netflix',
  Pandora = 'key__controllers_enabled__pandora',
  Spotify = 'key__controllers_enabled__spotify',
  // Twitch = 'key__controllers_enabled__twitch',
  Youtube = 'key__controllers_enabled__youtube',
  GenericAudioVideo = 'key__controllers_enabled__generic_audio_video',
}

export enum OtherSettingId
{
  NotificationsEnabled = 'key__other__notifications_enabled',
  NoActiveWindowNotifications = 'key__no_active_window_notifications',
  PauseOnLock = 'key__pause_on_lock',
  PauseOnInactivity = 'key__pause_on_inactivity',
  InactivityTimeout = 'key__inactivity_timeout',
  AutoPauseEnabled = 'key__auto_pause_enabled',
  ShowChangeLogOnUpdate = 'key__show_change_log_on_update',
  ShowAutoPausedNotification = 'key__show_auto_paused_notification',
  SiteBlacklist = 'key__site_blacklist',
  ControlsPopupWidth = 'key__controls_popup_width',
  ControlsPopupHeight = 'key__controls_popup_height',
  MaximumGenericAudioVideoControllersPerPage = 'key__maximum_generic_audio_video_controllers_per_page',
}

export enum ControlsOverlayOtherSettingId
{
  DisplayControls = 'key__controls__display_controls',
  AlwaysDisplayPlaybackSpeed = 'key__controls__always_display_playback_speed',
  HideControlsWhenIdle = 'key__controls__hide_controls_when_idle',
  HideControlsIdleTime = 'key__controls__hide_controls_idle_time',
  // SkipBackwardAmount = 'keys__controls__skip_backward_amount',
  // SkipForwardAmount = 'keys__controls__skip_forward_amount',
  // DefaultPlaybackSpeed = 'key__controls__other__default_playback_speed',
}

export enum ControlsOverlayControlVisibleSettingId
{
  Reset = 'key__controls__overlay_controls__reset',
  MuchSlower = 'key__controls__overlay_controls__much_slower',
  Slower = 'key__controls__overlay_controls__slower',
  SkipBackward = 'key__controls__overlay_controls__skip_backward',
  PlayPause = 'key__controls__overlay_controls__play_pause',
  SkipForward = 'key__controls__overlay_controls__skip_forward',
  Faster = 'key__controls__overlay_controls__faster',
  MuchFaster = 'key__controls__overlay_controls__much_faster',
  Loop = 'key__controls__overlay_controls__loop',
  Fullscreen = 'key__controls__overlay_controls__fullscreen',
}

export const SettingKey = {
  Notifications: NotificationsSettingId,
  ControllersEnabled: ControllersEnabledSettingId,
  Other: OtherSettingId,
  ControlsOverlay: {
    Other: ControlsOverlayOtherSettingId,
    Visible: ControlsOverlayControlVisibleSettingId,
  },
};

export interface SettingsType
{
  // [ SettingKey.Notifications.AmazonMusic ]: boolean;
  // [ SettingKey.Notifications.AmazonVideo ]: boolean;
  // [ SettingKey.Notifications.Bandcamp ]: boolean;
  // [ SettingKey.Notifications.GooglePlayMusic ]: boolean;
  // [ SettingKey.Notifications.HboGo ]: boolean;
  // [ SettingKey.Notifications.Hulu ]: boolean;
  // [ SettingKey.Notifications.Netflix ]: boolean;
  [ SettingKey.Notifications.Pandora ]: boolean;
  [ SettingKey.Notifications.Spotify ]: boolean;
  // [ SettingKey.Notifications.Twitch ]: boolean;
  [ SettingKey.Notifications.Youtube ]: boolean;
  [ SettingKey.Notifications.GenericAudioVideo ]: boolean;

  // [ SettingKey.ControllersEnabled.AmazonMusic ]: boolean;
  // [ SettingKey.ControllersEnabled.AmazonVideo ]: boolean;
  // [ SettingKey.ControllersEnabled.Bandcamp ]: boolean;
  // [ SettingKey.ControllersEnabled.GooglePlayMusic ]: boolean;
  // [ SettingKey.ControllersEnabled.HboGo ]: boolean;
  // [ SettingKey.ControllersEnabled.Hulu ]: boolean;
  // [ SettingKey.ControllersEnabled.Netflix ]: boolean;
  [ SettingKey.ControllersEnabled.Pandora ]: boolean;
  [ SettingKey.ControllersEnabled.Spotify ]: boolean;
  // [ SettingKey.ControllersEnabled.Twitch ]: boolean;
  [ SettingKey.ControllersEnabled.Youtube ]: boolean;
  [ SettingKey.ControllersEnabled.GenericAudioVideo ]: boolean;

  [ SettingKey.Other.NotificationsEnabled ]: boolean;
  [ SettingKey.Other.NoActiveWindowNotifications ]: boolean;
  [ SettingKey.Other.PauseOnLock ]: boolean;
  [ SettingKey.Other.PauseOnInactivity ]: boolean;
  [ SettingKey.Other.InactivityTimeout ]: number;
  [ SettingKey.Other.AutoPauseEnabled ]: boolean;
  [ SettingKey.Other.ShowChangeLogOnUpdate ]: boolean;
  [ SettingKey.Other.ShowAutoPausedNotification ]: boolean;
  [ SettingKey.Other.SiteBlacklist ]: string[];
  [ SettingKey.Other.ControlsPopupWidth ]: number;
  [ SettingKey.Other.ControlsPopupHeight ]: number;
  [ SettingKey.Other.MaximumGenericAudioVideoControllersPerPage ]: number;

  [ SettingKey.ControlsOverlay.Other.DisplayControls ]: boolean;
  [ SettingKey.ControlsOverlay.Other.AlwaysDisplayPlaybackSpeed ]: boolean;
  [ SettingKey.ControlsOverlay.Other.HideControlsWhenIdle ]: boolean;
  [ SettingKey.ControlsOverlay.Other.HideControlsIdleTime ]: number;
  // [ SettingKey.Controls.Other.SkipBackwardAmount ]: number;
  // [ SettingKey.Controls.Other.SkipForwardAmount ]: number;
  // [ SettingKey.Controls.Other.DefaultPlaybackSpeed ]: number;

  [ SettingKey.ControlsOverlay.Visible.Reset ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.MuchSlower ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.Slower ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.SkipBackward ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.PlayPause ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.SkipForward ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.Faster ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.MuchFaster ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.Loop ]: boolean;
  [ SettingKey.ControlsOverlay.Visible.Fullscreen ]: boolean;
}

export type SettingKeyType = (
  NotificationsSettingId |
  ControllersEnabledSettingId |
  OtherSettingId |
  ControlsOverlayOtherSettingId |
  ControlsOverlayControlVisibleSettingId
);

export type SettingValue = SettingsType[ SettingKeyType ];

export type SettingKeyFromValue<V, S extends SettingKeyType = SettingKeyType> = { [ setting in S ]: SettingsType[ setting ] extends V ? setting : never }[ S ];

const DEFAULT_SETTINGS: SettingsType = {
  // [ SettingKey.Notifications.AmazonMusic ]: true,
  // [ SettingKey.Notifications.AmazonVideo ]: true,
  // [ SettingKey.Notifications.Bandcamp ]: true,
  // [ SettingKey.Notifications.GooglePlayMusic ]: true,
  // [ SettingKey.Notifications.HboGo ]: true,
  // [ SettingKey.Notifications.Hulu ]: true,
  // [ SettingKey.Notifications.Netflix ]: true,
  [ SettingKey.Notifications.Pandora ]: true,
  [ SettingKey.Notifications.Spotify ]: true,
  // [ SettingKey.Notifications.Twitch ]: true,
  [ SettingKey.Notifications.Youtube ]: true,
  [ SettingKey.Notifications.GenericAudioVideo ]: true,

  // [ SettingKey.ControllersEnabled.AmazonMusic ]: true,
  // [ SettingKey.ControllersEnabled.AmazonVideo ]: true,
  // [ SettingKey.ControllersEnabled.Bandcamp ]: true,
  // [ SettingKey.ControllersEnabled.GooglePlayMusic ]: true,
  // [ SettingKey.ControllersEnabled.HboGo ]: true,
  // [ SettingKey.ControllersEnabled.Hulu ]: true,
  // [ SettingKey.ControllersEnabled.Netflix ]: true,
  [ SettingKey.ControllersEnabled.Pandora ]: true,
  [ SettingKey.ControllersEnabled.Spotify ]: true,
  // [ SettingKey.ControllersEnabled.Twitch ]: true,
  [ SettingKey.ControllersEnabled.Youtube ]: true,
  [ SettingKey.ControllersEnabled.GenericAudioVideo ]: true,

  [ SettingKey.Other.NotificationsEnabled ]: true,
  [ SettingKey.Other.NoActiveWindowNotifications ]: false,
  [ SettingKey.Other.PauseOnLock ]: true,
  [ SettingKey.Other.PauseOnInactivity ]: false,
  [ SettingKey.Other.InactivityTimeout ]: 60 * 5,
  [ SettingKey.Other.AutoPauseEnabled ]: true,
  [ SettingKey.Other.ShowChangeLogOnUpdate ]: true,
  [ SettingKey.Other.ShowAutoPausedNotification ]: false,
  [ SettingKey.Other.SiteBlacklist ]: [ 'imgur.com' ],
  [ SettingKey.Other.ControlsPopupWidth ]: 620,
  [ SettingKey.Other.ControlsPopupHeight ]: 220,
  [ SettingKey.Other.MaximumGenericAudioVideoControllersPerPage ]: 5,

  [ SettingKey.ControlsOverlay.Other.DisplayControls ]: true,
  [ SettingKey.ControlsOverlay.Other.AlwaysDisplayPlaybackSpeed ]: true,
  [ SettingKey.ControlsOverlay.Other.HideControlsWhenIdle ]: true,
  [ SettingKey.ControlsOverlay.Other.HideControlsIdleTime ]: 5,
  // [ SettingKey.Controls.Other.SkipBackwardAmount ]: 10,
  // [ SettingKey.Controls.Other.SkipForwardAmount ]: 10,
  // [ SettingKey.Controls.Other.DefaultPlaybackSpeed ]: 1.0,

  [ SettingKey.ControlsOverlay.Visible.Reset ]: true,
  [ SettingKey.ControlsOverlay.Visible.MuchSlower ]: true,
  [ SettingKey.ControlsOverlay.Visible.Slower ]: true,
  [ SettingKey.ControlsOverlay.Visible.SkipBackward ]: true,
  [ SettingKey.ControlsOverlay.Visible.PlayPause ]: true,
  [ SettingKey.ControlsOverlay.Visible.SkipForward ]: true,
  [ SettingKey.ControlsOverlay.Visible.Faster ]: true,
  [ SettingKey.ControlsOverlay.Visible.MuchFaster ]: true,
  [ SettingKey.ControlsOverlay.Visible.Loop ]: true,
  [ SettingKey.ControlsOverlay.Visible.Fullscreen ]: true,
};

class SettingsStorage
{
  private cache: SettingsType = {
    ...DEFAULT_SETTINGS,
  };

  public readonly onInitialized = new SingleFireEventEmitter();
  public readonly onChanged = new EventEmitter();

  constructor()
  {
    chrome.storage.sync.get( DEFAULT_SETTINGS, ( items ) =>
    {
      if( chrome.runtime.lastError )
      {
        console.error( 'Failed to retrieve settings:', chrome.runtime.lastError.message );
        return;
      }

      this.cache = {
        ...this.cache,
        ...items,
      };

      this.onInitialized.dispatch();
      this.onChanged.dispatch();
    } );

    chrome.storage.onChanged.addListener( ( changes, areaName ) =>
    {
      if( areaName !== 'sync' )
      {
        return;
      }

      let settingChanged = false;

      for( const key of Object.keys( changes ) as SettingKeyType[] )
      {
        if( !( key in DEFAULT_SETTINGS ) )
        {
          continue;
        }

        settingChanged = true;

        const change = changes[ key ];
        if( typeof change.newValue === 'undefined' )
        {
          change.newValue = this.getDefault( key );
        }

        if( this.isValid( key, change.newValue ) )
        {
          console.log( 'Setting changed:', key, ':', change.oldValue, '->', change.newValue );
          this.cache[ key ] = change.newValue as never;
        }
        else
        {
          console.warn( 'Invalid setting change:', key, ':', change.oldValue, '->', change.newValue );
        }
      }

      if( settingChanged )
      {
        this.onChanged.dispatch();
      }
    } );
  }

  private isValid<K extends SettingKeyType>( setting: K, value: unknown ): value is SettingsType[ K ]
  {
    if( !( setting in this.cache ) )
    {
      return false;
    }
    else if( setting === SettingKey.Other.SiteBlacklist )
    {
      if( Array.isArray( value )
        && value.every( ( v ) => typeof v === 'string' ) )
      {
        return true;
      }
    }
    else if( typeof value === typeof DEFAULT_SETTINGS[ setting ] )
    {
      return true;
    }

    return false;
  }

  public getDefault<K extends SettingKeyType>( setting: K ): SettingsType[ K ]
  {
    return DEFAULT_SETTINGS[ setting ];
  }

  public get<K extends SettingKeyType>( setting: K ): SettingsType[ K ]
  {
    const value = this.cache[ setting ];

    if( !this.isValid( setting, value ) )
    {
      console.warn( 'Stored setting value type is invalid:', setting, '-', value );
      return this.getDefault( setting );
    }

    return value;
  }

  public set<K extends SettingKeyType>( setting: K, value: SettingsType[ K ] )
  {
    if( !this.isValid( setting, value ) )
    {
      console.error( 'Setting value type is invalid:', setting, value );
      return;
    }

    chrome.storage.sync.set( { [ setting ]: value }, () =>
    {
      if( chrome.runtime.lastError )
      {
        console.error( 'Failed to set setting value:', setting, value, chrome.runtime.lastError );
        return;
      }

      this.cache[ setting ] = value;
    } );
  }

  public getExportUrl()
  {
    const data = JSON.stringify( this.cache, null, 2 );
    return `data:application/json;base64,${window.btoa( data )}`;
  }

  public importSettings( data: unknown ): void
  {
    if( typeof data !== 'object'
      || data === null
      || data === undefined )
    {
      return;
    }

    for( const [ key, value ] of Object.entries( data ) )
    {
      console.log( 'Importing', key, '-', value );
      this.set( key as SettingKeyType, value );
    }
  }
}

const settings = new SettingsStorage();
export default settings;
