class Selector<T extends HTMLElement>
{
  private readonly match: T[];

  public get length()
  {
    return this.match.length;
  }

  constructor( match: ArrayLike<T> )
  {
    this.match = Array.from( match );
  }

  public index( index: number )
  {
    if( index < 0 || this.match.length <= index )
    {
      console.warn( 'Selector index out of range:', index, 'length:', this.match.length );
    }
    return new Selector( this.match.slice( index, index + 1 ) );
  }

  public single()
  {
    return new Selector( this.match.slice( 0, 1 ) );
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
  public filter( callback: ( element: T ) => boolean ): Selector<T>
  {
    return new Selector( this.match.filter( callback ) );
  }

  public find( selector: string )
  {
    let matches = this.match
      .map( ( element ) => Array.from( element.querySelectorAll<HTMLElement>( selector ) ) )
      .reduce( ( elements: Set<HTMLElement>, match ) =>
      {
        for( let elem of match )
        {
          elements.add( elem );
        }
        return elements;
      }, new Set<HTMLElement>() );

    return new Selector( Array.from( matches ) );
  }

  public text()
  {
    return this.match.map( ( el ) => el.textContent ).join( '' );
  }

  public css<K extends keyof CSSStyleDeclaration>( key: K ): CSSStyleDeclaration[ K ] | null
  {
    if( this.match.length === 0 )
    {
      return null;
    }
    else
    {
      return this.match[ 0 ].style[ key ];
    }
  }

  public prop<P extends keyof T>( prop: P ): T[ P ] | null
  {
    if( this.match.length === 0 )
    {
      return null;
    }
    else
    {
      return this.match[ 0 ][ prop ];
    }
  }

  public click()
  {
    if( this.match.length === 0 )
    {
      console.warn( 'No selected elements to click' );
    }
    else
    {
      if( this.match.length > 1 )
      {
        console.warn( 'Multiple elements selected on click' );
      }

      this.match[ 0 ].click();
    }
  }

  public hasClass( klass: string )
  {
    return this.match.some( ( element ) => element.classList.contains( klass ) );
  }
}

export function select( selector: string )
{
  return new Selector( document.querySelectorAll<HTMLElement>( selector ) );
}
