function Message( type, data )
{
    this.type = type;
    this.data = data;
}

Message.types = {
    to_background : {
        INITIALIZE : 'INITIALIZE',
        PAUSE_REPORT : 'PAUSE_REPORT',
        PROGRESS_REPORT : 'PROGRESS_REPORT'
    },
    from_background : {
        PAUSE : 'PAUSE',
        PLAY : 'PLAY'
    }
}


function trackTimeToSeconds( time_text )
{
    var timeSplit = time_text.split( ':', 2 );
    return parseFloat( timeSplit[ 0 ] ) * 60 + parseFloat( timeSplit[ 1 ] );
}