function AudioVideoController( video, name )
{
    MediaController.call( this, video, name, 'blue' );

    this.allowLockOnInactivity = false;
}

AudioVideoController.prototype = Object.create( MediaController.prototype );
AudioVideoController.prototype.constructor = AudioVideoController;

$( function()
{
    chrome.storage.sync.get( Settings.SiteBlacklist, function( settings )
    {
        var url = window.location.href;
        var blacklist = settings[ Settings.SiteBlacklist ];
        for( var i = 0; i < blacklist.length; i++ )
        {
            if( blacklist[ i ] && url.indexOf( blacklist[ i ] ) !== -1 )
            {
                console.log( 'Easy Control - Blacklisted site: ' + blacklist[ i ] );
                return;
            }
        }

        var videos = $( 'video' );
        var audios = $( 'audio' );

        if( videos.length !== 0 || audios.length !== 0 )
        {
            chrome.runtime.sendMessage( null, new Message( Message.types.to_background.NAME_REQUEST ), function( name )
            {
                videos.each( function( i, video )
                {
                    var videoName = 'Video_' + i + '_' + name;
                    console.log( 'Video found: ' + videoName );
                    var videoController = new AudioVideoController( video, videoName );
                    videoController.startPolling();
                } );

                audios.each( function( i, audio )
                {
                    var audioName = 'Audio_' + i + '_' + name;
                    console.log( 'Audio found: ' + audioName );
                    var audioController = new AudioVideoController( audio, audioName );
                    audioController.startPolling();
                } );
            } );
        }
    } );
} );