enum ContextMenuId
{
  ReloadExtension = 'context_menu__reload_extension',
}

const DEBUG = ( process.env.NODE_ENV === 'development' );

export function initContextMenus(): void
{
  chrome.runtime.onInstalled.addListener( () =>
  {
    chrome.contextMenus.create( {
      id: ContextMenuId.ReloadExtension,
      title: 'Reload Extension',
      contexts: [ 'browser_action' ],
      visible: DEBUG,
    } );
  } );

  chrome.contextMenus.onClicked.addListener( ( info ) =>
  {
    if( info.menuItemId === ContextMenuId.ReloadExtension )
    {
      chrome.runtime.reload();
    }
  } );
}
