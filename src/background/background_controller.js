class BackgroundController
{
    constructor( port )
    {
        this.port = port;
        this.name = this.port.name;
        this.color = '';
        this.allowPauseOnInactivity = true;
        this.hostname = null;

        this.paused = true;
        this.progress = 0.0;
        this.active = false;
        this.content = null;
    }

    play()
    {
        this.port.postMessage( new Message( Message.types.from_background.PLAY ) );
    }

    pause()
    {
        this.port.postMessage( new Message( Message.types.from_background.PAUSE ) );
    }

    next()
    {
        this.port.postMessage( new Message( Message.types.from_background.NEXT ) );
    }

    previous()
    {
        this.port.postMessage( new Message( Message.types.from_background.PREVIOUS ) );
    }

    like()
    {
        this.port.postMessage( new Message( Message.types.from_background.LIKE ) );
    }

    unlike()
    {
        this.port.postMessage( new Message( Message.types.from_background.UNLIKE ) );
    }

    dislike()
    {
        this.port.postMessage( new Message( Message.types.from_background.DISLIKE ) );
    }

    undislike()
    {
        this.port.postMessage( new Message( Message.types.from_background.UNDISLIKE ) );
    }

    volumeUp()
    {
        this.port.postMessage( new Message( Message.types.from_background.VOLUME_UP ) );
    }

    volumeDown()
    {
        this.port.postMessage( new Message( Message.types.from_background.VOLUME_DOWN ) );
    }

    openContent( content )
    {
        this.port.postMessage( new Message( Message.types.from_background.OPEN_CONTENT, content ) );
    }
}