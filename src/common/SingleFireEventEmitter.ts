import { EventEmitter, EventEmitterListener } from './EventEmitter';

export class SingleFireEventEmitter<AX extends unknown[]> extends EventEmitter<AX>
{
  private alreadyFired = false;

  public dispatch(): void
  {
    if( this.alreadyFired )
    {
      console.error( 'Cannot dispatch SingleFireEventEmitter that has already fired.' );
      return;
    }

    super.dispatch();

    this.alreadyFired = true;
    this.listeners.splice( 0, this.listeners.length );
  }

  public addEventListener( listener: EventEmitterListener<AX> ): void
  {
    if( this.alreadyFired )
    {
      listener.call( undefined );
    }
    else
    {
      super.addEventListener( listener );
    }
  }

  public removeEventListener( listener: EventEmitterListener<AX> ): void
  {
    if( !this.alreadyFired )
    {
      super.removeEventListener( listener );
    }
  }
}
