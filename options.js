var keys = [
    Settings.Notifications.Pandora,
    Settings.Notifications.Spotify,
    Settings.Notifications.Youtube,
    Settings.Notifications.GooglePlayMusic,
    Settings.DefaultSite
    ];


var settings = null


function saveSettings()
{
    chrome.storage.sync.set( settings, function()
    {
        console.log( 'Saved!' );
    } );
}

$( 'input[name="notifications"]' ).change( function()
{
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
    
    saveSettings();
} );


$( '#defaultSite' ).change( function()
{
    settings[ Settings.DefaultSite ] = this.value;
    
    saveSettings();
} );


$().ready( function()
{
    chrome.storage.sync.get( keys, function( items )
    {
        settings = items;

        console.log( settings );
        
        $( '#notificationsPandora' ).prop( 'checked', settings[ Settings.Notifications.Pandora ] );
        $( '#notificationsSpotify' ).prop( 'checked', settings[ Settings.Notifications.Spotify ] );
        $( '#notificationsYoutube' ).prop( 'checked', settings[ Settings.Notifications.Youtube ] );
        $( '#notificationsGooglePlayMusic' ).prop( 'checked', settings[ Settings.Notifications.GooglePlayMusic ] );
        
        $( '#defaultSite' ).val( settings[ Settings.DefaultSite ] );
    } );
} );