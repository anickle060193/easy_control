import React from 'react';
import settings from '../settings';

export function useSettingsInitialized(): boolean
{
  const [ initialized, setInitialized ] = React.useState( false );

  React.useEffect( () =>
  {
    function onInitialized()
    {
      setInitialized( true );
    }

    settings.onInitialized.addEventListener( onInitialized );

    return () =>
    {
      settings.onInitialized.removeEventListener( onInitialized );
    };
  }, [] );

  return initialized;
}
