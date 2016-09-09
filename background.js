var controllers = [ ];
var currentController = null;

var lastContentChangeNotification = null;
var pauseNotifications = { };

var pauseOnLock = false;
var pauseOnInactivity = false;

var autoPauseDisabledTabs = { };


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
                controllers.splice( controllers.indexOf( controller ), 1 );
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
            chrome.storage.sync.get( null, function( settings )
            {
                if( settings[ Settings.Notifications[ controller.name ] ] )
                {
                    if( !controller.active
                    || !settings[ Settings.NoActiveWindowNotifications ] )
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
                            requireInteraction : true
                        };

                        console.log( 'Showing notification for ' + controller.name );
                        console.log( notificationOptions );
                        chrome.notifications.create( null, notificationOptions, function( notificationId )
                        {
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
            } );
        }
    }
}


function handleDisconnect( controller )
{
    controllers.splice( controllers.indexOf( controller ), 1 );

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
        requireInteraction : true
    };

    chrome.notifications.create( null, notificationOptions, function( notificationId )
    {
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
    chrome.storage.sync.get( null, function( settings )
    {
        if( settings[ Settings.AutoPauseEnabled ] )
        {
            for( var i = 0; i < controllers.length; i++ )
            {
                if( controllers[ i ] !== exclusion && !controllers[ i ].paused && !autoPauseDisabledTabs[ controllers[ i ].port.sender.tab.id ] )
                {
                    console.log( 'Auto-Pausing ' + controllers[ i ].name );
                    controllers[ i ].pause();

                    showAutoPauseNotification( controllers[ i ], settings[ Settings.NotificationLength ] );
                }
            }
        }
    } );
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
        chrome.storage.sync.get( Settings.DefaultSite, function( settings )
        {
            var defaultSite = settings[ Settings.DefaultSite ];
            if( siteToURL[ defaultSite ] )
            {
                chrome.tabs.create( { url : siteToURL[ defaultSite ] } );
            }
        } );
    }
}

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
    else if( message.type === Message.types.to_background.NAME_REQUEST )
    {
        console.log( 'Recieved: NAME REQUEST' );
        sendResponse( 'window_' + sender.tab.windowId + '_frame_' + sender.frameId + '_tab_' + sender.tab.id );
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
        return;
    }

    chrome.storage.sync.get( null, function( settings )
    {
        var defaults = { };

        defaults[ Settings.Notifications.Pandora ] = false;
        defaults[ Settings.Notifications.Spotify ] = false;
        defaults[ Settings.Notifications.Youtube ] = false;
        defaults[ Settings.Notifications.GooglePlayMusic ] = false;
        defaults[ Settings.Notifications.Bandcamp ] = false;
        defaults[ Settings.Notifications.Netflix ] = false;
        defaults[ Settings.Notifications.AmazonVideo ] = false;
        defaults[ Settings.Notifications.AmazonMusic ] = false;
        defaults[ Settings.Notifications.Hulu ] = false;

        defaults[ Settings.NotificationLength ] = 10;
        defaults[ Settings.NoActiveWindowNotifications ] = false;
        defaults[ Settings.DefaultSite ] = "Pandora";
        defaults[ Settings.PauseOnLock ] = true;
        defaults[ Settings.PauseOnInactivity ] = false;
        defaults[ Settings.InactivityTimeout ] = 60 * 5;
        defaults[ Settings.AutoPauseEnabled ] = true;
        defaults[ Settings.ShowChangeLogOnUpdate ] = true;

        defaults[ Settings.Controls.DisplayControls ] = true;
        defaults[ Settings.Controls.AlwaysDisplayPlaybackSpeed ] = true;
        defaults[ Settings.Controls.PlaybackSpeed.MuchSlower ] = '';
        defaults[ Settings.Controls.PlaybackSpeed.Slower ] = 's';
        defaults[ Settings.Controls.PlaybackSpeed.Faster ] = 'd';
        defaults[ Settings.Controls.PlaybackSpeed.MuchFaster ] = '';
        defaults[ Settings.Controls.PlaybackSpeed.Reset ] = 'r';

        var updatedSettings = $.extend( { }, defaults, settings );

        console.log( 'Updating settings:' );
        console.log( updatedSettings );

        chrome.storage.sync.set( updatedSettings );

        if( updatedSettings[ Settings.ShowChangeLogOnUpdate ] )
        {
            chrome.tabs.create( { url : 'change_log.html' } );
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
            if( pauseOnLock )
            {
                console.log( 'Pausing due to Lock' );
                pause();
            }
        }
        else if( newState === 'idle' )
        {
            if( pauseOnInactivity && currentController.allowLockOnInactivity )
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
    console.log( changes );

    if( changes[ Settings.PauseOnLock ] )
    {
        pauseOnLock = changes[ Settings.PauseOnLock ].newValue;
        console.log( 'Pause on Lock: ' + pauseOnLock );
    }

    if( changes[ Settings.PauseOnInactivity ] || changes[ Settings.InactivityTimeout ] )
    {
        chrome.storage.sync.get( [ Settings.PauseOnInactivity, Settings.InactivityTimeout ], function( items )
        {
            pauseOnInactivity = items[ Settings.PauseOnInactivity ];
            console.log( 'Pause on Inactivity: ' + pauseOnInactivity );
            if( pauseOnInactivity )
            {
                chrome.idle.setDetectionInterval( items[ Settings.InactivityTimeout ] );
                console.log( 'Inactivity Timeout: ' + items[ Settings.InactivityTimeout ] );
            }
        } );
    }

    if( changes[ Settings.AutoPauseEnabled ] )
    {
        chrome.contextMenus.update( 'auto_pause_enabled', { checked : changes[ Settings.AutoPauseEnabled ].newValue } );
    }
} );

chrome.contextMenus.onClicked.addListener( function( info, tab )
{
    if( info.menuItemId === 'auto_pause_enabled' )
    {
        console.log( 'Auto-Pause Enabled: ' + info.checked );
        chrome.storage.sync.set( { [ Settings.AutoPauseEnabled ] : info.checked } );
    }
} );

( function onStart()
{
    chrome.storage.sync.get( null, function( settings )
    {
        pauseOnLock = settings[ Settings.PauseOnLock ];
        pauseOnInactivity = settings[ Settings.PauseOnInactivity ];
        if( pauseOnInactivity )
        {
            chrome.idle.setDetectionInterval( settings[ Settings.InactivityTimeout ] );
        }
        console.log( 'Start - Pause on Lock: ' + pauseOnLock + ' Pause on Inactivity: ' + pauseOnInactivity + ' Inactivity Timeout: ' + settings[ Settings.InactivityTimeout ] );

        var contextMenuProperties = {
            type : 'checkbox',
            id : 'auto_pause_enabled',
            title : 'Auto-Pause Enabled',
            checked : settings[ Settings.AutoPauseEnabled ],
            contexts : [ 'browser_action' ]
        };
        chrome.contextMenus.create( contextMenuProperties );
    } );
} )();