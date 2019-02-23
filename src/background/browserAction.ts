import { BackgroundController } from 'background/controller';

const ICON_WIDTH = 38;
const ICON_HEIGHT = 38;
const ICON_PROGRESS_BAR_THICKNESS = ICON_HEIGHT * 0.1;

function drawPause( context: CanvasRenderingContext2D, color: string )
{
  let pauseBarWidth = 0.16 * ICON_WIDTH;
  let pauseBarHeight = 0.68 * ICON_HEIGHT;

  let pauseBarY = ( ICON_HEIGHT - ICON_PROGRESS_BAR_THICKNESS - pauseBarHeight ) / 2.0;
  let xCenter = ICON_WIDTH / 2.0;

  context.fillStyle = color;
  context.rect( xCenter - pauseBarWidth * 1.5, pauseBarY, pauseBarWidth, pauseBarHeight );
  context.rect( xCenter + pauseBarWidth * 0.5, pauseBarY, pauseBarWidth, pauseBarHeight );
  context.fill();
}

function drawPlay( context: CanvasRenderingContext2D, color: string )
{
  let playHeight = ( ICON_HEIGHT - ICON_PROGRESS_BAR_THICKNESS );

  let playLeft = 0.21 * ICON_WIDTH;
  let playRight = 0.79 * ICON_WIDTH;
  let playTop = 0.1 * playHeight;
  let playBottom = 0.9 * playHeight;

  context.fillStyle = color;
  context.beginPath();
  context.moveTo( playLeft, playTop );
  context.lineTo( playRight, ( playTop + playBottom ) / 2.0 );
  context.lineTo( playLeft, playBottom );
  context.fill();
}

export function updateBrowserActionIcon( controller: BackgroundController | null )
{
  if( !controller )
  {
    chrome.browserAction.setIcon( { path: { 19: 'res/icon19.png', 38: 'res/icon38.png' } } );
    chrome.browserAction.setTitle( { title: 'Easy Control' } );
  }
  else
  {
    let canvas = document.createElement( 'canvas' );
    canvas.width = ICON_WIDTH;
    canvas.height = ICON_HEIGHT;

    let context = canvas.getContext( '2d' )!;

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

    let imageData = context.getImageData( 0, 0, ICON_WIDTH, ICON_HEIGHT );
    chrome.browserAction.setIcon( { imageData: imageData } );
    chrome.browserAction.setTitle( { title: controller.name } );
  }
}
