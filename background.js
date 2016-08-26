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
    }
    else if( message.type === Message.types.to_background.PAUSE_REPORT )
    {
        var changed = controller.paused != message.data;
        controller.paused = message.data;

        if( !currentController )
        {
            console.log( 'Pause Report: No last Controller' );
            currentController = controller;
            updateBrowserActionIcon( controller );
        }
        else if( controller.name === currentController.name )
        {
            if( changed )
            {
                console.log( 'Pause Report: currentController: ' + controller.paused );

                updateBrowserActionIcon( controller )
            }
        }
        else
        {
            if( !controller.paused )
            {
                console.log( 'Pause Report: Other Controller Unpaused' );
                controllers.splice( controllers.indexOf( controller ), 1 );
                controllers.push( controller )
                currentController = controller;
                pause( currentController );
            }
        }
    }
    else if( message.type === Message.types.to_background.PROGRESS_REPORT )
    {
        controller.progress = message.data;

        if( currentController && controller.name === currentController.name )
        {
            updateBrowserActionIcon( controller );
        }
    }
    else if( message.type === Message.types.to_background.NEW_CONTENT )
    {
        if( controller.name === currentController.name )
        {
            chrome.storage.sync.get( null, function( settings )
            {
                if( settings[ Settings.Notifications[ controller.name ] ] )
                {
                    chrome.tabs.query( { active: true, currentWindow: true }, function( tabs )
                    {
                        if( tabs.length === 0
                        || tabs[ 0 ].id !== controller.port.sender.tab.id
                        || !settings[ Settings.NoActiveWindowNotifications ] )
                        {
                            var contentInfo = message.data;
                            var notificationOptions = {
                                type : 'basic',
                                iconUrl : contentInfo.image ? contentInfo.image : 'res/icon128.png',
                                title : contentInfo.title,
                                message : contentInfo.caption,
                                contextMessage : contentInfo.subcaption,
                                buttons : [ { title : 'Next' } ]
                            };
                            console.log( 'Showing notification for ' + controller.name );
                            console.log( contentInfo );
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
                    } );
                }
            } );
        }
    }
}


function handleDisconnect( controller )
{
    controllers.splice( controllers.indexOf( controller ), 1 );

    console.log( 'Controller Disconnect: ' + controller.name );

    if( controller.name === currentController.name )
    {
        console.log( 'Controller Disconnect: Was last port' );

        if( controllers.length > 0 )
        {
            currentController = controllers[ controllers.length - 1 ];
        }
        else
        {
            currentController = null;
        }
        updateBrowserActionIcon( currentController );
    }
}


chrome.runtime.onConnect.addListener( function( port )
{
    for( var i = 0; i < controllers.length; i++ )
    {
        if( controllers[ i ].name == port.name )
        {
            console.log( 'Refused Duplicate Connection: ' + port.name );
            return;
        }
    }

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
        if( !exclusion || controllers[ i ].name !== exclusion.name )
        {
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

    console.log( settings );

    chrome.storage.sync.set( settings );
} );

chrome.idle.onStateChanged.addListener( function( newState )
{
    console.log( 'State Changed: ' + newState );
    if( currentController && !controller.paused )
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
            if( pauseOnInactivity )
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