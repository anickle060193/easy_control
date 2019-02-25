export const enum SessionStorageKey
{
  PlaybackRate = 'session_storage__playback_rate',
}

export interface SessionStorageType
{
  [ SessionStorageKey.PlaybackRate ]: number;
}

const DEFAULT_STORAGE: SessionStorageType = {
  [ SessionStorageKey.PlaybackRate ]: 1.0,
};

export function getSessionStorageItem<K extends SessionStorageKey>( key: K ): SessionStorageType[ K ]
{
  try
  {
    let itemText = sessionStorage.getItem( key );
    if( itemText !== null )
    {
      let item = JSON.parse( itemText );
      if( typeof item === typeof DEFAULT_STORAGE[ key ] )
      {
        return item;
      }
    }
  }
  catch( e )
  {
    console.warn( 'Failed to retrieve session storage item:', key, e );
  }
  return DEFAULT_STORAGE[ key ];
}

export function setSessionStorageItem<K extends SessionStorageKey>( key: K, value: SessionStorageType[ K ] )
{
  sessionStorage.setItem( key, JSON.stringify( value ) );
}
