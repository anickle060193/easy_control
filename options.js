var settings = null


function saveSettings()
{
    chrome.storage.sync.set( settings, function()
    {
        console.log( 'Saved!' );
    } );
}


function updateUI()
{
    $( '#notificationsPandora' ).prop( 'checked', settings[ Settings.Notifications.Pandora ] );
    $( '#notificationsSpotify' ).prop( 'checked', settings[ Settings.Notifications.Spotify ] );
    $( '#notificationsYoutube' ).prop( 'checked', settings[ Settings.Notifications.Youtube ] );
    $( '#notificationsGooglePlayMusic' ).prop( 'checked', settings[ Settings.Notifications.GooglePlayMusic ] );

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

    if( this.id.endsWith( 'Pandora' ) )
    {
        settings[ Settings.Notifications.Pandora ] = this.checked;
    }
    else if( this.id.endsWith( 'Spotify' ) )
    {
        settings[ Settings.Notifications.Spotify ] = this.checked;
    }
    else if( this.id.endsWith( 'Youtube' ) )
    {
        settings[ Settings.Notifications.Youtube ] = this.checked;
    }
    else if( this.id.endsWith( 'GooglePlayMusic' ) )
    {
        settings[ Settings.Notifications.GooglePlayMusic ] = this.checked;
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
    else if( this.id === 'noActiveWindowNotifications' )
    {
        settings[ Settings.NoActiveWindowNotifications ] = this.checked;
    }

    if( save )
    {
        saveSettings();
    }

    updateUI();
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