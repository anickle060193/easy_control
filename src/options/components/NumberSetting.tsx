import React from 'react';
import { InputAdornment, TextField } from '@material-ui/core';

import { SettingKeyFromValue } from '../../common/settings';
import { useSetting } from '../../common/hooks/useSetting';

function formatValue( value: number, integer: boolean )
{
  if( integer )
  {
    return value.toFixed( 0 );
  }
  else
  {
    return value.toFixed( 2 );
  }
}

interface Props
{
  setting: SettingKeyFromValue<number>;
  label: string;
  integer?: boolean;
  minimum?: number;
  maximum?: number;
  endAdornmentText?: string;
}

export const NumberSetting: React.FC<Props> = ( { setting, label, integer = true, minimum, maximum, endAdornmentText } ) =>
{
  const [ value, setValue ] = useSetting( setting );

  const [ stringValue, setStringValue ] = React.useState( () => formatValue( value, integer ) );

  const numberValue = +stringValue;

  let errorText: string | null;
  if( !isFinite( numberValue ) )
  {
    errorText = 'Invalid value';
  }
  else if( integer
    && Math.trunc( numberValue ) !== numberValue )
  {
    errorText = 'Value must be an integer';
  }
  else if( typeof minimum === 'number'
    && numberValue < minimum )
  {
    errorText = `Minimum allowed value is ${minimum}.`;
  }
  else if( typeof maximum === 'number'
    && numberValue > maximum )
  {
    errorText = `Maximum allowed value is ${maximum}.`;
  }
  else
  {
    errorText = null;
  }

  return (
    <TextField
      type="numeric"
      variant="outlined"
      label={label}
      inputProps={{
        min: minimum,
        max: maximum,
      }}
      error={!!errorText}
      helperText={errorText}
      InputProps={{
        endAdornment: endAdornmentText && (
          <InputAdornment position="end">
            {endAdornmentText}
          </InputAdornment>
        ),
      }}
      value={stringValue}
      onChange={( e ) => setStringValue( e.target.value )}
      onBlur={() =>
      {
        if( !errorText )
        {
          setValue( numberValue );
        }
      }}
    />
  );
};
