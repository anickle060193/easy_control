var Settings = {
    Notifications : {
        Pandora : 'key__notifications__pandora',
        Spotify : 'key__notifications__spotify',
        Youtube : 'key__notifications__youtube',
        GooglePlayMusic : 'key__notifications__google_play_music',
        Bandcamp : 'key__notifications__bandcamp',
        Netflix : 'key__notifications__netflix',
        AmazonVideo : 'key__notifications__amazon_video',
        AmazonMusic : 'key__notifications__amazon_music',
        Hulu : 'key__notifications__hulu',
        GenericAudioVideo : 'key__notifications__generic_audio_video',
        Twitch : 'key__notifications__twitch'
    },
    ControllersEnabled : {
        Pandora : 'key__controllers_enabled__pandora',
        Spotify : 'key__controllers_enabled__spotify',
        Youtube : 'key__controllers_enabled__youtube',
        GooglePlayMusic : 'key__controllers_enabled__google_play_music',
        Bandcamp : 'key__controllers_enabled__bandcamp',
        Netflix : 'key__controllers_enabled__netflix',
        AmazonVideo : 'key__controllers_enabled__amazon_video',
        AmazonMusic : 'key__controllers_enabled__amazon_music',
        Hulu : 'key__controllers_enabled__hulu',
        GenericAudioVideo : 'key__controllers_enabled__generic_audio_video',
        Twitch : 'key__controllers_enabled__twitch'
    },
    ControllerColors : {
        Pandora : 'key__controller_colors__pandora',
        Spotify : 'key__controller_colors__spotify',
        Youtube : 'key__controller_colors__youtube',
        GooglePlayMusic : 'key__controller_colors__google_play_music',
        Bandcamp : 'key__controller_colors__bandcamp',
        Netflix : 'key__controller_colors__netflix',
        AmazonVideo : 'key__controller_colors__amazon_video',
        AmazonMusic : 'key__controller_colors__amazon_music',
        Hulu : 'key__controller_colors__hulu',
        GenericAudioVideo : 'key__controller_colors__generic_audio_video',
        Twitch : 'key__controller_colors__twitch'
    },
    NotificationLength : 'key__notification_length',
    NoActiveWindowNotifications : 'key__no_active_window_notifications',
    DefaultSite : 'key__default_site',
    PauseOnLock : 'key__pause_on_lock',
    PauseOnInactivity : 'key__pause_on_inactivity',
    InactivityTimeout : 'key__inactivity_timeout',
    AutoPauseEnabled : 'key__auto_pause_enabled',
    ShowChangeLogOnUpdate : 'key__show_change_log_on_update',
    ShowAutoPausedNotification : 'key__show_auto_paused_notification',
    SiteBlacklist : 'key__site_blacklist',
    Controls : {
        DisplayControls : 'key__controls__display_controls',
        AlwaysDisplayPlaybackSpeed : 'key__controls__always_display_playback_speed',
        MediaControls : {
            MuchSlower : 'key__controls__playback_speed__much_slower',
            Slower : 'key__controls__playback_speed__slower',
            Faster : 'key__controls__playback_speed__faster',
            MuchFaster : 'key__controls__playback_speed__much_faster',
            Reset : 'key__controls__playback_speed__reset',
            Loop : 'key__controls__playback_speed__loop'
        }
    }
};


var siteToURL = {
    Pandora : "http://www.pandora.com/",
    Spotify : "https://play.spotify.com/",
    Youtube : "https://www.youtube.com/",
    GooglePlayMusic : "https://play.google.com/music/",
    Bandcamp : 'https://bandcamp.com/',
    Netflix : 'https://www.netflix.com/',
    AmazonVideo : 'https://www.amazon.com/gp/video/getstarted/',
    AmazonMusic : 'https://music.amazon.com/',
    Hulu : 'http://www.hulu.com/',
    Twitch : 'https://www.twitch.tv/'
};


function Message( type, data )
{
    this.type = type;
    this.data = data;
}

Message.types = {
    to_background : {
        INITIALIZE : 'to_background.initialize',
        NEW_CONTENT : 'to_background.new_content',
        STATUS : 'to_background.status'
    },
    from_background : {
        PAUSE : 'from_background.pause',
        PLAY : 'from_background.play',
        NEXT : 'from_background.next',
        PREVIOUS : 'from_background.previous',
        LIKE : 'from_background.like',
        UNLIKE : 'from_background.unlike',
        DISLIKE : 'from_background.dislike',
        UNDISLIKE : 'from_background.undislike',
        VOLUME_UP : 'from_background.volume_up',
        VOLUME_DOWN : 'from_background.volume_down'
    },
    from_popup : {
        PAUSE : 'from_popup.pause',
        PLAY : 'from_popup.play',
        NEXT : 'from_popup.next',
        PREVIOUS : 'from_popup.previous',
        LIKE : 'from_popup.like',
        UNLIKE : 'from_popup.unlike',
        DISLIKE : 'from_popup.dislike',
        UNDISLIKE : 'from_popup.undislike'
    }
}


function getDefaultSettings()
{
    var defaults = { };

    defaults[ Settings.Notifications.Pandora ] = true;
    defaults[ Settings.Notifications.Spotify ] = true;
    defaults[ Settings.Notifications.Youtube ] = true;
    defaults[ Settings.Notifications.GooglePlayMusic ] = true;
    defaults[ Settings.Notifications.Bandcamp ] = true;
    defaults[ Settings.Notifications.Netflix ] = true;
    defaults[ Settings.Notifications.AmazonVideo ] = true;
    defaults[ Settings.Notifications.AmazonMusic ] = true;
    defaults[ Settings.Notifications.Hulu ] = true;
    defaults[ Settings.Notifications.GenericAudioVideo ] = true;
    defaults[ Settings.Notifications.Twitch ] = true;

    defaults[ Settings.ControllersEnabled.Pandora ] = true;
    defaults[ Settings.ControllersEnabled.Spotify ] = true;
    defaults[ Settings.ControllersEnabled.Youtube ] = true;
    defaults[ Settings.ControllersEnabled.GooglePlayMusic ] = true;
    defaults[ Settings.ControllersEnabled.Bandcamp ] = true;
    defaults[ Settings.ControllersEnabled.Netflix ] = true;
    defaults[ Settings.ControllersEnabled.AmazonVideo ] = true;
    defaults[ Settings.ControllersEnabled.AmazonMusic ] = true;
    defaults[ Settings.ControllersEnabled.Hulu ] = true;
    defaults[ Settings.ControllersEnabled.GenericAudioVideo ] = true;
    defaults[ Settings.ControllersEnabled.Twitch ] = true;

    defaults[ Settings.ControllerColors.Pandora ] = '#455774';
    defaults[ Settings.ControllerColors.Spotify ] = '#84bd00';
    defaults[ Settings.ControllerColors.Youtube ] = '#f12b24';
    defaults[ Settings.ControllerColors.GooglePlayMusic ] = '#ff5722';
    defaults[ Settings.ControllerColors.Bandcamp ] = '#639AA9';
    defaults[ Settings.ControllerColors.Netflix ] = '#9b0103';
    defaults[ Settings.ControllerColors.AmazonVideo ] = '#FF9900';
    defaults[ Settings.ControllerColors.AmazonMusic ] = '#fd7c02';
    defaults[ Settings.ControllerColors.Hulu ] = '#66AA33';
    defaults[ Settings.ControllerColors.GenericAudioVideo ] = '#5b5b5b';
    defaults[ Settings.ControllerColors.Twitch ] = '#6441A4';

    defaults[ Settings.NotificationLength ] = 5;
    defaults[ Settings.NoActiveWindowNotifications ] = false;
    defaults[ Settings.DefaultSite ] = "Youtube";
    defaults[ Settings.PauseOnLock ] = true;
    defaults[ Settings.PauseOnInactivity ] = false;
    defaults[ Settings.InactivityTimeout ] = 60 * 5;
    defaults[ Settings.AutoPauseEnabled ] = true;
    defaults[ Settings.ShowChangeLogOnUpdate ] = true;
    defaults[ Settings.ShowAutoPausedNotification ] = false;
    defaults[ Settings.SiteBlacklist ] = [ 'imgur.com' ];

    defaults[ Settings.Controls.DisplayControls ] = true;
    defaults[ Settings.Controls.AlwaysDisplayPlaybackSpeed ] = true;
    defaults[ Settings.Controls.MediaControls.MuchSlower ] = '';
    defaults[ Settings.Controls.MediaControls.Slower ] = 's';
    defaults[ Settings.Controls.MediaControls.Faster ] = 'd';
    defaults[ Settings.Controls.MediaControls.MuchFaster ] = '';
    defaults[ Settings.Controls.MediaControls.Reset ] = 'r';
    defaults[ Settings.Controls.MediaControls.Loop ] = '';

    return defaults;
}


function ContentInfo( title, caption, subcaption, image, isLiked, isDisliked )
{
    this.title = $.trim( title );
    this.caption = $.trim( caption );
    this.subcaption = $.trim( subcaption );
    this.image = $.trim( image );
    this.isLiked = !!isLiked;
    this.isDisliked = !!isDisliked;
}


function parseTime( timeText )
{
    var strippedTimeText = $.trim( timeText );
    var timeSplit = timeText.split( ':' );
    if( timeSplit.length === 3 )
    {
        var hours = Math.abs( parseFloat( timeSplit[ 0 ] ) );
        var minutes = Math.abs( parseFloat( timeSplit[ 1 ] ) );
        var seconds = Math.abs( parseFloat( timeSplit[ 2 ] ) );
        return seconds + ( minutes + hours * 60 ) * 60;
    }
    else if( timeSplit.length === 2 )
    {
        var minutes = Math.abs( parseFloat( timeSplit[ 0 ] ) );
        var seconds = Math.abs( parseFloat( timeSplit[ 1 ] ) );
        return minutes * 60 + seconds;
    }
    else
    {
        return 0;
    }
}