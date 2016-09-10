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
        Hulu : 'key__notifications__hulu'
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
        PlaybackSpeed : {
            MuchSlower : 'key__controls__playback_speed__much_slower',
            Slower : 'key__controls__playback_speed__slower',
            Faster : 'key__controls__playback_speed__faster',
            MuchFaster : 'key__controls__playback_speed__much_faster',
            Reset : 'key__controls__playback_speed__reset'
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
    Hulu : 'http://www.hulu.com/'
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


function ContentInfo( title, caption, subcaption, image, isLiked, isDisliked )
{
    this.title = $.trim( title );
    this.caption = $.trim( caption );
    this.subcaption = $.trim( subcaption );
    this.image = $.trim( image );
    this.isLiked = !!isLiked;
    this.isDisliked = !!isDisliked;
}


function trackTimeToSeconds( timeText )
{
    var strippedTimeText = $.trim( timeText );
    var timeSplit = timeText.split( ':', 2 );
    if( timeSplit.length === 2 )
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