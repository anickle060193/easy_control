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
