class MediaController extends Controller
{
    constructor( name, media )
    {
        super( name );

        this.media = media;
        this.isVideo = this.media.nodeName === 'VIDEO';
        this.controls = null;
        this.controllerNumber = MediaController.controllerCount;

        MediaController.controllerCount++;

        this.allowPauseOnInactivity = !this.isVideo;

        this.fullscreen = false;
        this.dragging = false;
        this.hasDragged = false;
        this.hovering = false;
        this.positionOfElement = null;

        this.hideControlsOnIdleTimeout = null;

        $( document ).on( this.e( 'keydown' ), $.proxy( this.handleKeyDown, this ) );

        if( Controller.settings[ Settings.Controls.DisplayControls ] )
        {
            this.initializeMediaControls();
        }

        this.observer = new MutationObserver( this.onSourceChanged.bind( this ) );
        this.observer.observe( this.media, {
            attributes : true,
            attributeFilter : [ 'src' ]
        } );

        this.onSourceChanged( this.media.src );
    }

    e( eventName )
    {
        return eventName + '.' + this.controllerNumber;
    }

    initializeMediaControls()
    {
        if( this.controls )
        {
            console.warn( 'Controls have already been initialized.' );
            return;
        }
        $.get( chrome.extension.getURL( 'media_control_overlay.html' ), function( data )
        {
            if( this.disconnected )
            {
                return;
            }
            this.controls = $( data );
            this.attachControls();

            this.hideControls();
            this.loop( this.media.loop );

            this.controls.dblclick( function( e )
            {
                e.stopPropagation();
                e.preventDefault();
            } );

            this.controls.on( 'click', 'span', function( e )
            {
                if( e.currentTarget.id === 'media-control-overlay-much-slower' )
                {
                    this.playbackMuchSlower();
                }
                else if( e.currentTarget.id === 'media-control-overlay-slower' )
                {
                    this.playbackSlower();
                }
                else if( e.currentTarget.id === 'media-control-overlay-reset' )
                {
                    this.playbackReset();
                }
                else if( e.currentTarget.id === 'media-control-overlay-skip-backward' )
                {
                    this.skipBackward();
                }
                else if( e.currentTarget.id === 'media-control-overlay-play-pause' )
                {
                    this.playPause();
                }
                else if( e.currentTarget.id === 'media-control-overlay-skip-forward' )
                {
                    this.skipForward();
                }
                else if( e.currentTarget.id === 'media-control-overlay-faster' )
                {
                    this.playbackFaster();
                }
                else if( e.currentTarget.id === 'media-control-overlay-much-faster' )
                {
                    this.playbackMuchFaster();
                }
                else if( e.currentTarget.id === 'media-control-overlay-remove' )
                {
                    this.removeControls();
                }
                else if( e.currentTarget.id === 'media-control-overlay-loop' )
                {
                    this.loop( !this.media.loop );
                }
                else if( e.currentTarget.id === 'media-control-overlay-fullscreen' )
                {
                    this.setFullscreen( !this.fullscreen );
                }
            }.bind( this ) );

            $( this.media )
                .on( this.e( 'ratechange' ), $.proxy( function()
                {
                    this.controls.find( '#media-control-overlay-reset' ).text( this.media.playbackRate.toFixed( 1 ) );
                }, this ) )
                .on( this.e( 'loopchange' ), $.proxy( function( e, loop )
                {
                    this.loop( loop );
                }, this ) )
                .on( this.e( 'playing' ), $.proxy( function( e )
                {
                    $( '#media-control-overlay-play-pause' )
                        .prop( 'title', 'Pause' )
                        .removeClass( 'easy-control-media-control-play' )
                        .addClass( 'easy-control-media-control-pause' );
                }, this ) )
                .on( this.e( 'pause' ), $.proxy( function( e )
                {
                    $( '#media-control-overlay-play-pause' )
                        .prop( 'title', 'Play' )
                        .removeClass( 'easy-control-media-control-pause' )
                        .addClass( 'easy-control-media-control-play' );
                } ) );

            var shower = $.proxy( function()
            {
                this.hovering = true;
                this.showControls();
            }, this );
            var hider = $.proxy( function()
            {
                this.hovering = false;
                this.hideControls( false );
            }, this );
            this.controls
                    .on( this.e( 'mouseenter' ), shower )
                    .on( this.e( 'mouseleave' ), hider );

            if( this.isVideo )
            {
                $( this.media )
                    .on( this.e( 'mouseenter' ), shower )
                    .on( this.e( 'mouseleave' ), hider );

                $( document ).on( this.e( 'webkitfullscreenchange' ), $.proxy( this.handleFullscreenChange, this ) );
            }
            else
            {
                $( document.body )
                    .on( this.e( 'mouseenter' ), shower )
                    .on( this.e( 'mouseleave' ), hider );
            }

        }.bind( this ) );
    }

    removeControls()
    {
        if( this.controls )
        {
            this.controls.remove();
            this.controls = null;

            $( this.positionOfElement )
                .off( this.e( 'move' ) )
                .off( this.e( 'visible' ) );
            this.positionOfElement = null;

            $( this.media )
                .off( this.e( 'ratechange' ) )
                .off( this.e( 'mouseenter' ) )
                .off( this.e( 'mouseleave' ) )
                .off( this.e( 'loopchange' ) )
                .off( this.e( 'playing' ) )
                .off( this.e( 'play' ) )
                .off( this.e( 'pause' ) );

            $( document )
                .off( this.e( 'webkitfullscreenchange' ) )
                .off( this.e( 'mousemove' ) );

            $( document.body )
                .off( this.e( 'mouseenter' ) )
                .off( this.e( 'mouseleave' ) );
        }
    }

    onSourceChanged( newSource )
    {
        console.log( 'Source Changed' );

        var playbackRates = SessionStorage.get( 'easy_control.playbackRate' );
        var playbackRate = playbackRates[ window.location.hostname ];
        if( typeof playbackRate !== 'undefined' )
        {
            console.log( 'Setting Playback Rate: ' + playbackRate );
            this.media.playbackRate = playbackRate;
        }

        if( this.controls )
        {
            this.loop( this.media.loop );
        }
    }

    disconnect()
    {
        super.disconnect( this );

        this.removeControls();
        $( document ).off( this.e( 'keydown' ) );
        this.observer.disconnect();
    }

    showControls()
    {
        var shortcut = Controller.settings[ Settings.Controls.MediaControls.Reset ];
        this.controls.show()
                        .children().hide().end()
                        .find( '#media-control-overlay-reset' ).show()
                        .prop( 'title', 'Reset Playback Speed' + ( shortcut ? ` [${shortcut}]` : '' ) );

        if( this.hovering )
        {
            this.controls.find( '#media-control-overlay-remove, #media-control-overlay-dragger' ).show();

            shortcut = Controller.settings[ Settings.Controls.MediaControls.MuchSlower ];
            this.controls.find( '#media-control-overlay-much-slower' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.MuchSlower ] )
                            .prop( 'title', 'Much Slower' + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.Slower ];
            this.controls.find( '#media-control-overlay-slower' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.Slower ] )
                            .prop( 'title', 'Slower' + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.SkipBackward ];
            let amount = Controller.settings[ Settings.Controls.SkipBackwardAmount ];
            this.controls.find( '#media-control-overlay-skip-backward' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.SkipBackward ] )
                            .prop( 'title', `Skip Backward ${amount} seconds` + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.PlayPause ];
            this.controls.find( '#media-control-overlay-play-pause' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.PlayPause ] )
                            .prop( 'title', ( this.isPaused() ? 'Play' : 'Pause' ) + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.SkipForward ];
            amount = Controller.settings[ Settings.Controls.SkipForwardAmount ];
            this.controls.find( '#media-control-overlay-skip-forward' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.SkipForward ] )
                            .prop( 'title', `Skip Forward ${amount} seconds` + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.Faster ];
            this.controls.find( '#media-control-overlay-faster' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.Faster ] )
                            .prop( 'title', 'Faster' + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.MuchFaster ];
            this.controls.find( '#media-control-overlay-much-faster' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.MuchFaster ] )
                            .prop( 'title', 'Much Faster' + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.Loop ];
            this.controls.find( '#media-control-overlay-loop' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.Loop ] )
                            .prop( 'title', ( this.media.loop ? 'Do not loop' : 'Loop' ) + ( shortcut ? ` [${shortcut}]` : '' ) );

            shortcut = Controller.settings[ Settings.Controls.MediaControls.Fullscreen ];
            this.controls.find( '#media-control-overlay-fullscreen' )
                            .toggle( Controller.settings[ Settings.Controls.OverlayControls.Fullscreen ] )
                            .prop( 'title', ( this.fullscreen ? 'Exit Fullscreen' : 'Fullscreen' ) + ( shortcut ? ` [${shortcut}]` : '' ) );
        }
    }

    hideControls( hideAll )
    {
        if( !this.dragging )
        {
            if( hideAll || !Controller.settings[ Settings.Controls.AlwaysDisplayPlaybackSpeed ] )
            {
                this.controls.hide();
            }
            else
            {
                this.controls.find( '.easy-control-media-control' ).hide();
            }
        }
    }

    attachControls()
    {
        if( this.positionOfElement )
        {
            $( this.positionOfElement ).off( this.e( 'move' ) );
            $( this.positionOfElement ).off( this.e( 'visible' ) );
        }

        this.hasDragged = false;
        this.fullscreen = false;

        var appendToElement = document.body;
        this.positionOfElement = this.media;

        if( !this.isVideo )
        {
            this.positionOfElement = document.body;
        }
        else if( document.webkitFullscreenElement
              && $( this.media ).closest( document.webkitFullscreenElement ).length > 0 )
        {
            console.log( 'Attaching to Fullscreen' );
            this.fullscreen = true;
            if( document.webkitFullscreenElement === this.media )
            {
                appendToElement = document.body;
            }
            else
            {
                appendToElement = document.webkitFullscreenElement;
            }
            this.positionOfElement = document.webkitFullscreenElement;
        }

        if( this.fullscreen )
        {
            $( '#media-control-overlay-fullscreen' )
                .prop( 'title', 'Exit Fullscreen' )
                .removeClass( 'easy-control-media-control-fullscreen' )
                .addClass( 'easy-control-media-control-exit-fullscreen' );
        }
        else
        {
            $( '#media-control-overlay-fullscreen' )
                .prop( 'title', 'Fullscreen' )
                .removeClass( 'easy-control-media-control-exit-fullscreen' )
                .addClass( 'easy-control-media-control-fullscreen' );
        }

        $( document ).on( this.e( 'mousemove' ), $.proxy( this.handleMouseMove, this ) );

        this.controls
            .detach()
            .appendTo( appendToElement )
            .css( 'zIndex', Number.MAX_SAFE_INTEGER );

        this.controls.draggable( {
            handle : '#media-control-overlay-dragger',
            containment : this.positionOfElement,
            start : $.proxy( function()
            {
                this.dragging = true;
                this.hasDragged = true;
            }, this ),
            stop : $.proxy( function()
            {
                this.dragging = false;
            }, this )
        } );

        $( this.positionOfElement ).on( this.e( 'move' ), $.proxy( function()
        {
            if( !this.hasDragged )
            {
                this.repositionControls();
            }
        }, this ) );

        this.controls.toggle( $( this.positionOfElement ).is( ':visible' ) );
        $( this.positionOfElement ).on( this.e( 'visible' ), $.proxy( function( event, visible )
        {
            console.log( 'Visible: ' + visible );
            this.controls.toggle( visible );
            this.repositionControls();
        }, this ) );

        this.repositionControls();
    }

    repositionControls()
    {
        this.controls
            .position( {
                my : 'left top',
                at : 'left+6 top+6',
                of : this.positionOfElement,
                collision : 'none'
            } );
    }

    handleFullscreenChange()
    {
        this.attachControls();
    }

    handleMouseMove( event )
    {
        window.clearTimeout( this.hideControlsOnIdleTimeout );
        this.hideControlsOnIdleTimeout = null;

        if( this.controls )
        {
            if( this.hovering )
            {
                this.showControls();
            }

            if( Controller.settings[ Settings.Controls.HideControlsWhenIdle ] )
            {
                var timeout = Controller.settings[ Settings.Controls.HideControlsIdleTime ] * 1000;
                this.hideControlsOnIdleTimeout = setTimeout( $.proxy( function()
                {
                    if( this.controls )
                    {
                        this.hideControls( true );
                    }
                }, this ), timeout );
            }
        }
    }

    handleKeyDown( event )
    {
        if( $( this.media ).closest( event.target ).length > 0
         || !this.isVideo )
        {
            var shortcut = Common.getKeyboardShortcut( event.originalEvent );

            if( !shortcut )
            {
                return true;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.MuchSlower ] )
            {
                this.playbackMuchSlower();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Slower ] )
            {
                this.playbackSlower();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.SkipBackward ] )
            {
                this.skipBackward();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.PlayPause ] )
            {
                this.playPause();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.SkipForward ] )
            {
                this.skipForward();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Faster ] )
            {
                this.playbackFaster();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.MuchFaster ] )
            {
                this.playbackMuchFaster();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Reset ] )
            {
                this.resetControls();
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Loop ] )
            {
                this.loop( !this.media.loop );
                return false;
            }
            else if( shortcut === Controller.settings[ Settings.Controls.MediaControls.Fullscreen ] )
            {
                this.setFullscreen( !this.fullscreen );
                return false;
            }
        }
    }

    resetControls()
    {
        if( Controller.settings[ Settings.Controls.DisplayControls ] )
        {
            if( this.controls === null )
            {
                this.initializeMediaControls();
            }
            else
            {
                this.hasDragged = false;
                this.repositionControls();
            }
        }
        this.playbackReset();
    }

    playbackReset()
    {
        this.setPlaybackRate( 1.0 );
    }

    playbackMuchSlower()
    {
        this.setPlaybackRate( this.media.playbackRate - 0.5 );
    }

    playbackSlower()
    {
        this.setPlaybackRate( this.media.playbackRate - 0.1 );
    }

    skipBackward()
    {
        this.media.currentTime -= Controller.settings[ Settings.Controls.SkipBackwardAmount ];
    }

    playPause()
    {
        if( this.isPaused() )
        {
            this.play();
        }
        else
        {
            this.pause();
        }
    }

    skipForward()
    {
        this.media.currentTime += Controller.settings[ Settings.Controls.SkipForwardAmount ];
    }

    playbackFaster()
    {
        this.setPlaybackRate( this.media.playbackRate + 0.1 );
    }

    playbackMuchFaster()
    {
        this.setPlaybackRate( this.media.playbackRate + 0.5 );
    }

    setPlaybackRate( playbackRate )
    {
        playbackRate = Common.limit( playbackRate, 0, 16 );
        if( this.media.playbackRate !== playbackRate )
        {
            this.media.playbackRate = playbackRate;

            var playbackRates = SessionStorage.get( 'easy_control.playbackRate' );
            playbackRates[ window.location.hostname ] = this.media.playbackRate;
            SessionStorage.set( 'easy_control.playbackRate', playbackRates );
        }
    }

    loop( loop )
    {
        this.media.loop = loop;

        if( this.media.loop )
        {
            $( '#media-control-overlay-loop' )
                .prop( 'title', 'Do not loop' )
                .removeClass( 'easy-control-media-control-loop' )
                .addClass( 'easy-control-media-control-no-loop' );
        }
        else
        {
            $( '#media-control-overlay-loop' )
                .prop( 'title', 'Loop' )
                .removeClass( 'easy-control-media-control-no-loop' )
                .addClass( 'easy-control-media-control-loop' );
        }
    }

    setFullscreen( fullscreen )
    {
        if( fullscreen !== this.fullscreen )
        {
            if( fullscreen )
            {
                if( this.media.webkitRequestFullscreen )
                {
                    this.media.webkitRequestFullscreen();
                    this.handleFullscreenChange();
                }
            }
            else
            {
                if( document.webkitExitFullscreen )
                {
                    document.webkitExitFullscreen();
                    this.handleFullscreenChange();
                }
            }
        }
    }

    _play()
    {
        this.media.play();
    }

    _pause()
    {
        this.media.pause();
    }

    getProgress()
    {
        if( this.media.duration === 0 )
        {
            return 0;
        }
        else
        {
            return this.media.currentTime / this.media.duration;
        }
    }

    isPaused()
    {
        return this.media.paused;
    }

    volumeUp()
    {
        this.media.volume = Math.min( 1.0, this.media.volume + 0.05 );
    }

    volumeDown()
    {
        this.media.volume = Math.max( 0.0, this.media.volume - 0.05 );
    }

    startPolling()
    {
        console.log( 'MediaController - Start polling' );

        if( !this.initialized )
        {
            throw 'Must initialize media controller before polling.';
        }

        $( this.media ).on( 'play pause playing timeupdate', $.proxy( this.poll, this ) );
    }

    stopPolling()
    {
        console.log( 'MediaController - Stop polling' );
        $( this.media ).off( 'play pause playing timeupdate' );
    }
}

MediaController.controllerCount = 0;


MediaController.onNewMedia = ( function()
{
    function addMedia( element, controllerCreatorCallback )
    {
        var elem = $( element );
        if( !elem.data( 'controller' ) )
        {
            var controller = controllerCreatorCallback( element );
            elem.data( 'controller', controller );
        }
        else
        {
            console.warn( 'Media found that already has controller.' );
        }
    }

    function removeMedia( element )
    {
        console.log( 'Media removed' );
        var elem = $( element );
        var controller = elem.data( 'controller' );
        if( controller )
        {
            controller.disconnect();
            elem.removeData( 'controller' );
        }
        else
        {
            console.warn( 'Controller was not found for media.' );
        }
    }

    return function( controllerCreatorCallback )
    {
        $( 'audio, video' ).each( function()
        {
            addMedia( this, controllerCreatorCallback );
        } );

        var newMediaElementObserver = new MutationObserver( function( mutations )
        {
            mutations.forEach( function( mutation )
            {
                mutation.addedNodes.forEach( function( node )
                {
                    if( node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO' )
                    {
                        addMedia( node, controllerCreatorCallback );
                    }
                    else
                    {
                        $( node ).find( 'audio, video' ).each( function()
                        {
                            addMedia( this, controllerCreatorCallback );
                        } );
                    }
                } );

                mutation.removedNodes.forEach( function( node )
                {
                    if( node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO' )
                    {
                        removeMedia( node );
                    }
                    else
                    {
                        $( node ).find( 'audio, video' ).each( function()
                        {
                            removeMedia( this );
                        } );
                    }
                } );
            } );
        } );
        newMediaElementObserver.observe( document.body, {
            childList : true,
            subtree : true
        } );
    };
} )();


MediaController.createMultiMediaListener = function( name, controllerCreatorCallback )
{
    MediaController.onNewMedia( function( media )
    {
        console.log( name + ' - New Media Found' );
        var controller = controllerCreatorCallback( media );
        if( controller )
        {
            controller.startPolling();
        }
        return controller;
    } );
};


MediaController.createSingleMediaListener = function( name, controllerCreatorCallback )
{
    var controller = null;
    MediaController.onNewMedia( function( media )
    {
        console.log( name + ' - New Media Found' );

        var tempController = controllerCreatorCallback( media );

        if( tempController )
        {
            if( controller )
            {
                console.log( name + ' - Disconnecting Old Media' );
                controller.disconnect();
            }

            controller = tempController;
            controller.startPolling();
        }
        return controller;
    } );
};