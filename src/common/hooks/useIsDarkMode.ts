import React from 'react';

const darkModeQuery = window.matchMedia( '( prefers-color-scheme: dark )' );

function getIsDarkMode()
{
  return darkModeQuery.matches;
}

export default function useIsDarkMode(): boolean
{
  const[ isDarkMode, setIsDarkMode ] = React.useState( getIsDarkMode );

  React.useEffect( () =>
  {
    function onChange()
    {
      setIsDarkMode( getIsDarkMode() );
    }

    darkModeQuery.addEventListener( 'change', onChange );
    onChange();

    return () =>
    {
      darkModeQuery.removeEventListener( 'change', onChange );
    };
  }, [] );

  return isDarkMode;
}
