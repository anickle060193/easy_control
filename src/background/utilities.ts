export function focusTab( tab: chrome.tabs.Tab )
{
  chrome.windows.update( tab.windowId, { focused: true, drawAttention: true } );
  if( tab.id )
  {
    chrome.tabs.update( tab.id, { active: true } );
  }
  else
  {
    console.warn( 'Unable to focus tab without ID:', tab );
  }
}
