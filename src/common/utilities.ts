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

const MODIFIERS = [
  { key: 'Alt', name: 'Alt' },
  { key: 'Control', name: 'Ctrl' },
  { key: 'Meta', name: 'Command' },
  { key: 'OS', name: 'Win' },
  { key: 'Shift', name: 'Shift' },
];

const MODIFIER_KEYS = new Set( MODIFIERS.map( ( { key } ) => key ) );

export function getKeyboardShortcut( keyEvent: KeyboardEvent | React.KeyboardEvent )
{
  let shortcut: string[] = [];

  for( let { key: modifierKey, name } of MODIFIERS )
  {
    if( keyEvent.getModifierState( modifierKey ) )
    {
      shortcut.push( name );
    }
  }

  if( keyEvent.key === ' ' )
  {
    shortcut.push( 'Space' );
  }
  else if( keyEvent.key.length === 1 )
  {
    shortcut.push( keyEvent.key.toUpperCase() );
  }
  else if( !MODIFIER_KEYS.has( keyEvent.key ) )
  {
    shortcut.push( keyEvent.key );
  }

  return shortcut.join( '+' );
}
