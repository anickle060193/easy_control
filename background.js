var ICON_WIDTH = 38;
var ICON_HEIGHT = 38;
var ICON_PROGRESS_BAR_THICKNESS = ICON_HEIGHT * 0.1;

var ports = [ ];
var lastPort = null;
var paused = true;


function drawPause( context, color )
{
    var pauseBarWidth = 0.16 * ICON_WIDTH;
    var pauseBarHeight = 0.68 * ICON_HEIGHT;

    var pauseBarY = ( ICON_HEIGHT - ICON_PROGRESS_BAR_THICKNESS - pauseBarHeight ) / 2.0;
    var xCenter = ICON_WIDTH / 2.0;

    context.fillStyle = color;
    context.rect( xCenter - pauseBarWidth * 1.5, pauseBarY, pauseBarWidth, pauseBarHeight );
    context.rect( xCenter + pauseBarWidth * 0.5, pauseBarY, pauseBarWidth, pauseBarHeight );
    context.fill();
}


function drawPlay( context, color )
{
    var playHeight = ( ICON_HEIGHT - ICON_PROGRESS_BAR_THICKNESS );

    var playLeft = 0.21 * ICON_WIDTH;
    var playRight = 0.79 * ICON_WIDTH;
    var playTop = 0.1 * playHeight;
    var playBottom = 0.9 * playHeight;

    context.fillStyle = color;
    context.beginPath();
    context.moveTo( playLeft, playTop );
    context.lineTo( playRight, ( playTop + playBottom ) / 2.0 );
    context.lineTo( playLeft, playBottom );
    context.fill();
}


function updateBrowserActionIcon( paused, progress, color )
{
    var canvas = document.createElement( 'canvas' );
    canvas.width = ICON_WIDTH;
    canvas.height = ICON_HEIGHT;

    var context = canvas.getContext( '2d' );

    if( paused )
    {
        drawPlay( context, color );
    }
    else
    {
        drawPause( context, color );
    }

    context.lineWidth = ICON_PROGRESS_BAR_THICKNESS;

    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo( 0, ICON_HEIGHT );
    context.lineTo( ICON_WIDTH, ICON_HEIGHT );
    context.stroke();

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo( 0, ICON_HEIGHT );
    context.lineTo( ICON_WIDTH * progress, ICON_HEIGHT );
    context.stroke();

    var imageData = context.getImageData( 0, 0, ICON_WIDTH, ICON_HEIGHT );
    chrome.browserAction.setIcon( { imageData : imageData } );
}


function handleMessage( message, port )
{
    if( message.type === Message.types.to_background.INITIALIZE )
    {
        console.log( 'Port Initialized: ' + port.name );
        port.color = message.data.color;
    }
    else if( message.type === Message.types.to_background.PAUSE_REPORT )
    {
        port.paused = message.data;

        if( !lastPort )
        {
            console.log( 'Pause Report: No last Port' );
            lastPort = port;
            paused = message.data;
            updateBrowserActionIcon( paused, port.progress, port.color );
        }
        else if( port.name === lastPort.name )
        {
            if( message.data !== paused )
            {
                console.log( 'Pause Report: LastPort: ' + paused );
                paused = message.data;

                updateBrowserActionIcon( paused, port.progress, port.color )
            }
        }
        else
        {
            var otherPaused = message.data;
            if( !otherPaused )
            {
                console.log( 'Pause Report: Other Port Unpaused' );
                lastPort = port;
                paused = false;
                pause( lastPort );
            }
        }
    }
    else if( message.type === Message.types.to_background.PROGRESS_REPORT )
    {
        port.progress = message.progress;

        if( lastPort && port.name === lastPort.name )
        {
            updateBrowserActionIcon( paused, message.data, port.color );
        }
    }
    else if( message.type == Message.types.to_background.NEW_CONTENT )
    {
        if( port.name === lastPort.name )
        {
            chrome.storage.sync.get( null, function( items )
            {
                if( items[ Settings.Notifications[ port.name ] ] )
                {
                    console.log( 'Showing notification for ' + port.name );
                    var contentInfo = message.data;
                    var notificationOptions = {
                        type : 'basic',
                        //iconUrl : contentInfo.image,
                        iconUrl : 'res/icon128.png',
                        title : contentInfo.title,
                        message : contentInfo.caption,
                        contextMessage : contentInfo.subcaption
                    };
                    chrome.notifications.create( null, notificationOptions );
                }
                else
                {
                    console.log( 'Not showing notification for ' + port.name );
                }
            } );
        }
    }
}


function handleDisconnect( port )
{
    ports.splice( ports.indexOf( port ), 1 );

    console.log( 'Port Disconnect: ' + port.name );

    if( port.name === lastPort.name )
    {
        console.log( 'Port Disconnect: Was last port' );
        lastPort = null;
        paused = true;
        chrome.browserAction.setIcon( { path : { '19' : 'res/icon19.png', '38' : 'res/icon38.png' } } );
    }
}


chrome.runtime.onConnect.addListener( function( port )
{
    for( var i = 0; i < ports.length; i++ )
    {
        if( ports[ i ].name == port.name )
        {
            console.log( 'Refused Duplicate Connection: ' + port.name );
            return;
        }
    }

    console.log( 'Port Connect: ' + port.name );
    port.paused = true;
    port.progress = 0.0;
    port.color = 'red';

    ports.push( port );

    port.onMessage.addListener( handleMessage );
    port.onDisconnect.addListener( handleDisconnect );
} );


function pause( exclusion )
{
    for( var i = 0; i < ports.length; i++ )
    {
        if( !exclusion || ports[ i ].name !== exclusion.name )
        {
            ports[ i ].postMessage( new Message( Message.types.from_background.PAUSE ) )
        }
    }
}


function play()
{
    var port = lastPort;
    if( port === null && ports.length !== 0 )
    {
        port = ports[ 0 ];
    }

    if( port )
    {
        port.postMessage( new Message( Message.types.from_background.PLAY ) );
    }
}


function handlePlayPause()
{
    if( paused )
    {
        console.log( 'Click: Play' );
        play();
    }
    else
    {
        console.log( 'Click: Pause' );
        pause();
    }
}


chrome.browserAction.onClicked.addListener( function( tag )
{
    handlePlayPause();
} );

chrome.commands.onCommand.addListener( function( command )
{
    if( command === 'play_pause' )
    {
        handlePlayPause();
    }
} );