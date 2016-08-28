var controllers = [ ];
var currentController = null;

var lastNotification = null;

var pauseOnLock = false;
var pauseOnInactivity = false;


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
                pause( currentController );
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

        if( currentController === controller )
        {
            chrome.storage.sync.get( null, function( settings )
            {
                if( settings[ Settings.Notifications[ controller.name ] ] )
                {
                    if( !controller.active
                    || !settings[ Settings.NoActiveWindowNotifications ] )
                    {
                        var contentInfo = message.data;
                        console.log( 'Content Info:' );
                        console.log( contentInfo );

                        var notificationOptions = {
                            type : 'basic',
                            iconUrl : contentInfo.image ? contentInfo.image : 'res/icon128.png',
                            title : contentInfo.title,
                            message : contentInfo.caption,
                            contextMessage : contentInfo.subcaption,
                            buttons : [ { title : 'Next' } ]
                        };

                        console.log( 'Showing notification for ' + controller.name );
                        console.log( notificationOptions );
                        chrome.notifications.create( null, notificationOptions, function( notificationId )
                        {
                            lastNotification = notificationId;
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


function pause( exclusion )
{
    for( var i = 0; i < controllers.length; i++ )
    {
        if( controllers[ i ] !== exclusion )
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
    if( notificationId === lastNotification )
    {
        if( buttonIndex === 0 )
        {
            chrome.notifications.clear( lastNotification );
            lastNotification = null;

            next();
        }
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

    var installing = ( details.reason === 'install' );
    var updating = ( details.reason === 'update' );

    if( installing )
    {
        console.log( 'Installing version ' + version );
    }
    else if( updating )
    {
        console.log( 'Updating to version ' + version );
    }
    else
    {
        console.log( 'Not installing or updating:' );
        console.log( details );
        return;
    }

    var settings = { };

    if( installing || ( updating && version === '1.0' ) )
    {
        settings[ Settings.Notifications.Pandora ] = false;
        settings[ Settings.Notifications.Spotify ] = false;
        settings[ Settings.Notifications.Youtube ] = false;
        settings[ Settings.Notifications.GooglePlayMusic ] = false;

        settings[ Settings.DefaultSite ] = "Pandora";
    }

    if( installing || ( updating && version === '1.1' ) )
    {
        settings[ Settings.PauseOnLock ] = true;
        settings[ Settings.PauseOnInactivity ] = false;
        settings[ Settings.InactivityTimeout ] = 60 * 5;
    }

    if( installing || ( updating && version === '1.2.0' ) )
    {
        settings[ Settings.NoActiveWindowNotifications ] = false;
    }

    if( installing || ( updating && version === '1.3.0' ) )
    {
        settings[ Settings.Notifications.Bandcamp ] = false;
    }

    if( installing || ( updating && version === '1.7.0' ) )
    {
        settings[ Settings.Notifications.Netflix ] = false;
    }

    console.log( settings );

    chrome.storage.sync.set( settings );
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
} );

( function onStart()
{
    chrome.storage.sync.get( [ Settings.PauseOnLock, Settings.PauseOnInactivity, Settings.InactivityTimeout ], function( items )
    {
        pauseOnLock = items[ Settings.PauseOnLock ];
        pauseOnInactivity = items[ Settings.PauseOnInactivity ];
        if( pauseOnInactivity )
        {
            chrome.idle.setDetectionInterval( items[ Settings.InactivityTimeout ] );
        }
        console.log( 'Start - Pause on Lock: ' + pauseOnLock + ' Pause on Inactivity: ' + pauseOnInactivity + ' Inactivity Timeout: ' + items[ Settings.InactivityTimeout ] );
    } );
} )();