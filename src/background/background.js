var controllers = [ ];
var currentController = null;

var lastContentChangeNotification = null;
var pauseNotifications = { };
var notifications = { };

var autoPauseDisabledTabs = { };

var settings = { };


function handleMessage( message, controller )
{
    if( message.type === Message.types.to_background.INITIALIZE )
    {
        console.log( 'Controller Initialized: ' + controller.name );
        controller.color = message.data.color;
        controller.allowLockOnInactivity = message.data.allowLockOnInactivity;
    }
    else if( message.type === Message.types.to_background.STATUS )
    {
        var progressChanged = controller.progress !== message.data.progress;
        var pausedChanged = controller.paused !== message.data.paused;

        controller.paused = message.data.paused;
        controller.progress = message.data.progress;
        controller.active = message.data.active;

        if( currentController === null )
        {
            if( pausedChanged && !controller.paused )
            {
                console.log( 'Status - No Current Controller - Unpaused - ' + controller.name );
                currentController = controller;
            }
        }
        else if( currentController !== controller )
        {
            if( pausedChanged && !controller.paused )
            {
                console.log( 'Status - Not Current Controller - Other Unpaused - ' + controller.name );
                controllers.remove( controller );
                controllers.push( controller );
                currentController = controller;

                if( !autoPauseDisabledTabs[ currentController.port.sender.tab.id ] )
                {
                    autoPause( currentController );
                }
            }
        }

        if( currentController === controller )
        {
            if( progressChanged || pausedChanged )
            {
                updateBrowserActionIcon( currentController );
            }
        }
    }
    else if( message.type === Message.types.to_background.NEW_CONTENT )
    {
        console.log( 'New Content - ' + controller.name );
        controller.content = message.data

        if( currentController === controller )
        {
            if( settings[ Settings.Notifications[ controller.name ] ] )
            {
                if( !controller.active || !settings[ Settings.NoActiveWindowNotifications ] )
                {
                    console.log( 'Content Info:' );
                    console.log( controller.content );

                    var notificationOptions = {
                        type : 'basic',
                        iconUrl : controller.content.image ? controller.content.image : 'res/icon128.png',
                        title : controller.content.title,
                        message : controller.content.caption,
                        contextMessage : controller.content.subcaption,
                        buttons : [ { title : 'Next' } ],
                        requireInteraction : true,
                        isClickable : true
                    };

                    console.log( 'Showing notification for ' + controller.name );
                    console.log( notificationOptions );
                    chrome.notifications.create( null, notificationOptions, function( notificationId )
                    {
                        notifications[ notificationId ] = controller;
                        lastContentChangeNotification = notificationId;
                        var notificationLength = settings[ Settings.NotificationLength ];
                        if( !( notificationLength >= 1 ) )
                        {
                            notificationLength = 10;
                        }

                        setTimeout( function()
                        {
                            chrome.notifications.clear( notificationId );
                        }, notificationLength * 1000 );
                    } );
                }
                else
                {
                    console.log( 'Not showing notification due to NoActiveWindowNotifications.' );
                }
            }
        }
    }
}


function handleDisconnect( controller )
{
    controllers.remove( controller );

    console.log( 'Controller Disconnect: ' + controller.name );

    if( currentController === controller )
    {
        console.log( 'Controller Disconnect: Was last port' );

        if( controllers.length > 0 )
        {
            currentController = controllers[ controllers.length - 1 ];
            console.log( currentController.name + ' promoted to currentController' );
        }
        else
        {
            currentController = null;
            console.log( 'No other controllers to promote' );
        }
        updateBrowserActionIcon( currentController );
    }
}


chrome.runtime.onConnect.addListener( function( port )
{
    console.log( 'Port Connect: ' + port.name );
    console.log( port );

    var controller = new BackgroundController( port );

    controllers.splice( 0, 0, controller );

    controller.port.onMessage.addListener( function( message )
    {
        handleMessage( message, controller );
    } );

    controller.port.onDisconnect.addListener( function()
    {
        handleDisconnect( controller );
    } );
} );


function showAutoPauseNotification( controller, notificationLength )
{
    var notificationOptions = {
        type : 'basic',
        iconUrl : controller.content.image ? controller.content.image : 'res/icon128.png',
        title : controller.content.title,
        message : controller.content.caption,
        contextMessage : controller.content.subcaption,
        buttons : [ { title : 'Resume Playback (will prevent future auto-pausing of tab)' } ],
        requireInteraction : true,
        isClickable : true
    };

    chrome.notifications.create( null, notificationOptions, function( notificationId )
    {
        notifications[ notificationId ] = controller;
        pauseNotifications[ notificationId ] = controller;

        if( !( notificationLength >= 1 ) )
        {
            notificationLength = 10;
        }

        setTimeout( function()
        {
            chrome.notifications.clear( notificationId );
        }, notificationLength * 1000 );
    } );
}


function autoPause( exclusion )
{
    if( settings[ Settings.AutoPauseEnabled ] )
    {
        for( var i = 0; i < controllers.length; i++ )
        {
            if( controllers[ i ] !== exclusion && !controllers[ i ].paused && !autoPauseDisabledTabs[ controllers[ i ].port.sender.tab.id ] )
            {
                console.log( 'Auto-Pausing ' + controllers[ i ].name );
                controllers[ i ].pause();

                if( settings[ Settings.ShowAutoPausedNotification ] )
                {
                    showAutoPauseNotification( controllers[ i ], settings[ Settings.NotificationLength ] );
                }
            }
        }
    }
}


function pause()
{
    for( var i = 0; i < controllers.length; i++ )
    {
        if( !controllers[ i ].paused )
        {
            console.log( 'Pausing ' + controllers[ i ].name );
            controllers[ i ].pause();
        }
    }
}


function play()
{
    if( currentController )
    {
        currentController.play();
    }
}


function next()
{
    if( currentController )
    {
        currentController.next();
    }
}


function previous()
{
    if( currentController )
    {
        currentController.previous();
    }
}


function like()
{
    if( currentController )
    {
        currentController.like();
    }
}


function unlike()
{
    if( currentController )
    {
        currentController.unlike();
    }
}


function dislike()
{
    if( currentController )
    {
        currentController.dislike();
    }
}


function undislike()
{
    if( currentController )
    {
        currentController.undislike();
    }
}


function volumeUp()
{
    if( currentController )
    {
        currentController.volumeUp();
    }
}


function volumeDown()
{
    if( currentController )
    {
        currentController.volumeDown();
    }
}


function playPause()
{
    if( currentController )
    {
        if( currentController.paused )
        {
            currentController.play();
        }
        else
        {
            currentController.pause();
        }
    }
    else if( controllers.length === 0 )
    {
        if( siteToURL[ settings[ Settings.DefaultSite ] ] )
        {
            chrome.tabs.create( { url : siteToURL[ settings[ Settings.DefaultSite ] ] } );
        }
    }
}


chrome.notifications.onClicked.addListener( function( notificationId )
{
    chrome.notifications.clear( notificationId );

    var controller = notifications[ notificationId ];
    if( controller )
    {
        var windowId = controller.port.sender.tab.windowId;
        var tabId = controller.port.sender.tab.id;
        chrome.windows.update( windowId, { focused : true } );
        chrome.tabs.update( tabId, { active : true } );
    }
} );


chrome.notifications.onButtonClicked.addListener( function( notificationId, buttonIndex )
{
    console.log( 'Notification Button Clicked - Notification: ' + notificationId + ' Button: ' + buttonIndex );
    if( notificationId === lastContentChangeNotification )
    {
        if( buttonIndex === 0 )
        {
            chrome.notifications.clear( lastContentChangeNotification );
            next();
        }
    }
    else if( pauseNotifications[ notificationId ] )
    {
        if( buttonIndex === 0 )
        {
            var controller = pauseNotifications[ notificationId ];
            autoPauseDisabledTabs[ controller.port.sender.tab.id ] = true;
            controller.play();

            chrome.notifications.clear( notificationId );
        }
    }
} );


chrome.notifications.onClosed.addListener( function( notificationId )
{
    delete notifications[ notificationId ];
    if( notificationId === lastContentChangeNotification )
    {
        lastContentChangeNotification = null;
    }
    else
    {
        delete pauseNotifications[ notificationId ];
    }
} );


chrome.runtime.onMessage.addListener( function( message, sender, sendResponse )
{
    if( message.type === Message.types.from_popup.PLAY )
    {
        console.log( 'Recieved from Popup: PLAY' );
        playPause();
    }
    else if( message.type === Message.types.from_popup.NEXT )
    {
        console.log( 'Recieved from Popup: NEXT' );
        next();
    }
    else if( message.type === Message.types.from_popup.PREVIOUS )
    {
        console.log( 'Recieved from Popup: PREVIOUS' );
        previous();
    }
    else if( message.type === Message.types.from_popup.DISLIKE )
    {
        console.log( 'Recieved from Popup: DISLIKE' );
        dislike();
    }
    else if( message.type === Message.types.from_popup.UNDISLIKE )
    {
        console.log( 'Recieved from Popup: UNDISLIKE' );
        undislike();
    }
    else if( message.type === Message.types.from_popup.LIKE )
    {
        console.log( 'Recieved from Popup: LIKE' );
        like();
    }
    else if( message.type === Message.types.from_popup.UNLIKE )
    {
        console.log( 'Recieved from Popup: UNLIKE' );
        unlike();
    }
} );


chrome.runtime.onInstalled.addListener( function( details )
{
    var version = chrome.runtime.getManifest().version;

    if( details.reason === 'install' )
    {
        console.log( 'Installing version ' + version );
    }
    else if( details.reason === 'update' )
    {
        console.log( 'Updating to version ' + version );
    }
    else
    {
        console.log( 'Not installing or updating:' );
        console.log( details );
    }

    chrome.storage.sync.get( null, function( settings )
    {
        var defaults = getDefaultSettings();

        var updatedSettings = $.extend( { }, defaults, settings );

        console.log( 'Updating Settings' );

        chrome.storage.sync.set( updatedSettings );

        if( updatedSettings[ Settings.ShowChangeLogOnUpdate ] )
        {
            chrome.tabs.create( { url : 'change_log/change_log.html' } );
        }
    } );
} );


chrome.idle.onStateChanged.addListener( function( newState )
{
    console.log( 'State Changed: ' + newState );
    if( currentController && !currentController.paused )
    {
        if( newState === 'locked' )
        {
            if( settings[ Settings.PauseOnLock ] )
            {
                console.log( 'Pausing due to Lock' );
                pause();
            }
        }
        else if( newState === 'idle' )
        {
            if( settings[ Settings.PauseOnInactivity ] && currentController.allowLockOnInactivity )
            {
                console.log( 'Pausing due to Inactivity' );
                pause();
            }
        }
    }
} );


chrome.storage.onChanged.addListener( function( changes, ns )
{
    console.log( 'Settings Changed:' );

    for( var setting in changes )
    {
        console.log( 'Setting: ' + setting + ' - Old: ' + settings[ setting ] + ' - New: ' + changes[ setting ].newValue );
        settings[ setting ] = changes[ setting ].newValue;
    }

    if( typeof changes[ Settings.InactivityTimeout ] !== 'undefined' )
    {
        chrome.idle.setDetectionInterval( settings[ Settings.InactivityTimeout ] );
    }

    if( typeof changes[ Settings.AutoPauseEnabled ] !== 'undefined' )
    {
        chrome.contextMenus.update( 'auto_pause_enabled', { checked : settings[ Settings.AutoPauseEnabled ] } );
    }
} );


chrome.tabs.onActivated.addListener( function( activateInfo )
{
    chrome.contextMenus.update( 'auto_pause_enabled_for_tab', { checked : !autoPauseDisabledTabs[ activateInfo.tabId ] } );
} );


chrome.contextMenus.onClicked.addListener( function( info, tab )
{
    if( info.menuItemId === 'auto_pause_enabled' )
    {
        console.log( 'Auto-Pause Enabled: ' + info.checked );
        chrome.storage.sync.set( { [ Settings.AutoPauseEnabled ] : info.checked } );
    }
    else if( info.menuItemId === 'auto_pause_enabled_for_tab' )
    {
        console.log( 'Auto-Pause Enabled for Tab: Tab - ' + tab.id + ' : ' + info.checked );
        autoPauseDisabledTabs[ tab.id ] = !info.checked;
    }
} );


( function onStart()
{
    console.log( 'Background Start' );
    chrome.storage.sync.get( null, function( s )
    {
        console.log( 'Background Start - Retrieved Settings' );

        settings = s;

        chrome.idle.setDetectionInterval( settings[ Settings.InactivityTimeout ] );

        var autoPauseContextMenu = {
            type : 'checkbox',
            id : 'auto_pause_enabled',
            title : 'Auto-Pause Enabled',
            checked : settings[ Settings.AutoPauseEnabled ],
            contexts : [ 'browser_action' ]
        };
        chrome.contextMenus.create( autoPauseContextMenu );

        var autoPauseTabContextMenu = {
            type : 'checkbox',
            id : 'auto_pause_enabled_for_tab',
            title : 'Auto-Pause Enabled for Tab',
            checked : false,
            contexts : [ 'browser_action' ]
        };
        chrome.contextMenus.create( autoPauseTabContextMenu );
    } );
} )();