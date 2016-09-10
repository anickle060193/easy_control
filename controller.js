function Controller( name, color )
{
    this.name = name
    this.color = color;
    this.allowLockOnInactivity = true;
    this.active = !document.hidden;
    console.log( 'Initial active: ' + this.active );
    console.log( 'Initial visibility state: ' + document.visibilityState );

    this.currentContent = null;
    this.lastProgress = 0.0;
    this.pollingInterval = null;
    this.port = chrome.runtime.connect( null, { name : name } );

    this.port.onMessage.addListener( this.handleMessage.bind( this ) );
    this.port.onDisconnect.addListener( this.disconnect.bind( this ) );

    $( window ).focus( $.proxy( this.activate, this ) );
    $( window ).blur( $.proxy( this.deactivate, this ) );
}

Controller.prototype.initialize = function()
{
    var data = {
        color : this.color,
        allowLockOnInactivity : this.allowLockOnInactivity
    };
    this.port.postMessage( new Message( Message.types.to_background.INITIALIZE, data ) );
};

Controller.prototype.activate = function()
{
    console.log( 'Controller Active: True' );
    this.active = true;
};

Controller.prototype.deactivate = function()
{
    console.log( 'Controller Active: False' );
    this.active = false;
};

Controller.prototype.handleMessage = function( message )
{
    if( message.type === Message.types.from_background.PAUSE )
    {
        console.log( 'Recieved: PAUSE' );
        this.pause();
    }
    else if( message.type === Message.types.from_background.PLAY )
    {
        console.log( 'Recieved: PLAY' );
        this.play();
    }
    else if( message.type === Message.types.from_background.NEXT )
    {
        console.log( 'Recieved: NEXT' );
        this.next();
    }
    else if( message.type === Message.types.from_background.PREVIOUS )
    {
        console.log( 'Recieved: PREVIOUS' );
        this.previous();
    }
    else if( message.type === Message.types.from_background.DISLIKE )
    {
        console.log( 'Recieved: DISLIKE' );
        this.dislike();
    }
    else if( message.type == Message.types.from_background.UNDISLIKE )
    {
        console.log( 'Recieved: UNDISLIKE' );
        this.undislike();
    }
    else if( message.type === Message.types.from_background.LIKE )
    {
        console.log( 'Recieved: LIKE' );
        this.like();
    }
    else if( message.type === Message.types.from_background.UNLIKE )
    {
        console.log( 'Recieved: UNLIKE' );
        this.unlike();
    }
    else if( message.type === Message.types.from_background.VOLUME_UP )
    {
        console.log( 'Recieved: VOLUME UP' );
        this.volumeUp();
    }
    else if( message.type === Message.types.from_background.VOLUME_DOWN )
    {
        console.log( 'Recieved: VOLUME DOWN' );
        this.volumeDown();
    }
};

Controller.prototype.reportStatus = function()
{
    var data = {
        paused : this.isPaused(),
        progress : this.getProgress(),
        active : this.active
    };
    this.port.postMessage( new Message( Message.types.to_background.STATUS, data ) );
};

Controller.prototype.poll = function()
{
    this.reportStatus();

    if( !this.isPaused() )
    {
        var currentProgress = this.getProgress();

        var contentInfo = this.getContentInfo();
        if( contentInfo !== null )
        {
            var isNewContent = false;
            if( this.currentContent === null )
            {
                isNewContent = true;
                console.log( 'Current is null' );
            }
            else if( this.currentContent.title !== contentInfo.title )
            {
                isNewContent = true;
                console.log( 'Title\'s don\'t match' );
            }
            else if( this.lastProgress >= 0.95 && currentProgress < 0.05 )
            {
                isNewContent = true;
                console.log( 'Progress went from ' + this.lastProgress + ' to ' + currentProgress );
            }

            if( this.currentContent === null
             || this.currentContent.title !== contentInfo.title
             || this.lastProgress >= 0.95 && currentProgress < 0.05 && currentProgress !== 0 )
            {
                console.log( 'Started New Content' );
                console.log( contentInfo );
                this.currentContent = contentInfo;
                this.port.postMessage( new Message( Message.types.to_background.NEW_CONTENT, this.currentContent ) );
            }
        }

        this.lastProgress = currentProgress;
    }
};

Controller.prototype.startPolling = function()
{
    console.log( 'Start polling' );
    this.initialize();
    this.pollingInterval = setInterval( this.poll.bind( this ), 50 );
};

Controller.prototype.stopPolling = function()
{
    console.log( 'Stop polling' );
    clearInterval( this.pollingInterval );

    $( window ).off( 'focus', this.activate );
    $( window ).off( 'blur', this.deactivate );
};

Controller.prototype.disconnect = function()
{
    console.log( 'Disconnect' );
    this.stopPolling();
    this.port.disconnect();
};

Controller.prototype.play = function()
{
    if( this.isPaused() )
    {
        this._play();
    }
};
Controller.prototype.pause = function()
{
    if( !this.isPaused() )
    {
        this._pause();
    }
};

Controller.prototype.previous = function()
{
    this._previous();
};

Controller.prototype.next = function()
{
    this._next();
};

Controller.prototype.like = function()
{
    if( !this.isLiked() )
    {
        this._like();
    }
};

Controller.prototype.unlike = function()
{
    if( this.isLiked() )
    {
        this._unlike();
    }
};

Controller.prototype.dislike = function()
{
    if( !this.isDisliked() )
    {
        this._dislike();
    }
};

Controller.prototype.undislike = function()
{
    if( this.isDisliked() )
    {
        this._undislike();
    }
};

Controller.prototype.isLiked = function()
{
    return this._isLiked();
};

Controller.prototype.isDisliked = function()
{
    return this._isDisliked();
};

Controller.prototype.isPaused = function()
{
    return this._isPaused();
};

Controller.prototype.getProgress = function()
{
    return this._getProgress();
};

Controller.prototype.getContentInfo = function()
{
    var contentInfo = this._getContentInfo();
    if( contentInfo !== null )
    {
        contentInfo.isLiked = this.isLiked();
        contentInfo.isDisliked = this.isDisliked();
    }
    return contentInfo;
};

Controller.prototype.volumeUp = function()
{
    this._volumeUp();
};

Controller.prototype.volumeDown = function()
{
    this._volumeDown();
};

Controller.prototype._play = function()
{
    console.log( 'play not supported.' );
};

Controller.prototype._pause = function()
{
    console.log( 'pause not supported.' );
};

Controller.prototype._previous = function()
{
    console.log( 'previous not supported.' );
};

Controller.prototype._next = function()
{
    console.log( 'next not supported.' );
};

Controller.prototype._like = function()
{
    console.log( 'like not supported.' );
};

Controller.prototype._unlike = function()
{
    console.log( 'unlike not supported.' );
};

Controller.prototype._dislike = function()
{
    console.log( 'dislike not supported.' );
};

Controller.prototype._undislike = function()
{
    console.log( 'undislike not supported.' );
};

Controller.prototype._isLiked = function()
{
    return false;
};

Controller.prototype._isDisliked = function()
{
    return false;
};

Controller.prototype._isPaused = function()
{
    return true;
};

Controller.prototype._getProgress = function()
{
    return 0.0;
};

Controller.prototype._getContentInfo = function()
{
    return null;
};

Controller.prototype._volumeUp = function()
{
    console.log( 'volumeUp not supported.' );
};

Controller.prototype._volumeDown = function()
{
    console.log( 'volumeDown not supported.' );
};