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

export function parseTime( timeText: string | null )
{
  if( !timeText )
  {
    return 0;
  }

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

export function cssUrlToUrl( cssUrl: string )
{
  return cssUrl.replace( /^.*\s*url\(\s*[\'\"]?/, '' ).replace( /[\'\"]?\s*\).*/, '' );
}

export function isStringNotNullOrWhitespace( s: string | null | undefined ): s is string
{
  return !!s && !/^\s+$/.test( s );
}

export function queryXpathSelectorAll<E extends HTMLElement = HTMLElement>( xpathSelector: string, contextNode: Node = document ): E[]
{
  let result = document.evaluate( xpathSelector, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  let elems: E[] = [];
  for( let i = 0; i < result.snapshotLength; i++ )
  {
    let node = result.snapshotItem( i );
    if( node instanceof HTMLElement )
    {
      elems.push( node as E );
    }
  }
  return elems;
}

export function queryXpathSelector<E extends HTMLElement = HTMLElement>( xpathSelector: string, contextNode: Node = document ): E | null
{
  let result = document.evaluate( xpathSelector, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
  if( result.singleNodeValue instanceof HTMLElement )
  {
    return result.singleNodeValue as E;
  }
  else
  {
    return null;
  }
}
