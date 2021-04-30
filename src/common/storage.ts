type StorageArea = 'local' | 'sync';

function get( area: StorageArea, key: string ): Promise<unknown>
{
  return new Promise<unknown>( ( resolve, reject ) =>
  {
    chrome.storage[ area ].get( key, ( items ) =>
    {
      if( chrome.runtime.lastError )
      {
        reject( chrome.runtime.lastError );
      }
      else if( !( key in items ) )
      {
        reject( new Error( `Key does not exist in ${area} storage: ${key}` ) );
      }
      else
      {
        resolve( items[ key ] );
      }
    } );
  } );
}

function set( area: StorageArea, key: string, value: unknown ): Promise<void>
{
  return new Promise<void>( ( resolve, reject ) =>
  {
    chrome.storage[ area ].set( { [ key ]: value }, () =>
    {
      if( chrome.runtime.lastError )
      {
        reject( chrome.runtime.lastError );
      }
      else
      {
        resolve();
      }
    } );
  } );
}

export default { get, set };
