export namespace SettingKey
{
  export enum Notifications
  {
    AmazonMusic = 'key__notifications__amazon_music',
    AmazonVideo = 'key__notifications__amazon_video',
    Bandcamp = 'key__notifications__bandcamp',
    GooglePlayMusic = 'key__notifications__google_play_music',
    HboGo = 'key__notifications__hbo_go',
    Hulu = 'key__notifications__hulu',
    Netflix = 'key__notifications__netflix',
    Pandora = 'key__notifications__pandora',
    Spotify = 'key__notifications__spotify',
    Twitch = 'key__notifications__twitch',
    Youtube = 'key__notifications__youtube',
    GenericAudioVideo = 'key__notifications__generic_audio_video',
  }

  export enum ControllersEnabled
  {
    AmazonMusic = 'key__controllers_enabled__amazon_music',
    AmazonVideo = 'key__controllers_enabled__amazon_video',
    Bandcamp = 'key__controllers_enabled__bandcamp',
    GooglePlayMusic = 'key__controllers_enabled__google_play_music',
    HboGo = 'key__controllers_enabled__hbo_go',
    Hulu = 'key__controllers_enabled__hulu',
    Netflix = 'key__controllers_enabled__netflix',
    Pandora = 'key__controllers_enabled__pandora',
    Spotify = 'key__controllers_enabled__spotify',
    Twitch = 'key__controllers_enabled__twitch',
    Youtube = 'key__controllers_enabled__youtube',
    GenericAudioVideo = 'key__controllers_enabled__generic_audio_video',
  }

  export enum ControllerColors
  {
    AmazonMusic = 'key__controller_colors__amazon_music',
    AmazonVideo = 'key__controller_colors__amazon_video',
    Bandcamp = 'key__controller_colors__bandcamp',
    GooglePlayMusic = 'key__controller_colors__google_play_music',
    HboGo = 'key__controller_colors__hbo_go',
    Hulu = 'key__controller_colors__hulu',
    Netflix = 'key__controller_colors__netflix',
    Pandora = 'key__controller_colors__pandora',
    Spotify = 'key__controller_colors__spotify',
    Twitch = 'key__controller_colors__twitch',
    Youtube = 'key__controller_colors__youtube',
    GenericAudioVideo = 'key__controller_colors__generic_audio_video',
  }

  export enum OpenInExisting
  {
    AmazonMusic = 'key__open_in_existing__amazon_music',
    AmazonVideo = 'key__open_in_existing__amazon_video',
    Bandcamp = 'key__open_in_existing__bandcamp',
    GooglePlayMusic = 'key__open_in_existing__google_play_music',
    HboGo = 'key__open_in_existing__hbo_go',
    Hulu = 'key__open_in_existing__hulu',
    Netflix = 'key__open_in_existing__netflix',
    Pandora = 'key__open_in_existing__pandora',
    Spotify = 'key__open_in_existing__spotify',
    Twitch = 'key__open_in_existing__twitch',
    Youtube = 'key__open_in_existing__youtube',
    GenericAudioVideo = 'key__open_in_existing__generic_audio_video',
  }

  export const enum Other
  {
    NoActiveWindowNotifications = 'key__no_active_window_notifications',
    DefaultSite = 'key__default_site',
    PauseOnLock = 'key__pause_on_lock',
    PauseOnInactivity = 'key__pause_on_inactivity',
    InactivityTimeout = 'key__inactivity_timeout',
    AutoPauseEnabled = 'key__auto_pause_enabled',
    ShowChangeLogOnUpdate = 'key__show_change_log_on_update',
    ShowAutoPausedNotification = 'key__show_auto_paused_notification',
    SiteBlacklist = 'key__site_blacklist',
    ControlsPopupWidth = 'key__controls_popup_width',
    ControlsPopupHeight = 'key__controls_popup_height',
  }

  // tslint:disable-next-line:no-shadowed-variable
  export namespace Controls
  {
    // tslint:disable-next-line:no-shadowed-variable
    export const enum Other
    {
      DisplayControls = 'key__controls__display_controls',
      AlwaysDisplayPlaybackSpeed = 'key__controls__always_display_playback_speed',
      HideControlsWhenIdle = 'key__controls__hide_controls_when_idle',
      HideControlsIdleTime = 'key__controls__hide_controls_idle_time',
      SkipBackwardAmount = 'keys__controls__skip_backward_amount',
      SkipForwardAmount = 'keys__controls__skip_forward_amount',
      DefaultPlaybackSpeed = 'key__controls__other__default_playback_speed',
    }

    export const enum MediaControls
    {
      Reset = 'key__controls__playback_speed__reset',
      MuchSlower = 'key__controls__playback_speed__much_slower',
      Slower = 'key__controls__playback_speed__slower',
      SkipBackward = 'key__controls__media_controls__skip_backward',
      PlayPause = 'key__controls__media_controls__play_pause',
      SkipForward = 'key__controls__media_controls__skip_forward',
      Faster = 'key__controls__playback_speed__faster',
      MuchFaster = 'key__controls__playback_speed__much_faster',
      Loop = 'key__controls__playback_speed__loop',
      Fullscreen = 'key__controls__media_controls__fullscreen',
    }

    export const enum OverlayControls
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
  }
}

export enum Sites
{
  AmazonMusic = 'AmazonMusic',
  AmazonVideo = 'AmazonVideo',
  Bandcamp = 'Bandcamp',
  GooglePlayMusic = 'GooglePlayMusic',
  HboGo = 'HboGo',
  Hulu = 'Hulu',
  Netflix = 'Netflix',
  Pandora = 'Pandora',
  Spotify = 'Spotify',
  Twitch = 'Twitch',
  Youtube = 'Youtube',
  GenericAudioVideo = 'GenericAudioVideo',
}

export const enum Controls
{
  Reset = 'Reset',
  MuchSlower = 'MuchSlower',
  Slower = 'Slower',
  SkipBackward = 'SkipBackward',
  PlayPause = 'PlayPause',
  SkipForward = 'SkipForward',
  Faster = 'Faster',
  MuchFaster = 'MuchFaster',
  Loop = 'Loop',
  Fullscreen = 'Fullscreen',
}

export interface SettingsType
{
  [ SettingKey.Notifications.AmazonMusic ]: boolean;
  [ SettingKey.Notifications.AmazonVideo ]: boolean;
  [ SettingKey.Notifications.Bandcamp ]: boolean;
  [ SettingKey.Notifications.GooglePlayMusic ]: boolean;
  [ SettingKey.Notifications.HboGo ]: boolean;
  [ SettingKey.Notifications.Hulu ]: boolean;
  [ SettingKey.Notifications.Netflix ]: boolean;
  [ SettingKey.Notifications.Pandora ]: boolean;
  [ SettingKey.Notifications.Spotify ]: boolean;
  [ SettingKey.Notifications.Twitch ]: boolean;
  [ SettingKey.Notifications.Youtube ]: boolean;
  [ SettingKey.Notifications.GenericAudioVideo ]: boolean;

  [ SettingKey.ControllersEnabled.AmazonMusic ]: boolean;
  [ SettingKey.ControllersEnabled.AmazonVideo ]: boolean;
  [ SettingKey.ControllersEnabled.Bandcamp ]: boolean;
  [ SettingKey.ControllersEnabled.GooglePlayMusic ]: boolean;
  [ SettingKey.ControllersEnabled.HboGo ]: boolean;
  [ SettingKey.ControllersEnabled.Hulu ]: boolean;
  [ SettingKey.ControllersEnabled.Netflix ]: boolean;
  [ SettingKey.ControllersEnabled.Pandora ]: boolean;
  [ SettingKey.ControllersEnabled.Spotify ]: boolean;
  [ SettingKey.ControllersEnabled.Twitch ]: boolean;
  [ SettingKey.ControllersEnabled.Youtube ]: boolean;
  [ SettingKey.ControllersEnabled.GenericAudioVideo ]: boolean;

  [ SettingKey.ControllerColors.AmazonMusic ]: string;
  [ SettingKey.ControllerColors.AmazonVideo ]: string;
  [ SettingKey.ControllerColors.Bandcamp ]: string;
  [ SettingKey.ControllerColors.GooglePlayMusic ]: string;
  [ SettingKey.ControllerColors.HboGo ]: string;
  [ SettingKey.ControllerColors.Hulu ]: string;
  [ SettingKey.ControllerColors.Netflix ]: string;
  [ SettingKey.ControllerColors.Pandora ]: string;
  [ SettingKey.ControllerColors.Spotify ]: string;
  [ SettingKey.ControllerColors.Twitch ]: string;
  [ SettingKey.ControllerColors.Youtube ]: string;
  [ SettingKey.ControllerColors.GenericAudioVideo ]: string;

  [ SettingKey.OpenInExisting.AmazonMusic ]: boolean;
  [ SettingKey.OpenInExisting.AmazonVideo ]: boolean;
  [ SettingKey.OpenInExisting.Bandcamp ]: boolean;
  [ SettingKey.OpenInExisting.GooglePlayMusic ]: boolean;
  [ SettingKey.OpenInExisting.HboGo ]: boolean;
  [ SettingKey.OpenInExisting.Hulu ]: boolean;
  [ SettingKey.OpenInExisting.Netflix ]: boolean;
  [ SettingKey.OpenInExisting.Pandora ]: boolean;
  [ SettingKey.OpenInExisting.Spotify ]: boolean;
  [ SettingKey.OpenInExisting.Twitch ]: boolean;
  [ SettingKey.OpenInExisting.Youtube ]: boolean;
  [ SettingKey.OpenInExisting.GenericAudioVideo ]: boolean;

  [ SettingKey.Other.NoActiveWindowNotifications ]: boolean;
  [ SettingKey.Other.DefaultSite ]: Sites;
  [ SettingKey.Other.PauseOnLock ]: boolean;
  [ SettingKey.Other.PauseOnInactivity ]: boolean;
  [ SettingKey.Other.InactivityTimeout ]: number;
  [ SettingKey.Other.AutoPauseEnabled ]: boolean;
  [ SettingKey.Other.ShowChangeLogOnUpdate ]: boolean;
  [ SettingKey.Other.ShowAutoPausedNotification ]: boolean;
  [ SettingKey.Other.SiteBlacklist ]: string[];
  [ SettingKey.Other.ControlsPopupWidth ]: number;
  [ SettingKey.Other.ControlsPopupHeight ]: number;

  [ SettingKey.Controls.Other.DisplayControls ]: boolean;
  [ SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed ]: boolean;
  [ SettingKey.Controls.Other.HideControlsWhenIdle ]: boolean;
  [ SettingKey.Controls.Other.HideControlsIdleTime ]: number;
  [ SettingKey.Controls.Other.SkipBackwardAmount ]: number;
  [ SettingKey.Controls.Other.SkipForwardAmount ]: number;
  [ SettingKey.Controls.Other.DefaultPlaybackSpeed ]: number;

  [ SettingKey.Controls.MediaControls.Reset ]: string;
  [ SettingKey.Controls.MediaControls.MuchSlower ]: string;
  [ SettingKey.Controls.MediaControls.Slower ]: string;
  [ SettingKey.Controls.MediaControls.SkipBackward ]: string;
  [ SettingKey.Controls.MediaControls.PlayPause ]: string;
  [ SettingKey.Controls.MediaControls.SkipForward ]: string;
  [ SettingKey.Controls.MediaControls.Faster ]: string;
  [ SettingKey.Controls.MediaControls.MuchFaster ]: string;
  [ SettingKey.Controls.MediaControls.Loop ]: string;
  [ SettingKey.Controls.MediaControls.Fullscreen ]: string;

  [ SettingKey.Controls.OverlayControls.Reset ]: boolean;
  [ SettingKey.Controls.OverlayControls.MuchSlower ]: boolean;
  [ SettingKey.Controls.OverlayControls.Slower ]: boolean;
  [ SettingKey.Controls.OverlayControls.SkipBackward ]: boolean;
  [ SettingKey.Controls.OverlayControls.PlayPause ]: boolean;
  [ SettingKey.Controls.OverlayControls.SkipForward ]: boolean;
  [ SettingKey.Controls.OverlayControls.Faster ]: boolean;
  [ SettingKey.Controls.OverlayControls.MuchFaster ]: boolean;
  [ SettingKey.Controls.OverlayControls.Loop ]: boolean;
  [ SettingKey.Controls.OverlayControls.Fullscreen ]: boolean;
}

export type SettingsKey = (
  SettingKey.Notifications |
  SettingKey.ControllersEnabled |
  SettingKey.ControllerColors |
  SettingKey.OpenInExisting |
  SettingKey.Other |
  SettingKey.Controls.Other |
  SettingKey.Controls.MediaControls |
  SettingKey.Controls.OverlayControls
);

const DEFAULT_SETTINGS: SettingsType = {
  [ SettingKey.Notifications.AmazonMusic ]: true,
  [ SettingKey.Notifications.AmazonVideo ]: true,
  [ SettingKey.Notifications.Bandcamp ]: true,
  [ SettingKey.Notifications.GooglePlayMusic ]: true,
  [ SettingKey.Notifications.HboGo ]: true,
  [ SettingKey.Notifications.Hulu ]: true,
  [ SettingKey.Notifications.Netflix ]: true,
  [ SettingKey.Notifications.Pandora ]: true,
  [ SettingKey.Notifications.Spotify ]: true,
  [ SettingKey.Notifications.Twitch ]: true,
  [ SettingKey.Notifications.Youtube ]: true,
  [ SettingKey.Notifications.GenericAudioVideo ]: true,

  [ SettingKey.ControllersEnabled.AmazonMusic ]: true,
  [ SettingKey.ControllersEnabled.AmazonVideo ]: true,
  [ SettingKey.ControllersEnabled.Bandcamp ]: true,
  [ SettingKey.ControllersEnabled.GooglePlayMusic ]: true,
  [ SettingKey.ControllersEnabled.HboGo ]: true,
  [ SettingKey.ControllersEnabled.Hulu ]: true,
  [ SettingKey.ControllersEnabled.Netflix ]: true,
  [ SettingKey.ControllersEnabled.Pandora ]: true,
  [ SettingKey.ControllersEnabled.Spotify ]: true,
  [ SettingKey.ControllersEnabled.Twitch ]: true,
  [ SettingKey.ControllersEnabled.Youtube ]: true,
  [ SettingKey.ControllersEnabled.GenericAudioVideo ]: true,

  [ SettingKey.ControllerColors.AmazonMusic ]: '#fd7c02',
  [ SettingKey.ControllerColors.AmazonVideo ]: '#FF9900',
  [ SettingKey.ControllerColors.Bandcamp ]: '#639AA9',
  [ SettingKey.ControllerColors.GooglePlayMusic ]: '#ff5722',
  [ SettingKey.ControllerColors.HboGo ]: '#0f0f0f',
  [ SettingKey.ControllerColors.Hulu ]: '#66AA33',
  [ SettingKey.ControllerColors.Netflix ]: '#e50914',
  [ SettingKey.ControllerColors.Pandora ]: '#455774',
  [ SettingKey.ControllerColors.Spotify ]: '#84bd00',
  [ SettingKey.ControllerColors.Twitch ]: '#6441A4',
  [ SettingKey.ControllerColors.Youtube ]: '#f12b24',
  [ SettingKey.ControllerColors.GenericAudioVideo ]: '#5b5b5b',

  [ SettingKey.OpenInExisting.AmazonMusic ]: false,
  [ SettingKey.OpenInExisting.AmazonVideo ]: false,
  [ SettingKey.OpenInExisting.Bandcamp ]: false,
  [ SettingKey.OpenInExisting.GooglePlayMusic ]: false,
  [ SettingKey.OpenInExisting.HboGo ]: false,
  [ SettingKey.OpenInExisting.Hulu ]: false,
  [ SettingKey.OpenInExisting.Netflix ]: false,
  [ SettingKey.OpenInExisting.Pandora ]: false,
  [ SettingKey.OpenInExisting.Spotify ]: false,
  [ SettingKey.OpenInExisting.Twitch ]: false,
  [ SettingKey.OpenInExisting.Youtube ]: false,
  [ SettingKey.OpenInExisting.GenericAudioVideo ]: false,

  [ SettingKey.Other.NoActiveWindowNotifications ]: false,
  [ SettingKey.Other.DefaultSite ]: Sites.Youtube,
  [ SettingKey.Other.PauseOnLock ]: true,
  [ SettingKey.Other.PauseOnInactivity ]: false,
  [ SettingKey.Other.InactivityTimeout ]: 60 * 5,
  [ SettingKey.Other.AutoPauseEnabled ]: true,
  [ SettingKey.Other.ShowChangeLogOnUpdate ]: true,
  [ SettingKey.Other.ShowAutoPausedNotification ]: false,
  [ SettingKey.Other.SiteBlacklist ]: [ 'imgur.com' ],
  [ SettingKey.Other.ControlsPopupWidth ]: 315,
  [ SettingKey.Other.ControlsPopupHeight ]: 450,

  [ SettingKey.Controls.Other.DisplayControls ]: true,
  [ SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed ]: true,
  [ SettingKey.Controls.Other.HideControlsWhenIdle ]: true,
  [ SettingKey.Controls.Other.HideControlsIdleTime ]: 5,
  [ SettingKey.Controls.Other.SkipBackwardAmount ]: 10,
  [ SettingKey.Controls.Other.SkipForwardAmount ]: 10,
  [ SettingKey.Controls.Other.DefaultPlaybackSpeed ]: 1.0,

  [ SettingKey.Controls.MediaControls.Reset ]: '',
  [ SettingKey.Controls.MediaControls.MuchSlower ]: '',
  [ SettingKey.Controls.MediaControls.Slower ]: '',
  [ SettingKey.Controls.MediaControls.SkipBackward ]: '',
  [ SettingKey.Controls.MediaControls.PlayPause ]: '',
  [ SettingKey.Controls.MediaControls.SkipForward ]: '',
  [ SettingKey.Controls.MediaControls.Faster ]: '',
  [ SettingKey.Controls.MediaControls.MuchFaster ]: '',
  [ SettingKey.Controls.MediaControls.Loop ]: '',
  [ SettingKey.Controls.MediaControls.Fullscreen ]: '',

  [ SettingKey.Controls.OverlayControls.Reset ]: true,
  [ SettingKey.Controls.OverlayControls.MuchSlower ]: true,
  [ SettingKey.Controls.OverlayControls.Slower ]: true,
  [ SettingKey.Controls.OverlayControls.SkipBackward ]: true,
  [ SettingKey.Controls.OverlayControls.PlayPause ]: true,
  [ SettingKey.Controls.OverlayControls.SkipForward ]: true,
  [ SettingKey.Controls.OverlayControls.Faster ]: true,
  [ SettingKey.Controls.OverlayControls.MuchFaster ]: true,
  [ SettingKey.Controls.OverlayControls.Loop ]: true,
  [ SettingKey.Controls.OverlayControls.Fullscreen ]: true,
};

const SITE_TO_URL: { [ key in Sites ]: string } = {
  AmazonMusic: 'https://music.amazon.com/',
  AmazonVideo: 'https://www.amazon.com/gp/video/getstarted/',
  Bandcamp: 'https://bandcamp.com/',
  GooglePlayMusic: 'https://play.google.com/music/',
  HboGo: 'https://play.hbogo.com/',
  Hulu: 'http://www.hulu.com/',
  Netflix: 'https://www.netflix.com/',
  Pandora: 'http://www.pandora.com/',
  Spotify: 'https://play.spotify.com/',
  Twitch: 'https://www.twitch.tv/',
  Youtube: 'https://www.youtube.com/',
  GenericAudioVideo: '',
};

export function siteToUrl( site: Sites )
{
  let url = SITE_TO_URL[ site ];
  if( url )
  {
    return url;
  }
  else
  {
    return '';
  }
}

class SettingsStorage
{
  private cache: SettingsType = {
    ...DEFAULT_SETTINGS
  };

  private initializingPromise: Promise<void> | null = null;

  public initialize( onChange?: () => void ): Promise<void>
  {
    if( this.initializingPromise === null )
    {
      this.initializingPromise = new Promise( ( resolve, reject ) =>
      {
        chrome.storage.sync.get( DEFAULT_SETTINGS, ( items ) =>
        {
          if( chrome.runtime.lastError )
          {
            console.error( 'Failed to retrieve SettingKey:', chrome.runtime.lastError );
            return reject( chrome.runtime.lastError );
          }

          this.cache = {
            ...this.cache,
            ...items
          };

          resolve();
        } );
      } );

      chrome.storage.onChanged.addListener( ( items ) =>
      {
        for( let key of Object.keys( items ) as SettingsKey[] )
        {
          let { oldValue, newValue } = items[ key ];

          if( key in this.cache )
          {
            console.log( 'Setting Changed -', key, ':', oldValue, '->', newValue );
            this.cache[ key ] = newValue;
          }
          else
          {
            console.log( 'Unknown Storage Changed -', key, ':', oldValue, '->', newValue );
          }
        }
      } );
    }

    if( onChange )
    {
      this.initializingPromise.then( onChange );
      chrome.storage.onChanged.addListener( onChange );
    }

    return this.initializingPromise;
  }

  public addOnChangeListener( callback: () => void )
  {
    chrome.storage.onChanged.addListener( callback );
  }

  public removeOnChangeListener( callback: () => void )
  {
    chrome.storage.onChanged.removeListener( callback );
  }

  public get<K extends SettingsKey>( setting: K ): SettingsType[ K ]
  {
    if( typeof this.cache[ setting ] !== typeof DEFAULT_SETTINGS[ setting ] )
    {
      console.warn( 'Stored setting type is invalid -', setting, ':', this.cache[ setting ] );
      return DEFAULT_SETTINGS[ setting ];
    }
    else
    {
      return this.cache[ setting ];
    }
  }

  public set<K extends SettingsKey>( setting: K, value: SettingsType[ K ] )
  {
    if( typeof value !== typeof DEFAULT_SETTINGS[ setting ] )
    {
      console.error( 'Invalid type -', setting, ':', value );
      return;
    }

    this.cache[ setting ] = value;
    chrome.storage.sync.set( { [ setting ]: value }, () =>
    {
      if( chrome.runtime.lastError )
      {
        console.error( 'Failed to save setting:', setting, chrome.runtime.lastError );
      }
    } );
  }

  public reset()
  {
    this.cache = { ...DEFAULT_SETTINGS };
    chrome.storage.sync.set( this.cache, () =>
    {
      if( chrome.runtime.lastError )
      {
        console.error( 'Failed to reset SettingKey:', chrome.runtime.lastError );
      }
    } );
  }
}

export const settings = new SettingsStorage();
