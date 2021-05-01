export type EventEmitterListener<AX> = ( ...args: AX[] ) => void;

export class EventEmitter<AX extends unknown[] = []>
{
  protected readonly listeners: EventEmitterListener<AX>[] = [];

  public dispatch(): void
  {
    for( const listener of this.listeners )
    {
      try
      {
        listener.call( undefined );
      }
      catch( e )
      {
        console.warn( 'Error occurred in listener:', e );
      }
    }
  }

  public addEventListener( listener: EventEmitterListener<AX> ): void
  {
    const index = this.listeners.indexOf( listener );
    if( index >= 0 )
    {
      console.warn( 'Listener is already listening' );
      return;
    }

    this.listeners.push( listener );
  }

  public removeEventListener( listener: EventEmitterListener<AX> ): void
  {
    const index = this.listeners.indexOf( listener );
    if( index < 0 )
    {
      console.warn( 'Listener is not already listening' );
      return;
    }

    this.listeners.splice( index, 1 );
  }
}
