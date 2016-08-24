var Settings = {
    Notifications : {
        Pandora : 'key__notifications__pandora',
        Spotify : 'key__notifications__spotify',
        Youtube : 'key__notifications__youtube',
        GooglePlayMusic : 'key__notifications__google_play_music'
    },
    NoActiveWindowNotifications : 'key__no_active_window_notifications',
    DefaultSite : 'key__default_site',
    PauseOnLock : 'key__pause_on_lock',
    PauseOnInactivity : 'key__pause_on_inactivity',
    InactivityTimeout : 'key__inactivity_timeout'
};


var siteToURL = {
    Pandora : "http://www.pandora.com/",
    Spotify : "https://play.spotify.com/",
    Youtube : "https://www.youtube.com/",
    GooglePlayMusic : "https://play.google.com/music/"
};


function Message( type, data )
{
    this.type = type;
    this.data = data;
}

Message.types = {
    to_background : {
        INITIALIZE : 'to_background.initialize',
        PAUSE_REPORT : 'to_background.pause_report',
        PROGRESS_REPORT : 'to_background.progress_report',
        NEW_CONTENT : 'to_background.new_content',
    },
    from_background : {
        PAUSE : 'from_background.pause',
        PLAY : 'from_background.play',
        NEXT : 'from_background.next',
        PREVIOUS : 'from_background.previous',
        LIKE : 'from_background.like',
        UNLIKE : 'from_background.unlike',
        DISLIKE : 'from_background.dislike',
        UNDISLIKE : 'from_background.undislike'
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


function trackTimeToSeconds( time_text )
{
    var timeSplit = time_text.split( ':', 2 );
    return parseFloat( timeSplit[ 0 ] ) * 60 + parseFloat( timeSplit[ 1 ] );
}