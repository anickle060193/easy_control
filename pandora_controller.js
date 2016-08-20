function PandoraController()
{
    Controller.call( this, 'Pandora', '#455774', true, true );
}

PandoraController.prototype = Object.create( Controller.prototype );
PandoraController.prototype.constructor = PandoraController;

PandoraController.prototype.play = function()
{
    $( '.playButton' ).click();
};

PandoraController.prototype.pause = function()
{
    $( '.pauseButton' ).click();
};

PandoraController.prototype.getProgress = function()
{
    var elapsedTime = -trackTimeToSeconds( $( '.elapsedTime' ).text() );
    var remainingTime = trackTimeToSeconds( $( '.remainingTime' ).text() );

    var totalTime = elapsedTime + remainingTime;

    var progress = totalTime === 0 ? 0 : elapsedTime / totalTime;

    return progress
};

PandoraController.prototype.checkIfPaused = function()
{
    return $( '.playButton' ).is( ':visible' );
};

$( window ).ready( function()
{
    var controller = new PandoraController();
    controller.startPolling();
} );