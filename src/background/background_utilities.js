BackgroundUtilities = ( function()
{
    function focusTab( tab )
    {
        chrome.windows.update( tab.windowId, { focused : true } );
        chrome.tabs.update( tab.id, { active : true } );
    }

    return {
        focusTab : focusTab
    };
} )();