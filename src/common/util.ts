export function assertNever( value: never ): never
{
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error( `Value is not never: ${value}` );
}

export type BrowserName = 'chrome' | 'firefox' | 'other';

export async function getBrowserName(): Promise<BrowserName>
{
  try
  {
    const info = await browser.runtime.getBrowserInfo();
    if( info.name === 'Mozilla' )
    {
      return 'firefox';
    }
    else if( info.name === 'Chrome' )
    {
      return 'chrome';
    }
    else
    {
      console.warn( 'Unknown browser:', info );
      return 'other';
    }
  }
  catch( e )
  {
    return 'chrome';
  }
}
