var Settings = {
    Notifications : {
        Pandora : 'key__notifications__pandora',
        Spotify : 'key__notifications__spotify',
        Youtube : 'key__notifications__youtube',
        GooglePlayMusic : 'key__notifications__google_play_music'
    },
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
        INITIALIZE : 'INITIALIZE',
        PAUSE_REPORT : 'PAUSE_REPORT',
        PROGRESS_REPORT : 'PROGRESS_REPORT',
        NEW_CONTENT : 'NEW_CONTENT'
    },
    from_background : {
        PAUSE : 'PAUSE',
        PLAY : 'PLAY'
    }
}


function ContentInfo( title, caption, subcaption, image )
{
    this.title = $.trim( title );
    this.caption = $.trim( caption );
    this.subcaption = $.trim( subcaption );
    this.image = $.trim( image );
}


function trackTimeToSeconds( time_text )
{
    var timeSplit = time_text.split( ':', 2 );
    return parseFloat( timeSplit[ 0 ] ) * 60 + parseFloat( timeSplit[ 1 ] );
}