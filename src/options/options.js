var settings = null


function saveSettings()
{
    chrome.storage.sync.set( settings, function()
    {
        console.log( 'Saved!' );
        console.log( settings );
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
    $( '#notificationsPandora' ).prop( 'checked', settings[ Settings.Notifications.Pandora ] );
    $( '#notificationsSpotify' ).prop( 'checked', settings[ Settings.Notifications.Spotify ] );
    $( '#notificationsYoutube' ).prop( 'checked', settings[ Settings.Notifications.Youtube ] );
    $( '#notificationsGooglePlayMusic' ).prop( 'checked', settings[ Settings.Notifications.GooglePlayMusic ] );
    $( '#notificationsBandcamp' ).prop( 'checked', settings[ Settings.Notifications.Bandcamp ] );
    $( '#notificationsNetflix' ).prop( 'checked', settings[ Settings.Notifications.Netflix ] );
    $( '#notificationsAmazonVideo' ).prop( 'checked', settings[ Settings.Notifications.AmazonVideo ] );
    $( '#notificationsAmazonMusic' ).prop( 'checked', settings[ Settings.Notifications.AmazonMusic ] );
    $( '#notificationsHulu' ).prop( 'checked', settings[ Settings.Notifications.Hulu ] );


    $( 'input[type="checkbox"][data-key]' ).each( function()
    {
        this.checked = settings[ this.dataset.key ];
    } );

    $( 'input[type="text"][data-key]' ).each( function()
    {
        this.value = settings[ this.dataset.key ];
    } );

    $( 'input[type="number"][data-key]' ).each( function()
    {
        this.value = settings[ this.dataset.key ];
    } );

    $( 'select[data-key]' ).each( function()
    {
        this.value = settings[ this.dataset.key ];
    } );

    $( 'textarea[data-key]' ).each( function()
    {
        this.value = settings[ this.dataset.key ].join( '\n' );
    } );

    $( '[data-dependency]' ).each( function()
    {
        this.disabled = !settings[ this.dataset.dependency ];
    } );
}


function registerHandlers()
{
    $( 'input[type="checkbox"][data-key]' ).change( function()
    {
        settings[ this.dataset.key ] = this.checked;

        saveSettings();
        updateUI();
    } );


    $( 'input[type="text"][data-key].keyboardShortcutEntry' ).change( function()
    {
        settings[ this.dataset.key ] = getKeyboardShortcutKey( this );

        saveSettings();
        updateUI();
    } );


    $( 'input[type="number"][data-key]' ).change( function()
    {
        var val = parseInt( this.value );
        if( !isNaN( val ) )
        {
            settings[ this.dataset.key ] = val;
        }

        saveSettings();
        updateUI();
    } );


    $( 'select[data-key]' ).change( function()
    {
        settings[ this.dataset.key ] = this.value;

        saveSettings();
        updateUI();
    } );


    $( 'textarea[data-key]' ).change( function()
    {
        settings[ this.dataset.key ] = this.value.split( /[\r\n]+/g );

        saveSettings();
        updateUI();
    } );


    $( '.keyboardShortcutEntry' ).click( function()
    {
        this.value = '';
    } );


    $( '.keyboardShortcutEntry' ).keypress( function( event )
    {
        this.value = event.key
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
        chrome.tabs.create( { url : '../change_log/change_log.html' } );
    } );
}


$( 'input, select, textarea' ).change( function()
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


$( function()
{
    generateControllerSettingsTable();
    registerHandlers();

    chrome.storage.sync.get( null, function( items )
    {
        console.log( items );
        settings = items;
        updateUI();
    } );
} );