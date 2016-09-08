var settings = null


function saveSettings()
{
    chrome.storage.sync.set( settings, function()
    {
        console.log( 'Saved!' );
    } );
}


function getKeyboardShortcutKey( input )
{
    var shortcut = input.value;
    if( shortcut.length > 0 )
    {
        return shortcut[ 0 ];
    }
    else
    {
        return '';
    }
}


function updateUI()
{
    $( '#controlsDisplayControls' ).prop( 'checked', settings[ Settings.Controls.DisplayControls ] );
    $( '#controlsAlwaysDisplayPlaybackSpeed' ).prop( 'disabled', !settings[ Settings.Controls.DisplayControls ] );
    $( '#controlsAlwaysDisplayPlaybackSpeed' ).prop( 'checked', settings[ Settings.Controls.AlwaysDisplayPlaybackSpeed ] );
    $( '#controlsPlaybackSpeedMuchSlower' ).val( settings[ Settings.Controls.PlaybackSpeed.MuchSlower ] );
    $( '#controlsPlaybackSpeedSlower' ).val( settings[ Settings.Controls.PlaybackSpeed.Slower ] );
    $( '#controlsPlaybackSpeedFaster' ).val( settings[ Settings.Controls.PlaybackSpeed.Faster ] );
    $( '#controlsPlaybackSpeedMuchFaster' ).val( settings[ Settings.Controls.PlaybackSpeed.MuchFaster ] );
    $( '#controlsPlaybackSpeedReset' ).val( settings[ Settings.Controls.PlaybackSpeed.Reset ] );

    $( '#notificationsPandora' ).prop( 'checked', settings[ Settings.Notifications.Pandora ] );
    $( '#notificationsSpotify' ).prop( 'checked', settings[ Settings.Notifications.Spotify ] );
    $( '#notificationsYoutube' ).prop( 'checked', settings[ Settings.Notifications.Youtube ] );
    $( '#notificationsGooglePlayMusic' ).prop( 'checked', settings[ Settings.Notifications.GooglePlayMusic ] );
    $( '#notificationsBandcamp' ).prop( 'checked', settings[ Settings.Notifications.Bandcamp ] );
    $( '#notificationsNetflix' ).prop( 'checked', settings[ Settings.Notifications.Netflix ] );
    $( '#notificationsAmazonVideo' ).prop( 'checked', settings[ Settings.Notifications.AmazonVideo ] );
    $( '#notificationsAmazonMusic' ).prop( 'checked', settings[ Settings.Notifications.AmazonMusic ] );
    $( '#notificationsHulu' ).prop( 'checked', settings[ Settings.Notifications.Hulu ] );

    $( '#notificationLength' ).val( settings[ Settings.NotificationLength ] );
    $( '#noActiveWindowNotifications' ).prop( 'checked', settings[ Settings.NoActiveWindowNotifications ] );

    $( '#defaultSite' ).val( settings[ Settings.DefaultSite ] );

    $( '#pauseOnLock' ).prop( 'checked', settings[ Settings.PauseOnLock ] );
    $( '#pauseOnInactivity' ).prop( 'checked', settings[ Settings.PauseOnInactivity ] );
    $( '#inactivityTimeout' ).val( settings[ Settings.InactivityTimeout ] );
    $( '#inactivityTimeout' ).prop( 'disabled', !settings[ Settings.PauseOnInactivity ] );
}


$( 'input, select' ).change( function()
{
    var save = true;

    if( this.id === 'notificationsPandora' )
    {
        settings[ Settings.Notifications.Pandora ] = this.checked;
    }
    else if( this.id === 'notificationsSpotify' )
    {
        settings[ Settings.Notifications.Spotify ] = this.checked;
    }
    else if( this.id === 'notificationsYoutube' )
    {
        settings[ Settings.Notifications.Youtube ] = this.checked;
    }
    else if( this.id === 'notificationsGooglePlayMusic' )
    {
        settings[ Settings.Notifications.GooglePlayMusic ] = this.checked;
    }
    else if( this.id === 'notificationsBandcamp' )
    {
        settings[ Settings.Notifications.Bandcamp ] = this.checked;
    }
    else if( this.id === 'notificationsNetflix' )
    {
        settings[ Settings.Notifications.Netflix ] = this.checked;
    }
    else if( this.id === 'notificationsAmazonVideo' )
    {
        settings[ Settings.Notifications.AmazonVideo ] = this.checked;
    }
    else if( this.id === 'notificationsAmazonMusic' )
    {
        settings[ Settings.Notifications.AmazonMusic ] = this.checked;
    }
    else if( this.id === 'notificationsHulu' )
    {
        settings[ Settings.Notifications.Hulu ] = this.checked;
    }
    else if( this.id === 'defaultSite' )
    {
        settings[ Settings.DefaultSite ] = this.value;
    }
    else if( this.id === 'pauseOnLock' )
    {
        settings[ Settings.PauseOnLock ] = this.checked;
    }
    else if( this.id === 'pauseOnInactivity' )
    {
        settings[ Settings.PauseOnInactivity ] = this.checked;
    }
    else if( this.id === 'inactivityTimeout' )
    {
        var timeout = parseInt( this.value );
        if( timeout >= 15 )
        {
            settings[ Settings.InactivityTimeout ] = timeout;
        }
        else
        {
            save = false;
        }
    }
    else if( this.id === 'notificationLength' )
    {
        var length = parseInt( this.value );
        if( length >= 1 )
        {
            settings[ Settings.NotificationLength ] = length;
        }
        else
        {
            save = false;
        }
    }
    else if( this.id === 'noActiveWindowNotifications' )
    {
        settings[ Settings.NoActiveWindowNotifications ] = this.checked;
    }
    else if( this.id === 'controlsDisplayControls' )
    {
        settings[ Settings.Controls.DisplayControls ] = this.checked;
    }
    else if( this.id === 'controlsAlwaysDisplayPlaybackSpeed' )
    {
        settings[ Settings.Controls.AlwaysDisplayPlaybackSpeed ] = this.checked;
    }
    else if( this.id === 'controlsPlaybackSpeedMuchSlower' )
    {
        settings[ Settings.Controls.PlaybackSpeed.MuchSlower ] = getKeyboardShortcutKey( this );
    }
    else if( this.id === 'controlsPlaybackSpeedSlower' )
    {
        settings[ Settings.Controls.PlaybackSpeed.Slower ] = getKeyboardShortcutKey( this );
    }
    else if( this.id === 'controlsPlaybackSpeedFaster' )
    {
        settings[ Settings.Controls.PlaybackSpeed.Faster ] = getKeyboardShortcutKey( this );
    }
    else if( this.id === 'controlsPlaybackSpeedMuchFaster' )
    {
        settings[ Settings.Controls.PlaybackSpeed.MuchFaster ] = getKeyboardShortcutKey( this );
    }
    else if( this.id === 'controlsPlaybackSpeedReset' )
    {
        settings[ Settings.Controls.PlaybackSpeed.Reset ] = getKeyboardShortcutKey( this );
    }
    else
    {
        save = false;
    }

    if( save )
    {
        saveSettings();
    }

    updateUI();
} );


$( '.keyboardShortcutEntry' ).click( function()
{
    this.value = '';
} );


$( '.keyboardShortcutEntry' ).keypress( function( event )
{
    event.preventDefault();
    this.value = String.fromCharCode( event.charCode );
    $( this ).change();
} );


$( '#setKeyboardShortcuts' ).click( function()
{
    chrome.tabs.query( { active : true, currentWindow : true }, function( tabs )
    {
        if( tabs.length === 1 )
        {
            chrome.tabs.update( tabs[ 0 ].id, { url : 'chrome://extensions/configureCommands' } );
        }
    } );
} );


$( '#createGithubIssue' ).click( function()
{
    chrome.tabs.create( { url : 'https://github.com/anickle060193/easy_control/issues/new' } );
} );


$( '#viewChangeLog' ).click( function()
{
    chrome.tabs.create( { url : 'change_log.html' } );
} );


$().ready( function()
{
    chrome.storage.sync.get( null, function( items )
    {
        console.log( items );

        settings = items;
        updateUI();
    } );
} );