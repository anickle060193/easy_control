export namespace Settings
{
  export const enum Notifications
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

  export const enum ControllersEnabled
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

  export const enum ControllerColors
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

  export const enum OpenInExisting
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
    NotificationLength = 'key__notification_length',
    NoActiveWindowNotifications = 'key__no_active_window_notifications',
    DefaultSite = 'key__default_site',
    PauseOnLock = 'key__pause_on_lock',
    PauseOnInactivity = 'key__pause_on_inactivity',
    InactivityTimeout = 'key__inactivity_timeout',
    AutoPauseEnabled = 'key__auto_pause_enabled',
    ShowChangeLogOnUpdate = 'key__show_change_log_on_update',
    ShowAutoPausedNotification = 'key__show_auto_paused_notification',
    SiteBlacklist = 'key__site_blacklist',
  }

  export namespace Controls
  {
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

export const enum Sites
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
  [ Settings.Notifications.Pandora ]: boolean;
  [ Settings.Notifications.Spotify ]: boolean;
  [ Settings.Notifications.Youtube ]: boolean;
  [ Settings.Notifications.GooglePlayMusic ]: boolean;
  [ Settings.Notifications.Bandcamp ]: boolean;
  [ Settings.Notifications.Netflix ]: boolean;
  [ Settings.Notifications.AmazonVideo ]: boolean;
  [ Settings.Notifications.AmazonMusic ]: boolean;
  [ Settings.Notifications.Hulu ]: boolean;
  [ Settings.Notifications.GenericAudioVideo ]: boolean;
  [ Settings.Notifications.Twitch ]: boolean;

  [ Settings.ControllersEnabled.Pandora ]: boolean;
  [ Settings.ControllersEnabled.Spotify ]: boolean;
  [ Settings.ControllersEnabled.Youtube ]: boolean;
  [ Settings.ControllersEnabled.GooglePlayMusic ]: boolean;
  [ Settings.ControllersEnabled.Bandcamp ]: boolean;
  [ Settings.ControllersEnabled.Netflix ]: boolean;
  [ Settings.ControllersEnabled.AmazonVideo ]: boolean;
  [ Settings.ControllersEnabled.AmazonMusic ]: boolean;
  [ Settings.ControllersEnabled.Hulu ]: boolean;
  [ Settings.ControllersEnabled.GenericAudioVideo ]: boolean;
  [ Settings.ControllersEnabled.Twitch ]: boolean;

  [ Settings.ControllerColors.Pandora ]: string;
  [ Settings.ControllerColors.Spotify ]: string;
  [ Settings.ControllerColors.Youtube ]: string;
  [ Settings.ControllerColors.GooglePlayMusic ]: string;
  [ Settings.ControllerColors.Bandcamp ]: string;
  [ Settings.ControllerColors.Netflix ]: string;
  [ Settings.ControllerColors.AmazonVideo ]: string;
  [ Settings.ControllerColors.AmazonMusic ]: string;
  [ Settings.ControllerColors.Hulu ]: string;
  [ Settings.ControllerColors.GenericAudioVideo ]: string;
  [ Settings.ControllerColors.Twitch ]: string;

  [ Settings.OpenInExisting.Pandora ]: boolean;
  [ Settings.OpenInExisting.Spotify ]: boolean;
  [ Settings.OpenInExisting.Youtube ]: boolean;
  [ Settings.OpenInExisting.GooglePlayMusic ]: boolean;
  [ Settings.OpenInExisting.Bandcamp ]: boolean;
  [ Settings.OpenInExisting.Netflix ]: boolean;
  [ Settings.OpenInExisting.AmazonVideo ]: boolean;
  [ Settings.OpenInExisting.AmazonMusic ]: boolean;
  [ Settings.OpenInExisting.Hulu ]: boolean;
  [ Settings.OpenInExisting.GenericAudioVideo ]: boolean;
  [ Settings.OpenInExisting.Twitch ]: boolean;

  [ Settings.Other.NotificationLength ]: number;
  [ Settings.Other.NoActiveWindowNotifications ]: boolean;
  [ Settings.Other.DefaultSite ]: Sites;
  [ Settings.Other.PauseOnLock ]: boolean;
  [ Settings.Other.PauseOnInactivity ]: boolean;
  [ Settings.Other.InactivityTimeout ]: number;
  [ Settings.Other.AutoPauseEnabled ]: boolean;
  [ Settings.Other.ShowChangeLogOnUpdate ]: boolean;
  [ Settings.Other.ShowAutoPausedNotification ]: boolean;
  [ Settings.Other.SiteBlacklist ]: string[];

  [ Settings.Controls.Other.DisplayControls ]: boolean;
  [ Settings.Controls.Other.AlwaysDisplayPlaybackSpeed ]: boolean;
  [ Settings.Controls.Other.HideControlsWhenIdle ]: boolean;
  [ Settings.Controls.Other.HideControlsIdleTime ]: number;
  [ Settings.Controls.Other.SkipBackwardAmount ]: number;
  [ Settings.Controls.Other.SkipForwardAmount ]: number;

  [ Settings.Controls.MediaControls.MuchSlower ]: string;
  [ Settings.Controls.MediaControls.Slower ]: string;
  [ Settings.Controls.MediaControls.SkipBackward ]: string;
  [ Settings.Controls.MediaControls.PlayPause ]: string;
  [ Settings.Controls.MediaControls.SkipForward ]: string;
  [ Settings.Controls.MediaControls.Faster ]: string;
  [ Settings.Controls.MediaControls.MuchFaster ]: string;
  [ Settings.Controls.MediaControls.Reset ]: string;
  [ Settings.Controls.MediaControls.Loop ]: string;
  [ Settings.Controls.MediaControls.Fullscreen ]: string;

  [ Settings.Controls.OverlayControls.MuchSlower ]: boolean;
  [ Settings.Controls.OverlayControls.Slower ]: boolean;
  [ Settings.Controls.OverlayControls.SkipBackward ]: boolean;
  [ Settings.Controls.OverlayControls.PlayPause ]: boolean;
  [ Settings.Controls.OverlayControls.SkipForward ]: boolean;
  [ Settings.Controls.OverlayControls.Faster ]: boolean;
  [ Settings.Controls.OverlayControls.MuchFaster ]: boolean;
  [ Settings.Controls.OverlayControls.Reset ]: boolean,
  [ Settings.Controls.OverlayControls.Loop ]: boolean;
  [ Settings.Controls.OverlayControls.Fullscreen ]: boolean;
}

export type SettingsKey = (
  Settings.Notifications |
  Settings.ControllersEnabled |
  Settings.ControllerColors |
  Settings.OpenInExisting |
  Settings.Other |
  Settings.Controls.Other |
  Settings.Controls.MediaControls |
  Settings.Controls.OverlayControls
);

const DEFAULT_SETTINGS: SettingsType = {
  [ Settings.Notifications.Pandora ]: true,
  [ Settings.Notifications.Spotify ]: true,
  [ Settings.Notifications.Youtube ]: true,
  [ Settings.Notifications.GooglePlayMusic ]: true,
  [ Settings.Notifications.Bandcamp ]: true,
  [ Settings.Notifications.Netflix ]: true,
  [ Settings.Notifications.AmazonVideo ]: true,
  [ Settings.Notifications.AmazonMusic ]: true,
  [ Settings.Notifications.Hulu ]: true,
  [ Settings.Notifications.GenericAudioVideo ]: true,
  [ Settings.Notifications.Twitch ]: true,

  [ Settings.ControllersEnabled.Pandora ]: true,
  [ Settings.ControllersEnabled.Spotify ]: true,
  [ Settings.ControllersEnabled.Youtube ]: true,
  [ Settings.ControllersEnabled.GooglePlayMusic ]: true,
  [ Settings.ControllersEnabled.Bandcamp ]: true,
  [ Settings.ControllersEnabled.Netflix ]: true,
  [ Settings.ControllersEnabled.AmazonVideo ]: true,
  [ Settings.ControllersEnabled.AmazonMusic ]: true,
  [ Settings.ControllersEnabled.Hulu ]: true,
  [ Settings.ControllersEnabled.GenericAudioVideo ]: true,
  [ Settings.ControllersEnabled.Twitch ]: true,

  [ Settings.ControllerColors.Pandora ]: '#455774',
  [ Settings.ControllerColors.Spotify ]: '#84bd00',
  [ Settings.ControllerColors.Youtube ]: '#f12b24',
  [ Settings.ControllerColors.GooglePlayMusic ]: '#ff5722',
  [ Settings.ControllerColors.Bandcamp ]: '#639AA9',
  [ Settings.ControllerColors.Netflix ]: '#9b0103',
  [ Settings.ControllerColors.AmazonVideo ]: '#FF9900',
  [ Settings.ControllerColors.AmazonMusic ]: '#fd7c02',
  [ Settings.ControllerColors.Hulu ]: '#66AA33',
  [ Settings.ControllerColors.GenericAudioVideo ]: '#5b5b5b',
  [ Settings.ControllerColors.Twitch ]: '#6441A4',

  [ Settings.OpenInExisting.Pandora ]: false,
  [ Settings.OpenInExisting.Spotify ]: false,
  [ Settings.OpenInExisting.Youtube ]: false,
  [ Settings.OpenInExisting.GooglePlayMusic ]: false,
  [ Settings.OpenInExisting.Bandcamp ]: false,
  [ Settings.OpenInExisting.Netflix ]: false,
  [ Settings.OpenInExisting.AmazonVideo ]: false,
  [ Settings.OpenInExisting.AmazonMusic ]: false,
  [ Settings.OpenInExisting.Hulu ]: false,
  [ Settings.OpenInExisting.GenericAudioVideo ]: false,
  [ Settings.OpenInExisting.Twitch ]: false,

  [ Settings.Other.NotificationLength ]: 5,
  [ Settings.Other.NoActiveWindowNotifications ]: false,
  [ Settings.Other.DefaultSite ]: Sites.Youtube,
  [ Settings.Other.PauseOnLock ]: true,
  [ Settings.Other.PauseOnInactivity ]: false,
  [ Settings.Other.InactivityTimeout ]: 60 * 5,
  [ Settings.Other.AutoPauseEnabled ]: true,
  [ Settings.Other.ShowChangeLogOnUpdate ]: true,
  [ Settings.Other.ShowAutoPausedNotification ]: false,
  [ Settings.Other.SiteBlacklist ]: [ 'imgur.com' ],

  [ Settings.Controls.Other.DisplayControls ]: true,
  [ Settings.Controls.Other.AlwaysDisplayPlaybackSpeed ]: true,
  [ Settings.Controls.Other.HideControlsWhenIdle ]: true,
  [ Settings.Controls.Other.HideControlsIdleTime ]: 5,
  [ Settings.Controls.Other.SkipBackwardAmount ]: 10,
  [ Settings.Controls.Other.SkipForwardAmount ]: 10,

  [ Settings.Controls.MediaControls.MuchSlower ]: '',
  [ Settings.Controls.MediaControls.Slower ]: 's',
  [ Settings.Controls.MediaControls.SkipBackward ]: '',
  [ Settings.Controls.MediaControls.PlayPause ]: '',
  [ Settings.Controls.MediaControls.SkipForward ]: '',
  [ Settings.Controls.MediaControls.Faster ]: 'd',
  [ Settings.Controls.MediaControls.MuchFaster ]: '',
  [ Settings.Controls.MediaControls.Reset ]: 'r',
  [ Settings.Controls.MediaControls.Loop ]: '',
  [ Settings.Controls.MediaControls.Fullscreen ]: '',

  [ Settings.Controls.OverlayControls.MuchSlower ]: true,
  [ Settings.Controls.OverlayControls.Slower ]: true,
  [ Settings.Controls.OverlayControls.SkipBackward ]: true,
  [ Settings.Controls.OverlayControls.PlayPause ]: true,
  [ Settings.Controls.OverlayControls.SkipForward ]: true,
  [ Settings.Controls.OverlayControls.Faster ]: true,
  [ Settings.Controls.OverlayControls.MuchFaster ]: true,
  [ Settings.Controls.OverlayControls.Reset ]: true,
  [ Settings.Controls.OverlayControls.Loop ]: true,
  [ Settings.Controls.OverlayControls.Fullscreen ]: true,
};

const SITE_TO_URL: { [ key in Sites ]: string } = {
  Pandora: "http://www.pandora.com/",
  Spotify: "https://play.spotify.com/",
  Youtube: "https://www.youtube.com/",
  GooglePlayMusic: "https://play.google.com/music/",
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
    return "";
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
            console.error( 'Failed to retrieve settings:', chrome.runtime.lastError );
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
            this.cache[ key ] = newValue
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
        console.error( 'Failed to reset settings:', chrome.runtime.lastError );
      }
    } );
  }
}

export const settings = new SettingsStorage();
