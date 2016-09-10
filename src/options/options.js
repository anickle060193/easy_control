var settings = null


var controllerSettings = {
    'Pandora' : { notification : Settings.Notifications.Pandora, enabled : Settings.ControllersEnabled.Pandora },
    'Spotify' : { notification : Settings.Notifications.Spotify, enabled : Settings.ControllersEnabled.Spotify },
    'Google Play Music' : { notification : Settings.Notifications.GooglePlayMusic, enabled : Settings.ControllersEnabled.GooglePlayMusic },
    'Bandcamp' : { notification : Settings.Notifications.Bandcamp, enabled : Settings.ControllersEnabled.Bandcamp },
    'Netflix' : { notification : Settings.Notifications.Netflix, enabled : Settings.ControllersEnabled.Netflix },
    'Amazon Video' : { notification : Settings.Notifications.AmazonVideo, enabled : Settings.ControllersEnabled.AmazonVideo },
    'Amazon Music' : { notification : Settings.Notifications.AmazonMusic, enabled : Settings.ControllersEnabled.AmazonMusic },
    'Hulu' : { notification : Settings.Notifications.Hulu, enabled : Settings.ControllersEnabled.Hulu },
    'Generic Audio/Video' : { notification : Settings.Notifications.GenericAudioVideo, enabled : Settings.ControllersEnabled.GenericAudioVideo },
};


var keyboardShortcuts = [
    { description : 'Playback Speed Much Slower', key : Settings.Controls.MediaControls.MuchSlower },
    { description : 'Playback Speed Slower', key : Settings.Controls.MediaControls.Slower },
    { description : 'Playback Speed Faster', key : Settings.Controls.MediaControls.Faster },
    { description : 'Playback Speed Much Faster', key : Settings.Controls.MediaControls.MuchFaster },
    { description : 'Playback Speed Reset', key : Settings.Controls.MediaControls.Reset },
    { description : 'Loop', key : Settings.Controls.MediaControls.Loop }
];


function generateControllerSettingsTable()
{
    var controllerSettingsTable = $( '#controllerSettingsTable' );

    for( var controller in controllerSettings )
    {
        var row = $( '<tr>' ).append( $( '<td>' ).text( controller ) );

        var enabledCheckbox = $( '<input>', {
            type : 'checkbox',
            name : 'enabledControllers',
            'data-key' : controllerSettings[ controller ].enabled
        } );

        var notificationCheckbox = $( '<input>', {
            type : 'checkbox',
            name : 'notifications',
            'data-key' : controllerSettings[ controller ].notification,
            'data-dependency' : controllerSettings[ controller ].enabled
        } );

        row.append( $( '<td>' ).append( enabledCheckbox ) );
        row.append( $( '<td>' ).append( notificationCheckbox ) );

        controllerSettingsTable.append( row );
    }
}


function generateKeyboardShortcutTable()
{
    var table = $( '#mediaControlsKeyboardShortcuts' );

    keyboardShortcuts.forEach( function( shortcut )
    {
        var row = $( '<tr>' ).append( $( '<td>' ).text( shortcut.description ) );
        var input = $( '<input>', {
            type : 'text',
            maxlength : 1,
            class : [ 'keyboardShortcutEntry' ],
            placeholder : 'Press Key',
            'data-key' : shortcut.key
        } );
        row.append( $( '<td>' ).append( input ) );

        table.append( row );
    } );
}


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


$( function()
{
    generateControllerSettingsTable();
    generateKeyboardShortcutTable();
    registerHandlers();

    chrome.storage.sync.get( null, function( items )
    {
        console.log( items );
        settings = items;
        updateUI();
    } );
} );