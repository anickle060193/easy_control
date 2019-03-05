export namespace SettingKey
{
  export enum Notifications
  {
    Pandora = 'key__notifications__pandora',
    Spotify = 'key__notifications__spotify',
    Youtube = 'key__notifications__youtube',
    GooglePlayMusic = 'key__notifications__google_play_music',
    Bandcamp = 'key__notifications__bandcamp',
    Netflix = 'key__notifications__netflix',
    AmazonVideo = 'key__notifications__amazon_video',
    AmazonMusic = 'key__notifications__amazon_music',
    Hulu = 'key__notifications__hulu',
    GenericAudioVideo = 'key__notifications__generic_audio_video',
    Twitch = 'key__notifications__twitch',
  }

  export enum ControllersEnabled
  {
    Pandora = 'key__controllers_enabled__pandora',
    Spotify = 'key__controllers_enabled__spotify',
    Youtube = 'key__controllers_enabled__youtube',
    GooglePlayMusic = 'key__controllers_enabled__google_play_music',
    Bandcamp = 'key__controllers_enabled__bandcamp',
    Netflix = 'key__controllers_enabled__netflix',
    AmazonVideo = 'key__controllers_enabled__amazon_video',
    AmazonMusic = 'key__controllers_enabled__amazon_music',
    Hulu = 'key__controllers_enabled__hulu',
    GenericAudioVideo = 'key__controllers_enabled__generic_audio_video',
    Twitch = 'key__controllers_enabled__twitch',
  }

  export enum ControllerColors
  {
    Pandora = 'key__controller_colors__pandora',
    Spotify = 'key__controller_colors__spotify',
    Youtube = 'key__controller_colors__youtube',
    GooglePlayMusic = 'key__controller_colors__google_play_music',
    Bandcamp = 'key__controller_colors__bandcamp',
    Netflix = 'key__controller_colors__netflix',
    AmazonVideo = 'key__controller_colors__amazon_video',
    AmazonMusic = 'key__controller_colors__amazon_music',
    Hulu = 'key__controller_colors__hulu',
    GenericAudioVideo = 'key__controller_colors__generic_audio_video',
    Twitch = 'key__controller_colors__twitch',
  }

  export enum OpenInExisting
  {
    Pandora = 'key__open_in_existing__pandora',
    Spotify = 'key__open_in_existing__spotify',
    Youtube = 'key__open_in_existing__youtube',
    GooglePlayMusic = 'key__open_in_existing__google_play_music',
    Bandcamp = 'key__open_in_existing__bandcamp',
    Netflix = 'key__open_in_existing__netflix',
    AmazonVideo = 'key__open_in_existing__amazon_video',
    AmazonMusic = 'key__open_in_existing__amazon_music',
    Hulu = 'key__open_in_existing__hulu',
    GenericAudioVideo = 'key__open_in_existing__generic_audio_video',
    Twitch = 'key__open_in_existing__twitch',
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
    }

    export const enum MediaControls
    {
      MuchSlower = 'key__controls__playback_speed__much_slower',
      Slower = 'key__controls__playback_speed__slower',
      SkipBackward = 'key__controls__media_controls__skip_backward',
      PlayPause = 'key__controls__media_controls__play_pause',
      SkipForward = 'key__controls__media_controls__skip_forward',
      Faster = 'key__controls__playback_speed__faster',
      MuchFaster = 'key__controls__playback_speed__much_faster',
      Reset = 'key__controls__playback_speed__reset',
      Loop = 'key__controls__playback_speed__loop',
      Fullscreen = 'key__controls__media_controls__fullscreen',
    }

    export const enum OverlayControls
    {
      MuchSlower = 'key__controls__overlay_controls__much_slower',
      Slower = 'key__controls__overlay_controls__slower',
      SkipBackward = 'key__controls__overlay_controls__skip_backward',
      PlayPause = 'key__controls__overlay_controls__play_pause',
      SkipForward = 'key__controls__overlay_controls__skip_forward',
      Faster = 'key__controls__overlay_controls__faster',
      MuchFaster = 'key__controls__overlay_controls__much_faster',
      Reset = 'key__controls__overlay_controls__reset',
      Loop = 'key__controls__overlay_controls__loop',
      Fullscreen = 'key__controls__overlay_controls__fullscreen',
    }
  }
}

export enum Sites
{
  Pandora = 'Pandora',
  Spotify = 'Spotify',
  Youtube = 'Youtube',
  GooglePlayMusic = 'GooglePlayMusic',
  Bandcamp = 'Bandcamp',
  Netflix = 'Netflix',
  AmazonVideo = 'AmazonVideo',
  AmazonMusic = 'AmazonMusic',
  Hulu = 'Hulu',
  GenericAudioVideo = 'GenericAudioVideo',
  Twitch = 'Twitch',
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
  [ SettingKey.Notifications.Pandora ]: boolean;
  [ SettingKey.Notifications.Spotify ]: boolean;
  [ SettingKey.Notifications.Youtube ]: boolean;
  [ SettingKey.Notifications.GooglePlayMusic ]: boolean;
  [ SettingKey.Notifications.Bandcamp ]: boolean;
  [ SettingKey.Notifications.Netflix ]: boolean;
  [ SettingKey.Notifications.AmazonVideo ]: boolean;
  [ SettingKey.Notifications.AmazonMusic ]: boolean;
  [ SettingKey.Notifications.Hulu ]: boolean;
  [ SettingKey.Notifications.GenericAudioVideo ]: boolean;
  [ SettingKey.Notifications.Twitch ]: boolean;

  [ SettingKey.ControllersEnabled.Pandora ]: boolean;
  [ SettingKey.ControllersEnabled.Spotify ]: boolean;
  [ SettingKey.ControllersEnabled.Youtube ]: boolean;
  [ SettingKey.ControllersEnabled.GooglePlayMusic ]: boolean;
  [ SettingKey.ControllersEnabled.Bandcamp ]: boolean;
  [ SettingKey.ControllersEnabled.Netflix ]: boolean;
  [ SettingKey.ControllersEnabled.AmazonVideo ]: boolean;
  [ SettingKey.ControllersEnabled.AmazonMusic ]: boolean;
  [ SettingKey.ControllersEnabled.Hulu ]: boolean;
  [ SettingKey.ControllersEnabled.GenericAudioVideo ]: boolean;
  [ SettingKey.ControllersEnabled.Twitch ]: boolean;

  [ SettingKey.ControllerColors.Pandora ]: string;
  [ SettingKey.ControllerColors.Spotify ]: string;
  [ SettingKey.ControllerColors.Youtube ]: string;
  [ SettingKey.ControllerColors.GooglePlayMusic ]: string;
  [ SettingKey.ControllerColors.Bandcamp ]: string;
  [ SettingKey.ControllerColors.Netflix ]: string;
  [ SettingKey.ControllerColors.AmazonVideo ]: string;
  [ SettingKey.ControllerColors.AmazonMusic ]: string;
  [ SettingKey.ControllerColors.Hulu ]: string;
  [ SettingKey.ControllerColors.GenericAudioVideo ]: string;
  [ SettingKey.ControllerColors.Twitch ]: string;

  [ SettingKey.OpenInExisting.Pandora ]: boolean;
  [ SettingKey.OpenInExisting.Spotify ]: boolean;
  [ SettingKey.OpenInExisting.Youtube ]: boolean;
  [ SettingKey.OpenInExisting.GooglePlayMusic ]: boolean;
  [ SettingKey.OpenInExisting.Bandcamp ]: boolean;
  [ SettingKey.OpenInExisting.Netflix ]: boolean;
  [ SettingKey.OpenInExisting.AmazonVideo ]: boolean;
  [ SettingKey.OpenInExisting.AmazonMusic ]: boolean;
  [ SettingKey.OpenInExisting.Hulu ]: boolean;
  [ SettingKey.OpenInExisting.GenericAudioVideo ]: boolean;
  [ SettingKey.OpenInExisting.Twitch ]: boolean;

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

  [ SettingKey.Controls.MediaControls.MuchSlower ]: string;
  [ SettingKey.Controls.MediaControls.Slower ]: string;
  [ SettingKey.Controls.MediaControls.SkipBackward ]: string;
  [ SettingKey.Controls.MediaControls.PlayPause ]: string;
  [ SettingKey.Controls.MediaControls.SkipForward ]: string;
  [ SettingKey.Controls.MediaControls.Faster ]: string;
  [ SettingKey.Controls.MediaControls.MuchFaster ]: string;
  [ SettingKey.Controls.MediaControls.Reset ]: string;
  [ SettingKey.Controls.MediaControls.Loop ]: string;
  [ SettingKey.Controls.MediaControls.Fullscreen ]: string;

  [ SettingKey.Controls.OverlayControls.MuchSlower ]: boolean;
  [ SettingKey.Controls.OverlayControls.Slower ]: boolean;
  [ SettingKey.Controls.OverlayControls.SkipBackward ]: boolean;
  [ SettingKey.Controls.OverlayControls.PlayPause ]: boolean;
  [ SettingKey.Controls.OverlayControls.SkipForward ]: boolean;
  [ SettingKey.Controls.OverlayControls.Faster ]: boolean;
  [ SettingKey.Controls.OverlayControls.MuchFaster ]: boolean;
  [ SettingKey.Controls.OverlayControls.Reset ]: boolean;
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
  [ SettingKey.Notifications.Pandora ]: true,
  [ SettingKey.Notifications.Spotify ]: true,
  [ SettingKey.Notifications.Youtube ]: true,
  [ SettingKey.Notifications.GooglePlayMusic ]: true,
  [ SettingKey.Notifications.Bandcamp ]: true,
  [ SettingKey.Notifications.Netflix ]: true,
  [ SettingKey.Notifications.AmazonVideo ]: true,
  [ SettingKey.Notifications.AmazonMusic ]: true,
  [ SettingKey.Notifications.Hulu ]: true,
  [ SettingKey.Notifications.GenericAudioVideo ]: true,
  [ SettingKey.Notifications.Twitch ]: true,

  [ SettingKey.ControllersEnabled.Pandora ]: true,
  [ SettingKey.ControllersEnabled.Spotify ]: true,
  [ SettingKey.ControllersEnabled.Youtube ]: true,
  [ SettingKey.ControllersEnabled.GooglePlayMusic ]: true,
  [ SettingKey.ControllersEnabled.Bandcamp ]: true,
  [ SettingKey.ControllersEnabled.Netflix ]: true,
  [ SettingKey.ControllersEnabled.AmazonVideo ]: true,
  [ SettingKey.ControllersEnabled.AmazonMusic ]: true,
  [ SettingKey.ControllersEnabled.Hulu ]: true,
  [ SettingKey.ControllersEnabled.GenericAudioVideo ]: true,
  [ SettingKey.ControllersEnabled.Twitch ]: true,

  [ SettingKey.ControllerColors.Pandora ]: '#455774',
  [ SettingKey.ControllerColors.Spotify ]: '#84bd00',
  [ SettingKey.ControllerColors.Youtube ]: '#f12b24',
  [ SettingKey.ControllerColors.GooglePlayMusic ]: '#ff5722',
  [ SettingKey.ControllerColors.Bandcamp ]: '#639AA9',
  [ SettingKey.ControllerColors.Netflix ]: '#e50914',
  [ SettingKey.ControllerColors.AmazonVideo ]: '#FF9900',
  [ SettingKey.ControllerColors.AmazonMusic ]: '#fd7c02',
  [ SettingKey.ControllerColors.Hulu ]: '#66AA33',
  [ SettingKey.ControllerColors.GenericAudioVideo ]: '#5b5b5b',
  [ SettingKey.ControllerColors.Twitch ]: '#6441A4',

  [ SettingKey.OpenInExisting.Pandora ]: false,
  [ SettingKey.OpenInExisting.Spotify ]: false,
  [ SettingKey.OpenInExisting.Youtube ]: false,
  [ SettingKey.OpenInExisting.GooglePlayMusic ]: false,
  [ SettingKey.OpenInExisting.Bandcamp ]: false,
  [ SettingKey.OpenInExisting.Netflix ]: false,
  [ SettingKey.OpenInExisting.AmazonVideo ]: false,
  [ SettingKey.OpenInExisting.AmazonMusic ]: false,
  [ SettingKey.OpenInExisting.Hulu ]: false,
  [ SettingKey.OpenInExisting.GenericAudioVideo ]: false,
  [ SettingKey.OpenInExisting.Twitch ]: false,

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

  [ SettingKey.Controls.MediaControls.MuchSlower ]: '',
  [ SettingKey.Controls.MediaControls.Slower ]: 's',
  [ SettingKey.Controls.MediaControls.SkipBackward ]: '',
  [ SettingKey.Controls.MediaControls.PlayPause ]: '',
  [ SettingKey.Controls.MediaControls.SkipForward ]: '',
  [ SettingKey.Controls.MediaControls.Faster ]: 'd',
  [ SettingKey.Controls.MediaControls.MuchFaster ]: '',
  [ SettingKey.Controls.MediaControls.Reset ]: 'r',
  [ SettingKey.Controls.MediaControls.Loop ]: '',
  [ SettingKey.Controls.MediaControls.Fullscreen ]: '',

  [ SettingKey.Controls.OverlayControls.MuchSlower ]: true,
  [ SettingKey.Controls.OverlayControls.Slower ]: true,
  [ SettingKey.Controls.OverlayControls.SkipBackward ]: true,
  [ SettingKey.Controls.OverlayControls.PlayPause ]: true,
  [ SettingKey.Controls.OverlayControls.SkipForward ]: true,
  [ SettingKey.Controls.OverlayControls.Faster ]: true,
  [ SettingKey.Controls.OverlayControls.MuchFaster ]: true,
  [ SettingKey.Controls.OverlayControls.Reset ]: true,
  [ SettingKey.Controls.OverlayControls.Loop ]: true,
  [ SettingKey.Controls.OverlayControls.Fullscreen ]: true,
};

const SITE_TO_URL: { [ key in Sites ]: string } = {
  Pandora: 'http://www.pandora.com/',
  Spotify: 'https://play.spotify.com/',
  Youtube: 'https://www.youtube.com/',
  GooglePlayMusic: 'https://play.google.com/music/',
  Bandcamp: 'https://bandcamp.com/',
  Netflix: 'https://www.netflix.com/',
  AmazonVideo: 'https://www.amazon.com/gp/video/getstarted/',
  AmazonMusic: 'https://music.amazon.com/',
  Hulu: 'http://www.hulu.com/',
  GenericAudioVideo: '',
  Twitch: 'https://www.twitch.tv/'
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
