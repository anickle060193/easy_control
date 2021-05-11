import { EventEmitter, EventEmitterListener } from './EventEmitter';

export class SingleFireEventEmitter extends EventEmitter<[]>
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

  public addEventListener( listener: EventEmitterListener<[]> ): void
  {
    if( this.alreadyFired )
    {
      window.setTimeout( () => listener.call( undefined ), 0 );
    }
    else
    {
      super.addEventListener( listener );
    }
  }

  public removeEventListener( listener: EventEmitterListener<[]> ): void
  {
    if( !this.alreadyFired )
    {
      super.removeEventListener( listener );
    }
  }
}
