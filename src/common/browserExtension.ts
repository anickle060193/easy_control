export function getTab( tabId: number ): Promise<chrome.tabs.Tab>
{
  return new Promise( ( resolve, reject ) =>
  {
    chrome.tabs.get( tabId, ( tab ) =>
    {
      if( chrome.runtime.lastError )
      {
        return reject( new Error( chrome.runtime.lastError.message ) );
      }

      resolve( tab );
    } );
  } );
}

export function getWindow( windowId: number ): Promise<chrome.windows.Window>
{
  return new Promise( ( resolve, reject ) =>
  {
    chrome.windows.get( windowId, ( w ) =>
    {
      if( chrome.runtime.lastError )
      {
        return reject( new Error( chrome.runtime.lastError.message ) );
      }

      resolve( w );
    } );
  } );
}
