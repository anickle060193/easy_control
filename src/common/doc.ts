type DocChangeEvent = CustomEvent<MutationRecord[]>;

interface DocEventMap
{
  'change': DocChangeEvent;
  'change:src': DocChangeEvent;
}

class Doc
{
  private target: EventTarget = new EventTarget();

  constructor()
  {
    new MutationObserver( ( mutations ) =>
    {
      this.dispatchEvent( 'change', mutations );
    } ).observe( document.body, {
      childList: true,
      subtree: true,
    } );

    new MutationObserver( ( mutations ) =>
    {
      this.dispatchEvent( 'change:src', mutations );
    } ).observe( document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [ 'src' ],
    } );
  }

  public addEventListener<K extends keyof DocEventMap>( type: K, listener: ( event: DocEventMap[ K ] ) => void )
  {
    this.target.addEventListener( type, listener as EventListener );
  }

  public removeEventListener<K extends keyof DocEventMap>( type: K, listener: ( event: DocEventMap[ K ] ) => void )
  {
    this.target.removeEventListener( type, listener as EventListener );
  }

  private dispatchEvent<K extends keyof DocEventMap>( type: K, detail: DocEventMap[ K ][ 'detail' ] )
  {
    this.target.dispatchEvent( new CustomEvent( type, { detail } ) );
  }
}

const doc = new Doc();
export default doc;
