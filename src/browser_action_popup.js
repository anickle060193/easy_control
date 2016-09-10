$( 'input' ).click( function()
{
    var messageType = null;

    if( this.id === 'playPause' )
    {
        console.log( 'playPause' );
        messageType = Message.types.from_popup.PLAY;
    }
    else if( this.id === 'next' )
    {
        console.log( 'next' );
        messageType = Message.types.from_popup.NEXT;
    }
    else if( this.id === 'previous' )
    {
        console.log( 'previous' );
        messageType = Message.types.from_popup.PREVIOUS;
    }
    else if( this.id === 'dislike' )
    {
        console.log( 'dislike' );
        messageType = Message.types.from_popup.DISLIKE;
    }
    else if( this.id === 'undislike' )
    {
        console.log( 'undislike' );
        messageType = Message.types.from_popup.UNDISLIKE;
    }
    else if( this.id === 'like' )
    {
        console.log( 'like' );
        messageType = Message.types.from_popup.LIKE;
    }
    else if( this.id === 'unlike' )
    {
        console.log( 'unlike' );
        messageType = Message.types.from_popup.UNLIKE;
    }

    if( messageType )
    {
        chrome.runtime.sendMessage( new Message( messageType ) );
    }
} );