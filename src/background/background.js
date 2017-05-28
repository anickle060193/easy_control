Background = ( function()
{
    var CONTEXT_MENU_AUTO_PAUSE_ENABLED = 'auto_pause_enabled';
    var CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB = 'auto_pause_enabled_for_tab';

    var NEW_CONTENT_NOTIFICATION_PAUSE_BUTTON = 0;
    var NEW_CONTENT_NOTIFICATION_NEXT_BUTTON = 1;

    var AUTO_PAUSE_NOTIFICATION_RESUME_BUTTON = 0;

    var controllers = [ ];
    var currentController = null;

    var newContentNotifications = { };
    var autoPausedNotifications = { };

    var autoPauseDisabledTabs = { };

    var settings = { };

    var tabs = { };


    function handleMessage( message, controller )
    {
        if( message.type === Message.types.to_background.INITIALIZE )
        {
            console.log( 'Controller Initialized: ' + controller.name );
            controller.color = message.data.color;
            controller.allowPauseOnInactivity = message.data.allowPauseOnInactivity;
            controller.hostname = message.data.hostname;
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
                    BackgroundIcon.updateBrowserActionIcon( currentController );
                }
            }
        }
        else if( message.type === Message.types.to_background.NEW_CONTENT )
        {
            console.log( 'New Content - ' + controller.name );
            controller.content = message.data

            if( currentController === controller )
            {
                for( var notificationId in newContentNotifications )
                {
                    chrome.notifications.clear( notificationId );
                }
                newContentNotifications = { };

                if( settings[ Settings.Notifications[ controller.name ] ] )
                {
                    if( !controller.active || !settings[ Settings.NoActiveWindowNotifications ] )
                    {
                        console.log( 'Content Info:' );
                        console.log( controller.content );

                        var buttons = [ ];
                        buttons[ NEW_CONTENT_NOTIFICATION_PAUSE_BUTTON ] = { title : 'Pause' };
                        buttons[ NEW_CONTENT_NOTIFICATION_NEXT_BUTTON ] = { title : 'Next' };

                        var notificationOptions = {
                            type : 'basic',
                            iconUrl : controller.content.image ? controller.content.image : 'res/icon128.png',
                            title : controller.content.title,
                            message : controller.content.caption,
                            contextMessage : controller.content.subcaption,
                            buttons : buttons,
                            requireInteraction : true,
                            isClickable : true
                        };

                        console.log( 'Showing notification for ' + controller.name );
                        console.log( notificationOptions );
                        chrome.notifications.create( null, notificationOptions, function( notificationId )
                        {
                            if( Common.checkError() )
                            {
                                newContentNotifications[ notificationId ] = controller;
                                var notificationLength = settings[ Settings.NotificationLength ];
                                if( !( notificationLength >= 1 ) )
                                {
                                    notificationLength = 10;
                                }

                                setTimeout( function()
                                {
                                    chrome.notifications.clear( notificationId );
                                }, notificationLength * 1000 );
                            }
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
            BackgroundIcon.updateBrowserActionIcon( currentController );
        }
    }


    function showAutoPauseNotification( controller, notificationLength )
    {
        var buttons = [ ];
        buttons[ AUTO_PAUSE_NOTIFICATION_RESUME_BUTTON ] = { title : 'Resume Playback (will prevent future auto-pausing of tab)' };

        var notificationOptions = {
            type : 'basic',
            iconUrl : controller.content.image ? controller.content.image : 'res/icon128.png',
            title : controller.content.title,
            message : controller.content.caption,
            contextMessage : controller.content.subcaption,
            buttons : buttons,
            requireInteraction : true,
            isClickable : true
        };

        chrome.notifications.create( null, notificationOptions, function( notificationId )
        {
            if( Common.checkError() )
            {
                autoPausedNotifications[ notificationId ] = controller;

                if( !( notificationLength >= 1 ) )
                {
                    notificationLength = 10;
                }

                setTimeout( function()
                {
                    chrome.notifications.clear( notificationId );
                }, notificationLength * 1000 );
            }
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
            var url = Common.siteToURL( settings[ Settings.DefaultSite ] );
            if( url )
            {
                chrome.tabs.create( { url : url }, function( tab )
                {
                    BackgroundUtilities.focusTab( tab );
                } );
            }
        }
    }


    function copyContentLink()
    {
        console.log( currentController );
        if( currentController && currentController.content && currentController.content.link )
        {
            console.log( 'Copying content link: ' + currentController.content.link );
            var input = $( '<input>' )
                .prop( 'type', 'text' )
                .val( currentController.content.link )
                .appendTo( document.body );
            input[ 0 ].select();

            try
            {
                document.execCommand( 'copy' );
            }
            catch( e )
            {
                console.log( 'Copy Failed - ' + e );
            }

            input.remove();
        }
        else
        {
            console.log( 'No content to copy' );
        }
    }


    function onStart()
    {
        console.log( 'Background Start' );

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


        chrome.notifications.onClicked.addListener( function( notificationId )
        {
            chrome.notifications.clear( notificationId );

            if( typeof newContentNotifications[ notificationId ] !== 'undefined' )
            {
                var controller = newContentNotifications[ notificationId ];
                BackgroundUtilities.focusTab( controller.port.sender.tab );
            }
            else if( typeof autoPausedNotifications[ notificationId ] !== 'undefined' )
            {
                var controller = autoPausedNotifications[ notificationId ];
                BackgroundUtilities.focusTab( controller.port.sender.tab );
            }
        } );


        chrome.notifications.onButtonClicked.addListener( function( notificationId, buttonIndex )
        {
            console.log( 'Notification Button Clicked - Notification: ' + notificationId + ' Button: ' + buttonIndex );
            if( typeof newContentNotifications[ notificationId ] !== 'undefined' )
            {
                var controller = newContentNotifications[ notificationId ];

                if( buttonIndex === NEW_CONTENT_NOTIFICATION_PAUSE_BUTTON )
                {
                    controller.pause();
                }
                else if( buttonIndex === NEW_CONTENT_NOTIFICATION_NEXT_BUTTON )
                {
                    controller.next();
                }

                chrome.notifications.clear( notificationId );
            }
            else if( typeof autoPausedNotifications[ notificationId ] !== 'undefined' )
            {
                if( buttonIndex === AUTO_PAUSE_NOTIFICATION_RESUME_BUTTON )
                {
                    var controller = autoPausedNotifications[ notificationId ];
                    autoPauseDisabledTabs[ controller.port.sender.tab.id ] = true;
                    controller.play();
                }

                chrome.notifications.clear( notificationId );
            }
        } );


        chrome.notifications.onClosed.addListener( function( notificationId )
        {
            if( typeof newContentNotifications[ notificationId ] !== 'undefined' )
            {
                delete newContentNotifications[ notificationId ];
            }
            else if( typeof autoPausedNotifications[ notificationId ] !== 'undefined' )
            {
                delete autoPausedNotifications[ notificationId ];
            }
        } );


        chrome.runtime.onInstalled.addListener( function( details )
        {
            var version = chrome.runtime.getManifest().version;

            var possiblyShowChangelog = false;
            if( details.reason === 'install' )
            {
                console.log( 'Installing version ' + version );
                possiblyShowChangelog = true;
            }
            else if( details.reason === 'update' )
            {
                console.log( 'Updating to version ' + version );
                possiblyShowChangelog = true;
            }
            else
            {
                console.log( 'Not installing or updating:' );
                console.log( details );
            }

            var autoPauseContextMenu = {
                type : 'checkbox',
                id : CONTEXT_MENU_AUTO_PAUSE_ENABLED,
                title : 'Auto-Pause Enabled',
                checked : true,
                contexts : [ 'browser_action' ]
            };
            chrome.contextMenus.create( autoPauseContextMenu );

            var autoPauseTabContextMenu = {
                type : 'checkbox',
                id : CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB,
                title : 'Auto-Pause Enabled for Tab',
                checked : true,
                contexts : [ 'browser_action' ]
            };
            chrome.contextMenus.create( autoPauseTabContextMenu );

            chrome.storage.sync.get( null, function( settings )
            {
                var defaults = Common.getDefaultSettings();

                var updatedSettings = $.extend( { }, defaults, settings );

                console.log( 'Updating Settings' );

                chrome.storage.sync.set( updatedSettings );

                if( possiblyShowChangelog && updatedSettings[ Settings.ShowChangeLogOnUpdate ] )
                {
                    chrome.tabs.create( { url : 'change_log/change_log.html' } );
                }
            } );
        } );


        chrome.runtime.onStartup.addListener( function()
        {
            console.log( 'Background - onStartup()' );
        } );


        chrome.runtime.onSuspend.addListener( function()
        {
            console.log( 'Background - onSuspend()' );
        } );


        chrome.runtime.onSuspendCanceled.addListener( function()
        {
            console.log( 'Background - onSuspendCanceled()' );
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
                    if( settings[ Settings.PauseOnInactivity ] && currentController.allowPauseOnInactivity )
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


        function urlUpdated( tab )
        {
            var hostname = new URL( tab.url ).hostname;
            if( hostname )
            {
                $.each( controllers, function( i, controller )
                {
                    if( controller.port.sender.tab.id !== tab.id
                     && controller.hostname
                     && hostname.includes( controller.hostname )
                     && settings[ Settings.OpenInExisting[ controller.name ] ] )
                    {
                        console.log( 'Already have ' + controller.name + ' controller.' );
                        chrome.tabs.remove( tab.id );

                        var existingTab = controller.port.sender.tab;

                        BackgroundUtilities.focusTab( existingTab );

                        controller.openContent( tab.url );

                        return false;
                    }
                } );
            }
        }


        chrome.tabs.onCreated.addListener( function( tab )
        {
            tabs[ tab.id ] = tab.url;
            if( tab.url )
            {
                urlUpdated( tab );
            }
        } );


        chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab )
        {
            if( typeof changeInfo.url !== 'undefined' )
            {
                if( tabs[ tabId ] !== tab.url )
                {
                    urlUpdated( tab );
                    tabs[ tabId ] = tab.url;
                }
            }
        } );


        chrome.tabs.onRemoved.addListener( function( tabId, removeInfo )
        {
            delete tabs[ tabId ];
        } );


        chrome.tabs.onActivated.addListener( function( activateInfo )
        {
            chrome.contextMenus.update( CONTEXT_MENU_AUTO_PAUSE_ENABLED, { checked : settings[ Settings.AutoPauseEnabled ] } );
            chrome.contextMenus.update( CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB, { checked : !autoPauseDisabledTabs[ activateInfo.tabId ] } );
        } );


        chrome.contextMenus.onClicked.addListener( function( info, tab )
        {
            if( info.menuItemId === CONTEXT_MENU_AUTO_PAUSE_ENABLED )
            {
                console.log( 'Auto-Pause Enabled: ' + info.checked );
                chrome.storage.sync.set( { [ Settings.AutoPauseEnabled ] : info.checked } );
            }
            else if( info.menuItemId === CONTEXT_MENU_AUTO_PAUSE_ENABLED_FOR_TAB )
            {
                console.log( 'Auto-Pause Enabled for Tab: Tab - ' + tab.id + ' : ' + info.checked );
                autoPauseDisabledTabs[ tab.id ] = !info.checked;
            }
        } );


        chrome.storage.sync.get( null, function( s )
        {
            console.log( 'Background Start - Retrieved Settings' );

            settings = s;

            chrome.idle.setDetectionInterval( settings[ Settings.InactivityTimeout ] );
        } );
    }

    return {
        playPause : playPause,
        next : next,
        previous : previous,
        like : like,
        unlike : unlike,
        dislike : dislike,
        undislike : undislike,
        volumeUp : volumeUp,
        volumeDown : volumeDown,
        onStart : onStart,
        copyContentLink : copyContentLink
    };
} )();


Background.onStart();