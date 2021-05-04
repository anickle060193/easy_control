import { assertNever } from '../common/util';

export type Selector = string | HTMLElement | ( () => HTMLElement | null ) | Selector[];

export function querySelector( selector: Selector | null ): HTMLElement | null
{
  if( selector === null )
  {
    return null;
  }
  else if( Array.isArray( selector ) )
  {
    for( const s of selector )
    {
      const el = querySelector( s );
      if( el )
      {
        return el;
      }
    }

    return null;
  }
  else if( typeof selector === 'string' )
  {
    return document.querySelector( selector );
  }
  else if( selector instanceof HTMLElement )
  {
    return selector;
  }
  else if( typeof selector === 'function' )
  {
    return selector.call( undefined );
  }
  else
  {
    throw assertNever( selector );
  }
}
