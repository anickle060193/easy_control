var POLLING_INTERVAL = 100;

function Controller( name, color, hasProgress, hasControls )
{
    this.name = name
    this.color = color;
    this.hasProgress = hasProgress;
    this.hasControls = hasControls;

    this.paused = null;
    this.port = chrome.runtime.connect( null, { name : name } );

    var controller = this;
    this.port.onMessage.addListener( function( message )
    {
        if( message.type === Message.types.from_background.PAUSE )
        {
            if( controller.hasControls )
            {
                controller.pause();
            }
        }
        else if( message.type === Message.types.from_background.PLAY )
        {
            if( controller.hasControls )
            {
                controller.play();
            }
        }
    } );

    this.port.postMessage( new Message( Message.types.to_background.INITIALIZE, { color : this.color } ) );
}

Controller.prototype.reportPaused = function( paused )
{
    this.port.postMessage( new Message( Message.types.to_background.PAUSE_REPORT, paused ) );
};

Controller.prototype.reportProgress = function( progress )
{
    this.port.postMessage( new Message( Message.types.to_background.PROGRESS_REPORT, progress ) );
};

Controller.prototype.startPolling = function()
{
    var controller = this;
    var interval = setInterval( function()
    {
        if( controller.hasControls )
        {
            var paused = controller.checkIfPaused();

            if( paused !== controller.paused )
            {
                controller.paused = paused;
                console.log( 'Reporting Paused: ' + controller.paused );
                controller.reportPaused( controller.paused );
            }
        }

        if( controller.hasProgress )
        {
            controller.reportProgress( controller.getProgress() );
        }
    }, POLLING_INTERVAL );
};

Controller.prototype.play = function() { throw 'Unimplemented: play()' };
Controller.prototype.pause = function() { throw 'Unimplemented: pause()' };
Controller.prototype.checkIfPaused = function() { throw 'Unimplemented: checkIfPaused()' };
Controller.prototype.getProgress = function() { throw 'Unimplemented: getProgress()' };