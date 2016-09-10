function BandcampController()
{
    Controller.call( this, 'Bandcamp', '#639AA9', true )
}

BandcampController.prototype = Object.create( Controller.prototype );
BandcampController.prototype.constructor = BandcampController;

BandcampController.prototype._play = function()
{
    $( '.playbutton' ).click();
};

BandcampController.prototype._pause = function()
{
    $( '.playbutton' ).click();
};

BandcampController.prototype._previous = function()
{
    $( '.prevbutton' ).click();
};

BandcampController.prototype._next = function()
{
    $( '.nextbutton' ).click();
};

BandcampController.prototype._getProgress = function()
{
    var elapsedTime = trackTimeToSeconds( $( '.time_elapsed' ).text() );
    var totalTime = trackTimeToSeconds( $( '.time_total' ).text() );

    if( totalTime === 0 )
    {
        return 0;
    }
    else
    {
        return elapsedTime / totalTime;
    }
};

BandcampController.prototype._isPaused = function()
{
    return !$( '.playbutton' ).hasClass( 'playing' );
};

BandcampController.prototype._getContentInfo = function()
{
    var track, artist, album, artwork;
    if( $( 'h2.trackTitle' ).length !== 0 )
    {
        track = $( '.track_info .title' ).text();
        artist = $( '[itemprop=byArtist] > a' ).text();
        album = $( 'h2.trackTitle' ).text();
        artwork = $( '#tralbumArt img' ).attr( 'src' );
    }
    else
    {
        track = $( '.title' ).text();
        artist = $( '.detail-artist > a' ).text();
        album = $( '.detail-album > a' ).text();
        artwork = $( '.detail-art > img' ).attr( 'src' );
    }

    if( track )
    {
        return new ContentInfo( track, artist, album, artwork );
    }
    else
    {
        return null;
    }
};

$( function()
{
    if( Controller.settings[ Settings.ControllersEnabled.Bandcamp ] )
    {
        var controller = new BandcampController();
        controller.startPolling();
    }
} );