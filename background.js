var ICON_WIDTH = 38;
var ICON_HEIGHT = 38;
var ICON_PROGRESS_BAR_THICKNESS = ICON_HEIGHT * 0.1;

var ports = { };
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
    if( !ports[ port.name ] )
    {
        console.log( 'Refused message!' );
        console.log( port );
        return;
    }

    if( message.type === Message.types.to_background.INITIALIZE )
    {
        console.log( 'Port Initialized: ' + port.name );
        ports[ port.name ].color = message.data.color;
    }
    else if( message.type === Message.types.to_background.PAUSE_REPORT )
    {
        ports[ port.name ].paused = message.data;

        if( !lastPort )
        {
            console.log( 'Pause Report: No last Port' );
            lastPort = port;
            paused = message.data;
            updateBrowserActionIcon( paused, ports[ port.name ].progress, ports[ port.name ].color );
        }
        else if( port.name === lastPort.name )
        {
            if( message.data !== paused )
            {
                console.log( 'Pause Report: LastPort: ' + paused );
                paused = message.data;

                updateBrowserActionIcon( paused, ports[ port.name ].progress, ports[ port.name ].color )
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
        ports[ port.name ].progress = message.progress;

        if( lastPort && port.name === lastPort.name )
        {
            updateBrowserActionIcon( paused, message.data, ports[ port.name ].color );
        }
    }
}


function handleDisconnect( port )
{
    delete ports[ port.name ];

    console.log( 'Port Disconnect: ' + port.name );

    if( port.name === lastPort.name )
    {
        console.log( 'Port Disconnect: Was last port' );
        lastPort = null;
        chrome.browserAction.setIcon( { path : { 38 : 'icon.png' } } );
    }
}


chrome.runtime.onConnect.addListener( function( port )
{
    console.log( 'Port Connect: ' + port.name );
    if( !ports[ port.name ] )
    {
        ports[ port.name ] = { ports : [ ], paused : true, progress : 0.0, color : 'red' };
    }
    ports[ port.name ].ports.push( port );

    port.onMessage.addListener( handleMessage );
    port.onDisconnect.addListener( handleDisconnect );
    console.log( ports );
} );


function pause( exclusion )
{
    for( var name in ports )
    {
        if( !ports.hasOwnProperty( name ) )
        {
            continue;
        }

        if( !exclusion || name !== exclusion.name )
        {
            for( var i = 0; i < ports[ name ].ports.length; i++ )
            {
                ports[ name ].ports[ i ].postMessage( new Message( Message.types.from_background.PAUSE ) )
            }
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
        for( var i = 0; i < ports[ port.name ].ports.length; i++ )
        {
            ports[ port.name ].ports[ i ].postMessage( new Message( Message.types.from_background.PLAY ) );
        }
    }
}


chrome.browserAction.onClicked.addListener( function( tab )
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
} );