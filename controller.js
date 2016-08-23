var POLLING_INTERVAL = 100;

function Controller( name, color )
{
    this.name = name
    this.color = color;

    this.currentContent = null;
    this.port = chrome.runtime.connect( null, { name : name } );

    var controller = this;
    this.port.onMessage.addListener( function( message )
    {
        if( message.type === Message.types.from_background.PAUSE )
        {
            console.log( 'Recieved: PAUSE' );
            controller.pause();
        }
        else if( message.type === Message.types.from_background.PLAY )
        {
            console.log( 'Recieved: PLAY' );
            controller.play();
        }
        else if( message.type === Message.types.from_background.NEXT )
        {
            console.log( 'Recieved: NEXT' );
            controller.next();
        }
        else if( message.type === Message.types.from_background.PREVIOUS )
        {
            console.log( 'Recieved: PREVIOUS' );
            controller.previous();
        }
        else if( message.type === Message.types.from_background.DISLIKE )
        {
            console.log( 'Recieved: DISLIKE' );
            controller.dislike();
        }
        else if( message.type == Message.types.from_background.UNDISLIKE )
        {
            console.log( 'Recieved: UNDISLIKE' );
            controller.undislike();
        }
        else if( message.type === Message.types.from_background.LIKE )
        {
            console.log( 'Recieved: LIKE' );
            controller.like();
        }
        else if( message.type === Message.types.from_background.UNLIKE )
        {
            console.log( 'Recieved: UNLIKE' );
            controller.unlike();
        }
    } );

    this.port.postMessage( new Message( Message.types.to_background.INITIALIZE, { color : this.color } ) );
}

Controller.prototype.reportPaused = function( paused )
{
    this.port.postMessage( new Message( Message.types.to_background.PAUSE_REPORT, paused ) );
};

Controller.prototype.reportProgress = function( progress )
{
    this.port.postMessage( new Message( Message.types.to_background.PROGRESS_REPORT, progress ) );
};

Controller.prototype.startPolling = function()
{
    var controller = this;
    var interval = setInterval( function()
    {
        var paused = controller.isPaused();

        if( paused !== controller.paused )
        {
            controller.paused = paused;
            console.log( 'Reporting Paused: ' + controller.paused );
            controller.reportPaused( controller.paused );
        }

        var contentInfo = controller.getContentInfo();
        if( contentInfo !== null && ( controller.currentContent === null || contentInfo.title !== controller.currentContent.title ) )
        {
            console.log( 'Started New Content' );
            console.log( contentInfo );
            controller.currentContent = contentInfo;
            controller.port.postMessage( new Message( Message.types.to_background.NEW_CONTENT, controller.currentContent ) );
        }

        controller.reportProgress( controller.getProgress() );

    }, POLLING_INTERVAL );
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

Controller.prototype._play = function(){ throw 'Unimplemented: _play()' };
Controller.prototype._pause = function() { throw 'Unimplemented: _pause()' };
Controller.prototype._previous = function() { throw 'Unimplemented: _previous()' };
Controller.prototype._next = function() { throw 'Unimplemented: _next()' };
Controller.prototype._like = function() { throw 'Unimplemented: _like()' };
Controller.prototype._unlike = function() { throw 'Unimplemented: _unlike()' };
Controller.prototype._dislike = function() { throw 'Unimplemented: _dislike()' };
Controller.prototype._undislike = function() { throw 'Unimplemented: _undislike()' };
Controller.prototype._isLiked = function() { throw 'Unimplemented: _isLiked()' };
Controller.prototype._isDisliked = function() { throw 'Unimplemented: _isDisliked()' };
Controller.prototype._isPaused = function() { throw 'Unimplemented: _isPaused()' };
Controller.prototype._getProgress = function() { throw 'Unimplemented: _getProgress()' };
Controller.prototype._getContentInfo = function() { throw 'Unimplemented: _getContentInfo()' };