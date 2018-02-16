export function limit( value: number, min: number, max: number )
{
  if( value < min )
  {
    return min;
  }
  else if( value > max )
  {
    return max;
  }
  else
  {
    return value;
  }
}

export function parseTime( timeText: string )
{
  let strippedTimeText = timeText.trim();
  let timeSplit = strippedTimeText.split( ':' );
  if( timeSplit.length === 3 )
  {
    let hours = Math.abs( parseFloat( timeSplit[ 0 ] ) );
    let minutes = Math.abs( parseFloat( timeSplit[ 1 ] ) );
    let seconds = Math.abs( parseFloat( timeSplit[ 2 ] ) );
    return seconds + ( minutes + hours * 60 ) * 60;
  }
  else if( timeSplit.length === 2 )
  {
    let minutes = Math.abs( parseFloat( timeSplit[ 0 ] ) );
    let seconds = Math.abs( parseFloat( timeSplit[ 1 ] ) );
    return minutes * 60 + seconds;
  }
  else
  {
    return 0;
  }
}

export function checkError()
{
  if( chrome.runtime.lastError )
  {
    console.warn( chrome.runtime.lastError );
    return false;
  }
  return true;
}

export function getKeyboardShortcut( keyEvent: KeyboardEvent )
{
  let modifiers = {
    'Alt': 'Alt',
    'Control': 'Ctrl',
    'Meta': 'Command',
    'OS': 'Win',
    'Shift': 'Shift'
  };

  let shortcut: string[] = [];

  $.each( modifiers, function( modifier )
  {
    if( keyEvent.getModifierState( modifier ) )
    {
      shortcut.push( modifiers[ modifier ] );
    }
  } );

  if( typeof ( modifiers[ keyEvent.key ] ) === 'undefined' )
  {
    if( /^(Key|Digit|Numpad)/.test( keyEvent.code ) )
    {
      shortcut.push( keyEvent.code.replace( /(Key|Digit|Numpad)/, '' ) );
    }
    else
    {
      shortcut.push( keyEvent.key );
    }
  }
  return shortcut.join( '+' );
}
