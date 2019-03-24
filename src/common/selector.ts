import { queryXpathSelectorAll } from 'common/utilities';

class Selector<T extends HTMLElement>
{
  private readonly selector: string;
  private readonly match: T[];

  public get length()
  {
    return this.match.length;
  }

  constructor( selector: string, match: ArrayLike<T> )
  {
    this.selector = selector;
    this.match = Array.from( match );
  }

  public log()
  {
    if( process.env.NODE_ENV === 'development' )
    {
      console.log( this.selector, this.match );
    }
    return this;
  }

  public index( index: number )
  {
    if( index < 0 || this.match.length <= index )
    {
      console.warn( this.selector, '- Selector index out of range:', index, 'length:', this.match.length );
    }
    return new Selector( `${this.selector}[${index}]`, this.match.slice( index, index + 1 ) );
  }

  public single()
  {
    return new Selector( `${this.selector}:single`, this.match.slice( 0, 1 ) );
  }

  public last()
  {
    return this.index( this.match.length - 1 );
  }

  public mapSingle<U>( callback: ( element: T ) => U, defaultValue: U ): U
  {
    if( this.match.length === 0 )
    {
      return defaultValue;
    }
    else
    {
      return callback( this.match[ 0 ] );
    }
  }

  public map<U>( callback: ( element: T ) => U ): U[]
  {
    return this.match.map( callback );
  }

  public filter<U extends T>( callback: ( element: T ) => element is U ): Selector<U>;
  public filter( callback: ( element: T ) => boolean ): Selector<T>;
  public filter( callback: ( element: T ) => boolean ): Selector<T>
  {
    return new Selector( `${this.selector}:filtered`, this.match.filter( callback ) );
  }

  public find<E extends HTMLElement = HTMLElement>( selector: string )
  {
    let matches = this.match
      .map( ( element ) => Array.from( element.querySelectorAll<E>( selector ) ) )
      .reduce( ( elements: Set<E>, match ) =>
      {
        for( let elem of match )
        {
          elements.add( elem );
        }
        return elements;
      }, new Set<E>() );

    return new Selector( `${this.selector} ${selector}`, Array.from( matches ) );
  }

  public parent()
  {
    return new Selector( `${this.selector}:parent`, this.match.map( ( el ) => el.parentElement ).filter( ( el ): el is HTMLElement => el instanceof HTMLElement ) );
  }

  public text()
  {
    return this.match.map( ( el ) => el.textContent ).join( '' );
  }

  public css<K extends keyof CSSStyleDeclaration>( key: K, defaultValue: NonNullable<CSSStyleDeclaration[ K ]> ): NonNullable<CSSStyleDeclaration[ K ]>;
  public css<K extends keyof CSSStyleDeclaration>( key: K ): CSSStyleDeclaration[ K ] | null;
  public css<K extends keyof CSSStyleDeclaration>( key: K, defaultValue?: NonNullable<CSSStyleDeclaration[ K ]> ): CSSStyleDeclaration[ K ] | null
  {
    if( this.match.length > 0 )
    {
      let val = this.match[ 0 ].style[ key ];
      if( val !== undefined
        && val !== null )
      {
        return val;
      }
    }

    if( defaultValue !== undefined )
    {
      return defaultValue;
    }

    return null;
  }

  public prop<P extends keyof T>( prop: P ): T[ P ] | null;
  public prop<P extends keyof T>( prop: P, defaultValue: T[ P ] ): T[ P ];
  public prop<P extends keyof T>( prop: P, defaultValue?: T[ P ] ): T[ P ] | null
  {
    if( this.match.length > 0 )
    {
      let p = this.match[ 0 ][ prop ];
      if( p !== undefined )
      {
        return p;
      }
    }

    if( defaultValue !== undefined )
    {
      return defaultValue;
    }

    return null;
  }

  public attr( attribute: string ): string | null;
  public attr( attribute: string, defaultValue: string ): string;
  public attr( attribute: string, defaultValue?: string ): string | null
  {
    if( this.match.length > 0 )
    {
      let a = this.match[ 0 ].getAttribute( attribute );
      if( a !== null )
      {
        return a;
      }
    }

    if( defaultValue !== undefined )
    {
      return defaultValue;
    }

    return null;
  }

  public click()
  {
    if( this.match.length === 0 )
    {
      console.warn( this.selector, '- No selected elements to click' );
    }
    else
    {
      if( this.match.length > 1 )
      {
        console.warn( this.selector, '- Multiple elements selected on click' );
      }

      this.match[ 0 ].click();
    }
  }

  public hasClass( klass: string )
  {
    return this.match.some( ( element ) => element.classList.contains( klass ) );
  }
}

export function select<E extends HTMLElement = HTMLElement>( selector: string )
{
  return new Selector<E>( selector, document.querySelectorAll<E>( selector ) );
}

export function selectXPath<E extends HTMLElement = HTMLElement>( xpathSelector: string )
{
  return new Selector<E>( xpathSelector, queryXpathSelectorAll( xpathSelector ) );
}
