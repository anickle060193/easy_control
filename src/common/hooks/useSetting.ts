import React from 'react';

import settings, { SettingKeyType, SettingsType } from '../settings';

export function useSetting<K extends SettingKeyType>( setting: K ): [ SettingsType[ K ], ( value: SettingsType[ K ] ) => void ]
{
  const [ value, setValue ] = React.useState( () => settings.get( setting ) );

  React.useEffect( () =>
  {
    function onChange()
    {
      setValue( settings.get( setting ) );
    }

    settings.onInitialized.addEventListener( onChange );
    settings.onChanged.addEventListener( onChange );

    return () =>
    {
      settings.onInitialized.removeEventListener( onChange );
      settings.onChanged.removeEventListener( onChange );
    };
  }, [ setting ] );

  const setSettingValue = React.useCallback( ( value: SettingsType[ K ] ): void =>
  {
    void settings.set( setting, value );
  }, [ setting ] );

  return [ value, setSettingValue ];
}
