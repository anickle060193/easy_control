function YoutubeController()
{
    Controller.call( this, 'Youtube', '#f12b24' );
}

YoutubeController.prototype = Object.create( Controller.prototype );
YoutubeController.prototype.constructor = YoutubeController;

YoutubeController.prototype.play = function()
{
    $( '.ytp-play-button' ).click();
};

YoutubeController.prototype.pause = function()
{
    $( '.ytp-play-button' ).click();
};

YoutubeController.prototype.getProgress = function()
{
    var elapsedTime = trackTimeToSeconds( $( '.ytp-time-current' ).text() );
    var totalTime = trackTimeToSeconds( $( '.ytp-time-duration' ).text() );

    var progress = totalTime === 0 ? 0 : elapsedTime / totalTime;

    return progress
};

YoutubeController.prototype.checkIfPaused = function()
{
    return $( '.ytp-play-button' ).attr( 'aria-label' ) !== 'Pause';
};

$( window ).ready( function()
{
    var controller = new YoutubeController();
    controller.startPolling();
} );