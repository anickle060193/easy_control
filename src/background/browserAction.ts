import { ControllerCommand, CONTROLLERS } from '../common/controllers';

import { getCurrentController } from './controllers';

const ICON_WIDTH = 32;
const ICON_HEIGHT = 32;
const ICON_PROGRESS_BAR_THICKNESS = Math.max( ICON_HEIGHT * 0.1, 1 );

type PlayState = 'play' | 'pause';

let lastState: PlayState | null = null;
let lastProgressWidth: number | null = null;

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

async function setDefaultBrowserAction()
{
  const manifest = browser.runtime.getManifest();

  lastState = null;
  lastProgressWidth = null;
  await browser.browserAction.setIcon( {
    path: manifest.browser_action?.default_icon ?? manifest.icons,
  } );
  await browser.browserAction.setTitle( {
    title: manifest.browser_action?.default_title ?? manifest.name,
  } );
}

export async function updateBrowserActionIcon(): Promise<void>
{
  const controller = getCurrentController();

  if( !controller )
  {
    await setDefaultBrowserAction();
    return;
  }

  const canvas = document.createElement( 'canvas' );
  canvas.width = ICON_WIDTH;
  canvas.height = ICON_HEIGHT;

  const context = canvas.getContext( '2d' );
  if( !context )
  {
    console.warn( 'Failed to get canvas context.' );
    await setDefaultBrowserAction();
    return;
  }

  const state: PlayState = controller.status.playing ? 'pause' : 'play';
  const progressWidth = Math.round( controller.status.progress * ICON_WIDTH );

  if( state === lastState
    && progressWidth === lastProgressWidth )
  {
    return;
  }

  const controllerColor = CONTROLLERS[ controller.controllerId ]?.color ?? 'rgb( 33, 150, 243 )';

  if( state === 'pause' )
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
  context.lineTo( progressWidth, ICON_HEIGHT );
  context.stroke();

  const imageData = context.getImageData( 0, 0, ICON_WIDTH, ICON_HEIGHT );
  await browser.browserAction.setIcon( { imageData: imageData as browser.Action.ImageDataType } );

  await browser.browserAction.setTitle( {
    title: [
      `${CONTROLLERS[ controller.controllerId ].name}:`,
      controller.media.track,
      controller.media.artist,
      controller.media.album,
    ].filter( ( s ): s is string => typeof s === 'string' ).join( '\n' ),
  } );

  lastState = state;
  lastProgressWidth = progressWidth;
}

export function initBrowserAction(): void
{
  browser.browserAction.onClicked.addListener( () =>
  {
    getCurrentController()?.sendCommand( ControllerCommand.PlayPause );
  } );
}
