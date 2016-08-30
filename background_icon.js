var ICON_WIDTH = 38;
var ICON_HEIGHT = 38;
var ICON_PROGRESS_BAR_THICKNESS = ICON_HEIGHT * 0.1;


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


function updateBrowserActionIcon( controller )
{
    if( !controller )
    {
        chrome.browserAction.setIcon( { path : { '19' : 'res/icon19.png', '38' : 'res/icon38.png' } } );
        chrome.browserAction.setTitle( { title : 'Easy Control' } );
    }
    else
    {
        var canvas = document.createElement( 'canvas' );
        canvas.width = ICON_WIDTH;
        canvas.height = ICON_HEIGHT;

        var context = canvas.getContext( '2d' );

        if( controller.paused )
        {
            drawPlay( context, controller.color );
        }
        else
        {
            drawPause( context, controller.color );
        }

        context.lineWidth = ICON_PROGRESS_BAR_THICKNESS;

        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo( 0, ICON_HEIGHT );
        context.lineTo( ICON_WIDTH, ICON_HEIGHT );
        context.stroke();

        context.strokeStyle = controller.color;
        context.beginPath();
        context.moveTo( 0, ICON_HEIGHT );
        context.lineTo( ICON_WIDTH * controller.progress, ICON_HEIGHT );
        context.stroke();

        var imageData = context.getImageData( 0, 0, ICON_WIDTH, ICON_HEIGHT );
        chrome.browserAction.setIcon( { imageData : imageData } );
        chrome.browserAction.setTitle( { title : controller.name } );
    }
}