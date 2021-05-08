export function onReady( callback: () => void ): void
{
  if( document.readyState !== 'loading' )
  {
    window.setTimeout( callback, 0 );
  }
  else
  {
    document.addEventListener( 'DOMContentLoaded', callback, { once: true } );
  }
}

const videoFrameCache = new Map<string, string>();

export function extractImageDataUrlFromVideo( video: HTMLVideoElement ): string | null
{
  try
  {
    const source = video.currentSrc;
    const cachedUrl = videoFrameCache.get( source );
    if( cachedUrl )
    {
      return cachedUrl;
    }

    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' );
    if( !context )
    {
      console.warn( 'Failed to retrieve context from canvas.' );
      return null;
    }

    const width = 500;
    const height = video.videoHeight / video.videoWidth * width;

    canvas.width = width;
    canvas.height = height;

    context.drawImage( video, 0, 0, width, height );

    const frameUrl = canvas.toDataURL();

    videoFrameCache.set( source, frameUrl );

    return frameUrl;
  }
  catch( e )
  {
    console.warn( 'Failed to extract frame from video:', e );
  }

  return null;
}
