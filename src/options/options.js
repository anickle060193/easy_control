Options = ( function()
{
    var settings = null


    var controllerSettings = [
        { id : 'Pandora', name : 'Pandora' },
        { id : 'Spotify', name : 'Spotify' },
        { id : 'Youtube', name : 'Youtube' },
        { id : 'GooglePlayMusic', name : 'Google Play Music' },
        { id : 'Bandcamp', name : 'Bandcamp' },
        { id : 'Netflix', name : 'Netflix' },
        { id : 'AmazonVideo', name : 'Amazon Video' },
        { id : 'AmazonMusic', name : 'Amazon Music' },
        { id : 'Hulu', name : 'Hulu' },
        { id : 'GenericAudioVideo', name : 'Generic Audio/Video' },
        { id : 'Twitch', name : 'Twitch' }
    ];


    var keyboardShortcuts = [
        { id: 'MuchSlower',     description: 'Playback Speed Much Slower',  allowHiding: true   },
        { id: 'Slower',         description: 'Playback Speed Slower',       allowHiding: true   },
        { id: 'SkipBackward',   description: 'Skip Backward',               allowHiding: true   },
        { id: 'PlayPause',      description: 'Play/Pause',                  allowHiding: true   },
        { id: 'SkipForward',    description: 'Skip Forward',                allowHiding: true   },
        { id: 'Faster',         description: 'Playback Speed Faster',       allowHiding: true   },
        { id: 'MuchFaster',     description: 'Playback Speed Much Faster',  allowHiding: true   },
        { id: 'Reset',          description: 'Playback Speed Reset',        allowHiding: false  },
        { id: 'Loop',           description: 'Loop',                        allowHiding: true   },
        { id: 'Fullscreen',     description: 'Fullscreen',                  allowHiding: true   }
    ];


    function generateControllerSettingsTable()
    {
        var controllerSettingsTable = $( '#controllerSettingsTable' );

        var headerRow = $( '<tr>' ).append( $( '<th>' ).append( $( '<h1>' ).text( 'Controller Settings' ) ) );
        [ 'Enabled?', 'Display Notifications?', 'Open new content in existing\u00A0tab?', 'Color' ].forEach( function( heading )
        {
            headerRow.append( $( '<th>' ).text( heading ) );
        } );

        controllerSettingsTable.append( headerRow );

        controllerSettings.forEach( function( controller )
        {
            var row = $( '<tr>' ).append( $( '<td>' ).text( controller.name ) );

            $( '<input>', {
                type : 'checkbox',
                'data-key' : Settings.ControllersEnabled[ controller.id ]
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            $( '<input>', {
                type : 'checkbox',
                'data-key' : Settings.Notifications[ controller.id ],
                'data-dependency' : Settings.ControllersEnabled[ controller.id ]
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            $( '<input>', {
                type : 'checkbox',
                'data-key' : Settings.OpenInExisting[ controller.id ],
                'data-dependency' : Settings.ControllersEnabled[ controller.id ]
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            $( '<input>', {
                type : 'color',
                'data-key' : Settings.ControllerColors[ controller.id ],
                'data-dependency' : Settings.ControllersEnabled[ controller.id ]
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            controllerSettingsTable.append( row );
        } );
    }


    function generateKeyboardShortcutTable()
    {
        var table = $( '#mediaControlsKeyboardShortcutsTable' );

        var headerRow = $( '<tr>' ).append( $( '<th>' ).append( $( '<h1>' ).text( 'Generic Media Controls' ) ) );
        [ 'Keyboard Shortcut', 'Display in Overlay?' ].forEach( function( heading )
        {
            headerRow.append( $( '<th>' ).text( heading ) );
        } );

        table.append( headerRow );

        keyboardShortcuts.forEach( function( shortcut )
        {
            var row = $( '<tr>' ).append( $( '<td>' ).text( shortcut.description ) );

            $( '<input>', {
                type : 'text',
                class : [ 'keyboardShortcutEntry' ],
                placeholder : 'Press Key',
                'data-key' : Settings.Controls.MediaControls[ shortcut.id ]
            } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );

            if( shortcut.allowHiding )
            {
                $( '<input>', {
                    type : 'checkbox',
                    'data-key' : Settings.Controls.OverlayControls[ shortcut.id ]
                } ).appendTo( $( '<td>' ).addClass( 'center' ).appendTo( row ) );
            }
            else
            {
                $( '<td>' ).appendTo( row )
            }

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


        $( 'input[type="text"][data-key].keyboardShortcutEntry' )
            .keydown( function( e )
            {
                this.value = Common.getKeyboardShortcut( e.originalEvent );

                return false;
            } )
            .blur( function( e )
            {
                if( settings[ this.dataset.key ] !== this.value )
                {
                    settings[ this.dataset.key ] = this.value;

                    saveSettings();
                    updateUI();
                }
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