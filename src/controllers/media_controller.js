function MediaController( media, name, color, allowLockOnInactivity )
{
    Controller.call( this, name, color, allowLockOnInactivity );

    this.media = media;
    this.controls = null;

    this.fullscreen = false;
    this.dragging = false;
    this.hasDragged = false;
    this.positionOfElement = null;

    $( document.body ).keydown( $.proxy( this.handleKeyDown, this ) );

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

MediaController.prototype = Object.create( Controller.prototype );
MediaController.prototype.constructor = MediaController;

MediaController.prototype.initializeMediaControls = function()
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
        this.controls.draggable( {
            handle : '#media-control-overlay-dragger',
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
        }.bind( this ) );

        $( this.media ).on( 'ratechange', $.proxy( function()
        {
            this.controls.find( '#media-control-overlay-reset' ).text( this.media.playbackRate.toFixed( 1 ) );
        }, this ) );

        this.controls.hover( $.proxy( this.showControls, this ), $.proxy( this.hideControls, this ) );
        $( this.media ).hover( $.proxy( this.showControls, this ), $.proxy( this.hideControls, this ) );

        $( document ).on( 'webkitfullscreenchange', $.proxy( this.handleFullscreenChange, this ) );

    }.bind( this ) );
};

MediaController.prototype.removeControls = function()
{
    if( this.controls )
    {
        this.controls.remove();
        this.controls = null;
        $( this.positionOfElement ).off( 'move' );
        this.positionOfElement = null;
        $( this.media )
            .off( 'ratechange' )
            .off( 'mouseenter' )
            .off( 'mouseleave' );
        $( document ).off( 'webkitfullscreenchange' );
    }
};

MediaController.prototype.onSourceChanged = function( newSource )
{
    console.log( 'Source Changed' );

    var playbackRates = SessionStorage.get( 'easy_control.playbackRate' );
    var playbackRate = playbackRates[ window.location.hostname ];
    if( typeof playbackRate !== 'undefined' )
    {
        console.log( 'Setting Playback Rate: ' + playbackRate );
        this.media.playbackRate = playbackRate;
    }
};

MediaController.prototype.disconnect = function()
{
    Controller.prototype.disconnect.call( this );

    this.removeControls();
    $( document.body ).off( 'keydown', this.handleKeyDown );
    this.observer.disconnect();
};

MediaController.prototype.showControls = function()
{
    this.controls.show().children().show();
};

MediaController.prototype.attachControls = function()
{
    if( this.positionOfElement )
    {
        $( this.positionOfElement ).off( 'move' );
    }

    this.hasDragged = false;
    this.fullscreen = false;

    var appendToElement = document.body;
    this.positionOfElement = this.media;

    if( document.webkitIsFullScreen
    && ( document.webkitCurrentFullScreenElement === this.media
      || $.contains( document.webkitFullscreenElement, this.media ) ) )
    {
        console.log( 'Attaching to Fullscreen' );
        this.fullscreen = true;
        appendToElement = document.webkitCurrentFullScreenElement;
        this.positionOfElement = document.webkitCurrentFullScreenElement;
    }

    this.controls
        .detach()
        .appendTo( appendToElement )
        .css( 'zIndex', Number.MAX_SAFE_INTEGER );

    $( this.positionOfElement ).on( 'move', $.proxy( function()
    {
        if( !this.hasDragged )
        {
            this.repositionControls();
        }
    }, this ) );

    this.repositionControls();
};

MediaController.prototype.repositionControls = function()
{
    this.controls
        .position( {
            my : 'left top',
            at : 'left+6 top+6',
            of : this.positionOfElement,
            collision : 'none'
        } );
};

MediaController.prototype.handleFullscreenChange = function()
{
    this.attachControls();
};

MediaController.prototype.hideControls = function()
{
    if( !this.dragging )
    {
        if( Controller.settings[ Settings.Controls.AlwaysDisplayPlaybackSpeed ] )
        {
            this.controls.find( '.control' ).hide();
        }
        else
        {
            this.controls.hide();
        }
    }
};

MediaController.prototype.handleKeyDown = function( event )
{
    if( event.target === this.media || $.contains( event.target, this.media ) )
    {
        var handled = true;
        if( event.key === Controller.settings[ Settings.Controls.MediaControls.MuchSlower ] )
        {
            this.playbackMuchSlower();
        }
        else if( event.key === Controller.settings[ Settings.Controls.MediaControls.Slower ] )
        {
            this.playbackSlower();
        }
        else if( event.key === Controller.settings[ Settings.Controls.MediaControls.Faster ] )
        {
            this.playbackFaster();
        }
        else if( event.key === Controller.settings[ Settings.Controls.MediaControls.MuchFaster ] )
        {
            this.playbackMuchFaster();
        }
        else if( event.key === Controller.settings[ Settings.Controls.MediaControls.Reset ] )
        {
            this.resetControls();
        }
        else if( event.key === Controller.settings[ Settings.Controls.MediaControls.Loop ] )
        {
            this.loop( !this.media.loop );
        }
        else
        {
            handled = false;
        }

        if( handled )
        {
            event.preventDefault();
            event.stopPropagation();
        }
    }
};

MediaController.prototype.resetControls = function()
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
};

MediaController.prototype.playbackMuchSlower = function()
{
    this.setPlaybackRate( this.media.playbackRate - 0.5 );
};

MediaController.prototype.playbackSlower = function()
{
    this.setPlaybackRate( this.media.playbackRate - 0.1 );
};

MediaController.prototype.playbackReset = function()
{
    this.setPlaybackRate( 1.0 );
};

MediaController.prototype.playbackFaster = function()
{
    this.setPlaybackRate( this.media.playbackRate + 0.1 );
};

MediaController.prototype.playbackMuchFaster = function()
{
    this.setPlaybackRate( this.media.playbackRate + 0.5 );
};

MediaController.prototype.setPlaybackRate = function( playbackRate )
{
    playbackRate = Common.limit( playbackRate, 0, 16 );
    if( this.media.playbackRate !== playbackRate )
    {
        this.media.playbackRate = playbackRate;

        var playbackRates = SessionStorage.get( 'easy_control.playbackRate' );
        playbackRates[ window.location.hostname ] = this.media.playbackRate;
        SessionStorage.set( 'easy_control.playbackRate', playbackRates );
    }
};

MediaController.prototype.loop = function( loop )
{
    this.media.loop = loop;

    if( this.media.loop )
    {
        $( '#media-control-overlay-loop' )
            .prop( 'title', 'Do not loop' )
            .removeClass( 'loop' )
            .addClass( 'no-loop' );
    }
    else
    {
        $( '#media-control-overlay-loop' )
            .prop( 'title', 'Loop' )
            .removeClass( 'no-loop' )
            .addClass( 'loop' );
    }
}

MediaController.prototype._play = function()
{
    this.media.play();
};

MediaController.prototype._pause = function()
{
    this.media.pause();
};

MediaController.prototype._getProgress = function()
{
    if( this.media.duration === 0 )
    {
        return 0;
    }
    else
    {
        return this.media.currentTime / this.media.duration;
    }
};

MediaController.prototype._isPaused = function()
{
    return this.media.paused;
};

MediaController.prototype._volumeUp = function()
{
    this.media.volume = Math.min( 1.0, this.media.volume + 0.05 );
};

MediaController.prototype._volumeDown = function()
{
    this.media.volume = Math.max( 0.0, this.media.volume - 0.05 );
};

MediaController.prototype.startPolling = function()
{
    console.log( 'MediaController - Start polling' );
    $( this.media ).on( 'play pause playing timeupdate', $.proxy( this.poll, this ) );
};

MediaController.prototype.stopPolling = function()
{
    console.log( 'MediaController - Stop polling' );
    $( this.media ).off( 'play pause playing timeupdate' );
};

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
}


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