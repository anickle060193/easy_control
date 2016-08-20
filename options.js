var keys = [
    Settings.Notifications.Pandora,
    Settings.Notifications.Spotify,
    Settings.Notifications.Youtube,
    Settings.Notifications.GooglePlayMusic
    ];

var idToSetting = {
    'notificationsPandora' : Settings.Notifications.Pandora,
    'notificationsSpotify' : Settings.Notifications.Spotify,
    'notificationsYoutube' : Settings.Notifications.Youtube,
    'notificationsGooglePlayMusic' : Settings.Notifications.GooglePlayMusic
}


var settings = null


$( 'input[name="notifications"]' ).change( function()
{
    settings[ idToSetting[ this.id ] ] = this.checked;
    chrome.storage.sync.set( settings, function()
    {
        console.log( 'Saved!' );
    } );
} );


$().ready( function()
{
    chrome.storage.sync.get( keys, function( items )
    {
        settings = items;

        console.log( settings );

        for( var id in idToSetting )
        {
            if( idToSetting.hasOwnProperty( id ) )
            {
                console.log( id + ' : ' + idToSetting[ id ] + ' : ' + settings[ idToSetting[ id ] ] );
                $( '#' + id ).prop( 'checked', settings[ idToSetting[ id ] ] );
            }
        }
    } );
} );