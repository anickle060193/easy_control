import { getCurrentController } from './controllers';

import { BackgroundMessageId } from '../common/background_messages';
import { CONTROLLER_COLORS } from '../common/controllers';

const ICON_WIDTH = 32;
const ICON_HEIGHT = 32;
const ICON_PROGRESS_BAR_THICKNESS = Math.max( ICON_HEIGHT * 0.1, 1 );

function drawPause( context: CanvasRenderingContext2D, color: string )
{
  const pauseBarWidth = 0.16 * ICON_WIDTH;
  const pauseBarHeight = 0.68 * ICON_HEIGHT;

  const pauseBarY = ( ICON_HEIGHT - ICON_PROGRESS_BAR_THICKNESS - pauseBarHeight ) / 2.0;
  const xCenter = ICON_WIDTH / 2.0;

  context.fillStyle = color;
  context.rect( xCenter - pauseBarWidth * 1.5, pauseBarY, pauseBarWidth, pauseBarHeight );
  context.rect( xCenter + pauseBarWidth * 0.5, pauseBarY, pauseBarWidth, pauseBarHeight );
  context.fill();
}

function drawPlay( context: CanvasRenderingContext2D, color: string )
{
  const playHeight = ( ICON_HEIGHT - ICON_PROGRESS_BAR_THICKNESS );

  const playLeft = 0.21 * ICON_WIDTH;
  const playRight = 0.79 * ICON_WIDTH;
  const playTop = 0.1 * playHeight;
  const playBottom = 0.9 * playHeight;

  context.fillStyle = color;
  context.beginPath();
  context.moveTo( playLeft, playTop );
  context.lineTo( playRight, ( playTop + playBottom ) / 2.0 );
  context.lineTo( playLeft, playBottom );
  context.fill();
}

function setDefaultBrowserAction()
{
  chrome.browserAction.setIcon( {
    path: {
      16: 'assets/icon16.png',
      32: 'assets/icon32.png',
      64: 'assets/icon64.png',
      128: 'assets/icon128.png',
    },
  } );
  chrome.browserAction.setTitle( { title: 'Easy Control' } );
}

export function updateBrowserActionIcon(): void
{
  const controller = getCurrentController();

  if( !controller )
  {
    setDefaultBrowserAction();
    return;
  }

  const canvas = document.createElement( 'canvas' );
  canvas.width = ICON_WIDTH;
  canvas.height = ICON_HEIGHT;

  const context = canvas.getContext( '2d' );
  if( !context )
  {
    console.warn( 'Failed to get canvas context.' );
    setDefaultBrowserAction();
    return;
  }

  const controllerColor = CONTROLLER_COLORS[ controller.id ] ?? 'rgb( 33, 150, 243 )';

  if( controller.mediaInfo.playing )
  {
    drawPause( context, controllerColor );
  }
  else
  {
    drawPlay( context, controllerColor );
  }

  context.lineWidth = ICON_PROGRESS_BAR_THICKNESS;

  context.strokeStyle = 'white';
  context.beginPath();
  context.moveTo( 0, ICON_HEIGHT );
  context.lineTo( ICON_WIDTH, ICON_HEIGHT );
  context.stroke();

  context.strokeStyle = controllerColor;
  context.beginPath();
  context.moveTo( 0, ICON_HEIGHT );
  context.lineTo( ICON_WIDTH * controller.mediaInfo.progress, ICON_HEIGHT );
  context.stroke();

  const imageData = context.getImageData( 0, 0, ICON_WIDTH, ICON_HEIGHT );
  chrome.browserAction.setIcon( { imageData: imageData } );
  chrome.browserAction.setTitle( { title: controller.name } );
}

export default (): void =>
{
  chrome.browserAction.onClicked.addListener( () =>
  {
    getCurrentController()?.sendMessage( BackgroundMessageId.PlayPause );
  } );
};