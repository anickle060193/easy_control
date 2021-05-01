import { EventEmitter } from './EventEmitter';
import { SingleFireEventEmitter } from './SingleFireEventEmitter';

enum NotificationsSettingId
{
  // AmazonMusic = 'key__notifications__amazon_music',
  // AmazonVideo = 'key__notifications__amazon_video',
  // Bandcamp = 'key__notifications__bandcamp',
  // GooglePlayMusic = 'key__notifications__google_play_music',
  // HboGo = 'key__notifications__hbo_go',
  // Hulu = 'key__notifications__hulu',
  // Netflix = 'key__notifications__netflix',
  // Pandora = 'key__notifications__pandora',
  // Spotify = 'key__notifications__spotify',
  // Twitch = 'key__notifications__twitch',
  // Youtube = 'key__notifications__youtube',
  // GenericAudioVideo = 'key__notifications__generic_audio_video',
}

enum ControllersEnabledSettingId
{
  // AmazonMusic = 'key__controllers_enabled__amazon_music',
  // AmazonVideo = 'key__controllers_enabled__amazon_video',
  // Bandcamp = 'key__controllers_enabled__bandcamp',
  // GooglePlayMusic = 'key__controllers_enabled__google_play_music',
  // HboGo = 'key__controllers_enabled__hbo_go',
  // Hulu = 'key__controllers_enabled__hulu',
  // Netflix = 'key__controllers_enabled__netflix',
  // Pandora = 'key__controllers_enabled__pandora',
  // Spotify = 'key__controllers_enabled__spotify',
  // Twitch = 'key__controllers_enabled__twitch',
  // Youtube = 'key__controllers_enabled__youtube',
  // GenericAudioVideo = 'key__controllers_enabled__generic_audio_video',
}

enum ControllerColorsSettingId
{
  // AmazonMusic = 'key__controller_colors__amazon_music',
  // AmazonVideo = 'key__controller_colors__amazon_video',
  // Bandcamp = 'key__controller_colors__bandcamp',
  // GooglePlayMusic = 'key__controller_colors__google_play_music',
  // HboGo = 'key__controller_colors__hbo_go',
  // Hulu = 'key__controller_colors__hulu',
  // Netflix = 'key__controller_colors__netflix',
  // Pandora = 'key__controller_colors__pandora',
  // Spotify = 'key__controller_colors__spotify',
  // Twitch = 'key__controller_colors__twitch',
  // Youtube = 'key__controller_colors__youtube',
  // GenericAudioVideo = 'key__controller_colors__generic_audio_video',
}

enum OpenInExistingSettingId
{
  // AmazonMusic = 'key__open_in_existing__amazon_music',
  // AmazonVideo = 'key__open_in_existing__amazon_video',
  // Bandcamp = 'key__open_in_existing__bandcamp',
  // GooglePlayMusic = 'key__open_in_existing__google_play_music',
  // HboGo = 'key__open_in_existing__hbo_go',
  // Hulu = 'key__open_in_existing__hulu',
  // Netflix = 'key__open_in_existing__netflix',
  // Pandora = 'key__open_in_existing__pandora',
  // Spotify = 'key__open_in_existing__spotify',
  // Twitch = 'key__open_in_existing__twitch',
  // Youtube = 'key__open_in_existing__youtube',
  // GenericAudioVideo = 'key__open_in_existing__generic_audio_video',
}

enum OtherSettingId
{
  NotificationsEnabled = 'key__other__notifications_enabled',
  // NoActiveWindowNotifications = 'key__no_active_window_notifications',
  // DefaultSite = 'key__default_site',
  // PauseOnLock = 'key__pause_on_lock',
  // PauseOnInactivity = 'key__pause_on_inactivity',
  // InactivityTimeout = 'key__inactivity_timeout',
  // AutoPauseEnabled = 'key__auto_pause_enabled',
  // ShowChangeLogOnUpdate = 'key__show_change_log_on_update',
  // ShowAutoPausedNotification = 'key__show_auto_paused_notification',
  // SiteBlacklist = 'key__site_blacklist',
  // ControlsPopupWidth = 'key__controls_popup_width',
  // ControlsPopupHeight = 'key__controls_popup_height',
}

enum ControlsOtherSettingId
{
  // DisplayControls = 'key__controls__display_controls',
  // AlwaysDisplayPlaybackSpeed = 'key__controls__always_display_playback_speed',
  // HideControlsWhenIdle = 'key__controls__hide_controls_when_idle',
  // HideControlsIdleTime = 'key__controls__hide_controls_idle_time',
  // SkipBackwardAmount = 'keys__controls__skip_backward_amount',
  // SkipForwardAmount = 'keys__controls__skip_forward_amount',
  // DefaultPlaybackSpeed = 'key__controls__other__default_playback_speed',
}

enum ControlsMediaControlsSettingId
{
  // Reset = 'key__controls__playback_speed__reset',
  // MuchSlower = 'key__controls__playback_speed__much_slower',
  // Slower = 'key__controls__playback_speed__slower',
  // SkipBackward = 'key__controls__media_controls__skip_backward',
  // PlayPause = 'key__controls__media_controls__play_pause',
  // SkipForward = 'key__controls__media_controls__skip_forward',
  // Faster = 'key__controls__playback_speed__faster',
  // MuchFaster = 'key__controls__playback_speed__much_faster',
  // Loop = 'key__controls__playback_speed__loop',
  // Fullscreen = 'key__controls__media_controls__fullscreen',
}

enum ControlsOverlayControlsSettingId
{
  // Reset = 'key__controls__overlay_controls__reset',
  // MuchSlower = 'key__controls__overlay_controls__much_slower',
  // Slower = 'key__controls__overlay_controls__slower',
  // SkipBackward = 'key__controls__overlay_controls__skip_backward',
  // PlayPause = 'key__controls__overlay_controls__play_pause',
  // SkipForward = 'key__controls__overlay_controls__skip_forward',
  // Faster = 'key__controls__overlay_controls__faster',
  // MuchFaster = 'key__controls__overlay_controls__much_faster',
  // Loop = 'key__controls__overlay_controls__loop',
  // Fullscreen = 'key__controls__overlay_controls__fullscreen',
}

export const SettingKey = {
  Notifications: NotificationsSettingId,
  ControllersEnabled: ControllersEnabledSettingId,
  ControllerColors: ControllerColorsSettingId,
  OpenInExisting: OpenInExistingSettingId,
  Other: OtherSettingId,
  Controls: {
    Other: ControlsOtherSettingId,
    MediaControls: ControlsMediaControlsSettingId,
    OverlayControls: ControlsOverlayControlsSettingId,
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
  // [ SettingKey.Notifications.Pandora ]: boolean;
  // [ SettingKey.Notifications.Spotify ]: boolean;
  // [ SettingKey.Notifications.Twitch ]: boolean;
  // [ SettingKey.Notifications.Youtube ]: boolean;
  // [ SettingKey.Notifications.GenericAudioVideo ]: boolean;

  // [ SettingKey.ControllersEnabled.AmazonMusic ]: boolean;
  // [ SettingKey.ControllersEnabled.AmazonVideo ]: boolean;
  // [ SettingKey.ControllersEnabled.Bandcamp ]: boolean;
  // [ SettingKey.ControllersEnabled.GooglePlayMusic ]: boolean;
  // [ SettingKey.ControllersEnabled.HboGo ]: boolean;
  // [ SettingKey.ControllersEnabled.Hulu ]: boolean;
  // [ SettingKey.ControllersEnabled.Netflix ]: boolean;
  // [ SettingKey.ControllersEnabled.Pandora ]: boolean;
  // [ SettingKey.ControllersEnabled.Spotify ]: boolean;
  // [ SettingKey.ControllersEnabled.Twitch ]: boolean;
  // [ SettingKey.ControllersEnabled.Youtube ]: boolean;
  // [ SettingKey.ControllersEnabled.GenericAudioVideo ]: boolean;

  // [ SettingKey.ControllerColors.AmazonMusic ]: string;
  // [ SettingKey.ControllerColors.AmazonVideo ]: string;
  // [ SettingKey.ControllerColors.Bandcamp ]: string;
  // [ SettingKey.ControllerColors.GooglePlayMusic ]: string;
  // [ SettingKey.ControllerColors.HboGo ]: string;
  // [ SettingKey.ControllerColors.Hulu ]: string;
  // [ SettingKey.ControllerColors.Netflix ]: string;
  // [ SettingKey.ControllerColors.Pandora ]: string;
  // [ SettingKey.ControllerColors.Spotify ]: string;
  // [ SettingKey.ControllerColors.Twitch ]: string;
  // [ SettingKey.ControllerColors.Youtube ]: string;
  // [ SettingKey.ControllerColors.GenericAudioVideo ]: string;

  // [ SettingKey.OpenInExisting.AmazonMusic ]: boolean;
  // [ SettingKey.OpenInExisting.AmazonVideo ]: boolean;
  // [ SettingKey.OpenInExisting.Bandcamp ]: boolean;
  // [ SettingKey.OpenInExisting.GooglePlayMusic ]: boolean;
  // [ SettingKey.OpenInExisting.HboGo ]: boolean;
  // [ SettingKey.OpenInExisting.Hulu ]: boolean;
  // [ SettingKey.OpenInExisting.Netflix ]: boolean;
  // [ SettingKey.OpenInExisting.Pandora ]: boolean;
  // [ SettingKey.OpenInExisting.Spotify ]: boolean;
  // [ SettingKey.OpenInExisting.Twitch ]: boolean;
  // [ SettingKey.OpenInExisting.Youtube ]: boolean;
  // [ SettingKey.OpenInExisting.GenericAudioVideo ]: boolean;

  [ SettingKey.Other.NotificationsEnabled ]: boolean;
  // [ SettingKey.Other.NoActiveWindowNotifications ]: boolean;
  // [ SettingKey.Other.DefaultSite ]: Sites;
  // [ SettingKey.Other.PauseOnLock ]: boolean;
  // [ SettingKey.Other.PauseOnInactivity ]: boolean;
  // [ SettingKey.Other.InactivityTimeout ]: number;
  // [ SettingKey.Other.AutoPauseEnabled ]: boolean;
  // [ SettingKey.Other.ShowChangeLogOnUpdate ]: boolean;
  // [ SettingKey.Other.ShowAutoPausedNotification ]: boolean;
  // [ SettingKey.Other.SiteBlacklist ]: string[];
  // [ SettingKey.Other.ControlsPopupWidth ]: number;
  // [ SettingKey.Other.ControlsPopupHeight ]: number;

  // [ SettingKey.Controls.Other.DisplayControls ]: boolean;
  // [ SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed ]: boolean;
  // [ SettingKey.Controls.Other.HideControlsWhenIdle ]: boolean;
  // [ SettingKey.Controls.Other.HideControlsIdleTime ]: number;
  // [ SettingKey.Controls.Other.SkipBackwardAmount ]: number;
  // [ SettingKey.Controls.Other.SkipForwardAmount ]: number;
  // [ SettingKey.Controls.Other.DefaultPlaybackSpeed ]: number;

  // [ SettingKey.Controls.MediaControls.Reset ]: string;
  // [ SettingKey.Controls.MediaControls.MuchSlower ]: string;
  // [ SettingKey.Controls.MediaControls.Slower ]: string;
  // [ SettingKey.Controls.MediaControls.SkipBackward ]: string;
  // [ SettingKey.Controls.MediaControls.PlayPause ]: string;
  // [ SettingKey.Controls.MediaControls.SkipForward ]: string;
  // [ SettingKey.Controls.MediaControls.Faster ]: string;
  // [ SettingKey.Controls.MediaControls.MuchFaster ]: string;
  // [ SettingKey.Controls.MediaControls.Loop ]: string;
  // [ SettingKey.Controls.MediaControls.Fullscreen ]: string;

  // [ SettingKey.Controls.OverlayControls.Reset ]: boolean;
  // [ SettingKey.Controls.OverlayControls.MuchSlower ]: boolean;
  // [ SettingKey.Controls.OverlayControls.Slower ]: boolean;
  // [ SettingKey.Controls.OverlayControls.SkipBackward ]: boolean;
  // [ SettingKey.Controls.OverlayControls.PlayPause ]: boolean;
  // [ SettingKey.Controls.OverlayControls.SkipForward ]: boolean;
  // [ SettingKey.Controls.OverlayControls.Faster ]: boolean;
  // [ SettingKey.Controls.OverlayControls.MuchFaster ]: boolean;
  // [ SettingKey.Controls.OverlayControls.Loop ]: boolean;
  // [ SettingKey.Controls.OverlayControls.Fullscreen ]: boolean;
}

export type SettingKeyType = (
  // NotificationsSettingId |
  // ControllersEnabledSettingId |
  // ControllerColorsSettingId |
  // OpenInExistingSettingId |
  OtherSettingId // |
  // ControlsOtherSettingId |
  // ControlsMediaControlsSettingId |
  // ControlsOverlayControlsSettingId
);

export type SettingValue = SettingsType[ SettingKeyType ];

export type SettingKeyFromValue<V> = { [ setting in keyof SettingsType ]: SettingsType[ setting ] extends V ? setting : never }[ keyof SettingsType ];

const DEFAULT_SETTINGS: SettingsType = {
  // [ SettingKey.Notifications.AmazonMusic ]: true,
  // [ SettingKey.Notifications.AmazonVideo ]: true,
  // [ SettingKey.Notifications.Bandcamp ]: true,
  // [ SettingKey.Notifications.GooglePlayMusic ]: true,
  // [ SettingKey.Notifications.HboGo ]: true,
  // [ SettingKey.Notifications.Hulu ]: true,
  // [ SettingKey.Notifications.Netflix ]: true,
  // [ SettingKey.Notifications.Pandora ]: true,
  // [ SettingKey.Notifications.Spotify ]: true,
  // [ SettingKey.Notifications.Twitch ]: true,
  // [ SettingKey.Notifications.Youtube ]: true,
  // [ SettingKey.Notifications.GenericAudioVideo ]: true,

  // [ SettingKey.ControllersEnabled.AmazonMusic ]: true,
  // [ SettingKey.ControllersEnabled.AmazonVideo ]: true,
  // [ SettingKey.ControllersEnabled.Bandcamp ]: true,
  // [ SettingKey.ControllersEnabled.GooglePlayMusic ]: true,
  // [ SettingKey.ControllersEnabled.HboGo ]: true,
  // [ SettingKey.ControllersEnabled.Hulu ]: true,
  // [ SettingKey.ControllersEnabled.Netflix ]: true,
  // [ SettingKey.ControllersEnabled.Pandora ]: true,
  // [ SettingKey.ControllersEnabled.Spotify ]: true,
  // [ SettingKey.ControllersEnabled.Twitch ]: true,
  // [ SettingKey.ControllersEnabled.Youtube ]: true,
  // [ SettingKey.ControllersEnabled.GenericAudioVideo ]: true,

  // [ SettingKey.ControllerColors.AmazonMusic ]: '#fd7c02',
  // [ SettingKey.ControllerColors.AmazonVideo ]: '#FF9900',
  // [ SettingKey.ControllerColors.Bandcamp ]: '#639AA9',
  // [ SettingKey.ControllerColors.GooglePlayMusic ]: '#ff5722',
  // [ SettingKey.ControllerColors.HboGo ]: '#0f0f0f',
  // [ SettingKey.ControllerColors.Hulu ]: '#66AA33',
  // [ SettingKey.ControllerColors.Netflix ]: '#e50914',
  // [ SettingKey.ControllerColors.Pandora ]: '#455774',
  // [ SettingKey.ControllerColors.Spotify ]: '#84bd00',
  // [ SettingKey.ControllerColors.Twitch ]: '#6441A4',
  // [ SettingKey.ControllerColors.Youtube ]: '#f12b24',
  // [ SettingKey.ControllerColors.GenericAudioVideo ]: '#5b5b5b',

  // [ SettingKey.OpenInExisting.AmazonMusic ]: false,
  // [ SettingKey.OpenInExisting.AmazonVideo ]: false,
  // [ SettingKey.OpenInExisting.Bandcamp ]: false,
  // [ SettingKey.OpenInExisting.GooglePlayMusic ]: false,
  // [ SettingKey.OpenInExisting.HboGo ]: false,
  // [ SettingKey.OpenInExisting.Hulu ]: false,
  // [ SettingKey.OpenInExisting.Netflix ]: false,
  // [ SettingKey.OpenInExisting.Pandora ]: false,
  // [ SettingKey.OpenInExisting.Spotify ]: false,
  // [ SettingKey.OpenInExisting.Twitch ]: false,
  // [ SettingKey.OpenInExisting.Youtube ]: false,
  // [ SettingKey.OpenInExisting.GenericAudioVideo ]: false,

  [ SettingKey.Other.NotificationsEnabled ]: true,
  // [ SettingKey.Other.NoActiveWindowNotifications ]: false,
  // [ SettingKey.Other.DefaultSite ]: Sites.Youtube,
  // [ SettingKey.Other.PauseOnLock ]: true,
  // [ SettingKey.Other.PauseOnInactivity ]: false,
  // [ SettingKey.Other.InactivityTimeout ]: 60 * 5,
  // [ SettingKey.Other.AutoPauseEnabled ]: true,
  // [ SettingKey.Other.ShowChangeLogOnUpdate ]: true,
  // [ SettingKey.Other.ShowAutoPausedNotification ]: false,
  // [ SettingKey.Other.SiteBlacklist ]: [ 'imgur.com' ],
  // [ SettingKey.Other.ControlsPopupWidth ]: 315,
  // [ SettingKey.Other.ControlsPopupHeight ]: 450,

  // [ SettingKey.Controls.Other.DisplayControls ]: true,
  // [ SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed ]: true,
  // [ SettingKey.Controls.Other.HideControlsWhenIdle ]: true,
  // [ SettingKey.Controls.Other.HideControlsIdleTime ]: 5,
  // [ SettingKey.Controls.Other.SkipBackwardAmount ]: 10,
  // [ SettingKey.Controls.Other.SkipForwardAmount ]: 10,
  // [ SettingKey.Controls.Other.DefaultPlaybackSpeed ]: 1.0,

  // [ SettingKey.Controls.MediaControls.Reset ]: '',
  // [ SettingKey.Controls.MediaControls.MuchSlower ]: '',
  // [ SettingKey.Controls.MediaControls.Slower ]: '',
  // [ SettingKey.Controls.MediaControls.SkipBackward ]: '',
  // [ SettingKey.Controls.MediaControls.PlayPause ]: '',
  // [ SettingKey.Controls.MediaControls.SkipForward ]: '',
  // [ SettingKey.Controls.MediaControls.Faster ]: '',
  // [ SettingKey.Controls.MediaControls.MuchFaster ]: '',
  // [ SettingKey.Controls.MediaControls.Loop ]: '',
  // [ SettingKey.Controls.MediaControls.Fullscreen ]: '',

  // [ SettingKey.Controls.OverlayControls.Reset ]: true,
  // [ SettingKey.Controls.OverlayControls.MuchSlower ]: true,
  // [ SettingKey.Controls.OverlayControls.Slower ]: true,
  // [ SettingKey.Controls.OverlayControls.SkipBackward ]: true,
  // [ SettingKey.Controls.OverlayControls.PlayPause ]: true,
  // [ SettingKey.Controls.OverlayControls.SkipForward ]: true,
  // [ SettingKey.Controls.OverlayControls.Faster ]: true,
  // [ SettingKey.Controls.OverlayControls.MuchFaster ]: true,
  // [ SettingKey.Controls.OverlayControls.Loop ]: true,
  // [ SettingKey.Controls.OverlayControls.Fullscreen ]: true,
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
          console.log( 'Setting changed:', key, ':', change.oldValue, '->', change.newValue );

          if( this.isValid( key, change.newValue ) )
          {
            this.cache[ key ] = change.newValue as never;
          }
        }

        if( settingChanged )
        {
          this.onChanged.dispatch();
        }
      } );

      this.onInitialized.dispatch();
      this.onChanged.dispatch();
    } );
  }

  private isValid<K extends SettingKeyType>( setting: K, value: unknown ): value is SettingsType[ K ]
  {
    // if( setting === SettingKey.Other.SiteBlacklist )
    // {
    //   if( Array.isArray( value )
    //     && value.every( ( v ) => typeof v === 'string' ) )
    //   {
    //     return true;
    //   }
    // }
    /* else */ if( typeof value === typeof DEFAULT_SETTINGS[ setting ] )
    {
      return true;
    }

    return false;
  }

  public get<K extends SettingKeyType>( setting: K ): SettingsType[ K ]
  {
    const value = this.cache[ setting ];

    if( !this.isValid( setting, value ) )
    {
      console.warn( 'Stored setting value type is invalid:', setting, '-', value );
      return DEFAULT_SETTINGS[ setting ];
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
}

const settings = new SettingsStorage();
export default settings;
