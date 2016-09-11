function MediaController( media, name, color, allowLockOnInactivity )
{
    Controller.call( this, name, color, allowLockOnInactivity );

    this.media = media;
    this.controls = null;

    this.fullscreen = false;
    this.dragging = false;

    $( document.body ).keydown( $.proxy( this.handleKeyDown, this ) );

    if( Controller.settings[ Settings.Controls.DisplayControls ] )
    {
        this.initializeMediaControls();
    }
}

MediaController.prototype = Object.create( Controller.prototype );
MediaController.prototype.constructor = MediaController;

MediaController.prototype.initializeMediaControls = function()
{
    $.get( chrome.extension.getURL( 'media_control_overlay.html' ), function( data )
    {
        this.controls = $( data );
        this.attachControls( document.body, this.media )
        this.controls.draggable( {
            handle : '#media-control-overlay-dragger',
            start : $.proxy( function()
            {
                this.dragging = true;
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

        this.controls.on( 'click', 'button', function( e )
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
                this.controls.remove();
            }
            else if( e.currentTarget.id === 'media-control-overlay-loop' )
            {
                this.loop( !this.media.loop );
            }
        }.bind( this ) );

        this.media.onratechange = function()
        {
            this.controls.find( '#media-control-overlay-reset' ).text( this.media.playbackRate.toFixed( 1 ) );
        }.bind( this );

        this.controls.hover( $.proxy( this.showControls, this ), $.proxy( this.hideControls, this ) );
        $( this.media ).hover( $.proxy( this.showControls, this ), $.proxy( this.hideControls, this ) );

        $( document ).on( 'webkitfullscreenchange', $.proxy( this.handleFullscreenChange, this ) );

    }.bind( this ) );
};

MediaController.prototype.disconnect = function()
{
    Controller.prototype.disconnect.call( this );

    if( this.controls )
    {
        this.controls.remove();
    }
    $( document ).off( 'webkitfullscreenchange', this.handleFullscreenChange );
    $( document.body ).off( 'keydown', this.handleKeyDown );
};

MediaController.prototype.showControls = function()
{
    this.controls.show().children().show();
};

MediaController.prototype.attachControls = function( appendToElement, positionOfElement )
{
    return this.controls
        .detach()
        .appendTo( appendToElement )
        .css( 'zIndex', Number.MAX_SAFE_INTEGER )
        .position( {
            my : 'left top',
            at : 'left+6 top+6',
            of : positionOfElement,
            collision : 'none'
        } );
};

MediaController.prototype.handleFullscreenChange = function()
{
    if( document.webkitIsFullScreen )
    {
        if( $( document.webkitFullscreenElement ).find( this.media ) !== 0 )
        {
            this.fullscreen = true;
            this.attachControls( document.webkitCurrentFullScreenElement, document.webkitCurrentFullScreenElement );
        }
    }
    else
    {
        if( this.fullscreen )
        {
            this.fullscreen = false;
            this.attachControls( document.body, this.media );
        }
    }
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
    if( $( event.target ).find( this.media ).length !== 0 )
    {
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
            this.playbackReset();
        }
        else if( event.key === Controller.settings[ Settings.Controls.MediaControls.Loop ] )
        {
            this.loop( !this.media.loop );
        }
    }
};

MediaController.prototype.playbackMuchSlower = function()
{
    this.media.playbackRate = Math.max( 0, Math.ceil( ( this.media.playbackRate - 0.5 ) / 0.5 ) * 0.5 );
};

MediaController.prototype.playbackSlower = function()
{
    this.media.playbackRate = Math.max( 0, this.media.playbackRate - 0.1 );
};

MediaController.prototype.playbackReset = function()
{
    this.media.playbackRate = 1.0;
};

MediaController.prototype.playbackFaster = function()
{
    this.media.playbackRate += 0.1;
};

MediaController.prototype.playbackMuchFaster = function()
{
    this.media.playbackRate = Math.max( 0, Math.floor( ( this.media.playbackRate + 0.5 ) / 0.5 ) * 0.5 );
};

MediaController.prototype.loop = function( loop )
{
    this.media.loop = loop;

    if( this.media.loop )
    {
        $( '#media-control-overlay-loop' ).prop( 'title', 'Do not loop' );
        $( '#media-control-overlay-loop > span' ).removeClass( 'glyphicon-repeat' ).addClass( 'glyphicon-arrow-right' );
    }
    else
    {
        $( '#media-control-overlay-loop' ).prop( 'title', 'Loop' );
        $( '#media-control-overlay-loop > span' ).removeClass( 'glyphicon-arrow-right' ).addClass( 'glyphicon-repeat' );
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


MediaController.onNewMedia = function( callback )
{
    $( 'audio, video' ).each( function()
    {
        callback( this );
    } );

    var newMediaElementObserver = new MutationObserver( function( mutations )
    {
        mutations.forEach( function( mutation )
        {
            mutation.addedNodes.forEach( function( node )
            {
                if( node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO' )
                {
                    callback( node );
                }
                else
                {
                    $( node ).find( 'audio, video' ).each( function()
                    {
                        callback( this );
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
    } );
};