Options = ( function()
{
    var settings = null


    var controllerSettingsHeadings = [ 'Enabled?', 'Display Notifications?', 'Color' ];
    var controllerSettings = [
        {
            id : 'Pandora',
            name : 'Pandora',
            notification : Settings.Notifications.Pandora,
            color : Settings.ControllerColors.Pandora,
            enabled : Settings.ControllersEnabled.Pandora
        },
        {
            id : 'Spotify',
            name : 'Spotify',
            notification : Settings.Notifications.Spotify,
            color : Settings.ControllerColors.Spotify,
            enabled : Settings.ControllersEnabled.Spotify
        },
        {
            id : 'Youtube',
            name : 'Youtube',
            notification : Settings.Notifications.Youtube,
            color : Settings.ControllerColors.Youtube,
            enabled : Settings.ControllersEnabled.Youtube
        },
        {
            id : 'GooglePlayMusic',
            name : 'Google Play Music',
            notification : Settings.Notifications.GooglePlayMusic,
            color : Settings.ControllerColors.GooglePlayMusic,
            enabled : Settings.ControllersEnabled.GooglePlayMusic
        },
        {
            id : 'Bandcamp',
            name : 'Bandcamp',
            notification : Settings.Notifications.Bandcamp,
            color : Settings.ControllerColors.Bandcamp,
            enabled : Settings.ControllersEnabled.Bandcamp
        },
        {
            id : 'Netflix',
            name : 'Netflix',
            notification : Settings.Notifications.Netflix,
            color : Settings.ControllerColors.Netflix,
            enabled : Settings.ControllersEnabled.Netflix
        },
        {
            id : 'AmazonVideo',
            name : 'Amazon Video',
            notification : Settings.Notifications.AmazonVideo,
            color : Settings.ControllerColors.AmazonVideo,
            enabled : Settings.ControllersEnabled.AmazonVideo
        },
        {
            id : 'AmazonMusic',
            name : 'Amazon Music',
            notification : Settings.Notifications.AmazonMusic,
            color : Settings.ControllerColors.AmazonMusic,
            enabled : Settings.ControllersEnabled.AmazonMusic
        },
        {
            id : 'Hulu',
            name : 'Hulu',
            notification : Settings.Notifications.Hulu,
            color : Settings.ControllerColors.Hulu,
            enabled : Settings.ControllersEnabled.Hulu
        },
        {
            id : 'GenericAudioVideo',
            name : 'Generic Audio/Video',
            notification : Settings.Notifications.GenericAudioVideo,
            color : Settings.ControllerColors.GenericAudioVideo,
            enabled : Settings.ControllersEnabled.GenericAudioVideo
        },
        {
            id : 'Twitch',
            name : 'Twitch',
            notification : Settings.Notifications.Twitch,
            color : Settings.ControllerColors.Twitch,
            enabled : Settings.ControllersEnabled.Twitch
        }
    ];


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

        var headerRow = $( '<tr>' ).append( $( '<th>' ).append( $( '<h1>' ).text( 'Controller Settings' ) ) );
        controllerSettingsHeadings.forEach( function( heading )
        {
            headerRow.append( $( '<th>' ).text( heading ) );
        } );
        controllerSettingsTable.append( headerRow );

        controllerSettings.forEach( function( controller )
        {
            var row = $( '<tr>' ).append( $( '<td>' ).text( controller.name ) );

            $( '<input>', {
                type : 'checkbox',
                'data-key' : controller.enabled
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            $( '<input>', {
                type : 'checkbox',
                'data-key' : controller.notification,
                'data-dependency' : controller.enabled
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            $( '<input>', {
                type : 'color',
                'data-key' : controller.color
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            controllerSettingsTable.append( row );
        } );
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


    function generateDefaultSiteSelect()
    {
        var defaultSiteSelect = $( '#defaultSite' );
        controllerSettings.forEach( function( controller )
        {
            $( '<option>', { value : controller.id } )
                .appendTo( defaultSiteSelect )
                .text( controller.name );
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

        $( 'input[type="color"][data-key]' ).each( function()
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


        $( 'input[type="color"][data-key]' ).change( function()
        {
            settings[ this.dataset.key ] = this.value;

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

        $( '#resetToDefaults' ).click( function()
        {
            $( '#reset-confirm' ).dialog( 'open' );
        } );
    }

    function onStart()
    {
        $( '#reset-confirm' ).dialog( {
            autoOpen : false,
            resizeable : false,
            height : 'auto',
            width : 400,
            modal : true,
            buttons : {
                'Yes' : function()
                {
                    settings = Common.getDefaultSettings();
                    saveSettings();
                    updateUI();
                    $( this ).dialog( 'close' );
                },
                'No' : function()
                {
                    $( this ).dialog( 'close' );
                }
            }
        } );

        generateControllerSettingsTable();
        generateKeyboardShortcutTable();
        generateDefaultSiteSelect();
        registerHandlers();

        chrome.storage.sync.get( null, function( items )
        {
            console.log( items );
            settings = items;
            updateUI();
        } );
    }

    return {
        onStart : onStart
    };
} )();


$( function()
{
    Options.onStart();
} );