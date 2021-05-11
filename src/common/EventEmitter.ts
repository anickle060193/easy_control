export type EventEmitterListener<AX extends unknown[]> = ( ...args: AX ) => void;

export class EventEmitter<AX extends unknown[] = []>
{
  protected readonly listeners: EventEmitterListener<AX>[] = [];

  public dispatch( ...args: AX ): void
  {
    for( const listener of this.listeners )
    {
      window.setTimeout( () => listener( ...args ), 0 );
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
