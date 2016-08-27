function BackgroundController( port )
{
    this.port = port;
    this.name = this.port.name;
    this.paused = true;
    this.color = '';
    this.progress = 0.0;
    this.allowLockOnInactivity = true;
}

BackgroundController.prototype.play = function()
{
    this.port.postMessage( new Message( Message.types.from_background.PLAY ) );
};

BackgroundController.prototype.pause = function()
{
    this.port.postMessage( new Message( Message.types.from_background.PAUSE ) );
};

BackgroundController.prototype.next = function()
{
    this.port.postMessage( new Message( Message.types.from_background.NEXT ) );
};

BackgroundController.prototype.previous = function()
{
    this.port.postMessage( new Message( Message.types.from_background.PREVIOUS ) );
};

BackgroundController.prototype.like = function()
{
    this.port.postMessage( new Message( Message.types.from_background.LIKE ) );
};

BackgroundController.prototype.unlike = function()
{
    this.port.postMessage( new Message( Message.types.from_background.UNLIKE ) );
};

BackgroundController.prototype.dislike = function()
{
    this.port.postMessage( new Message( Message.types.from_background.DISLIKE ) );
};

BackgroundController.prototype.undislike = function()
{
    this.port.postMessage( new Message( Message.types.from_background.UNDISLIKE ) );
};