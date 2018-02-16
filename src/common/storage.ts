export function get<T>( key: string )
{
  let item = sessionStorage.getItem( key );
  if( item !== null )
  {
    return JSON.parse( item ) as T;
  }
  return null;
}

export function set<T>( key: string, value: T )
{
  sessionStorage.setItem( key, JSON.stringify( value ) );
}
