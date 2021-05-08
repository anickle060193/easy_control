import React from 'react';
import { OutlinedTextFieldProps, TextField } from '@material-ui/core';

import { useSetting } from '../../common/hooks/useSetting';
import { SettingKeyFromValue } from '../../common/settings';

interface Props extends Omit<OutlinedTextFieldProps, 'variant'>
{
  label: string;
  setting: SettingKeyFromValue<string[]>;
}

export const StringArraySetting: React.FC<Props> = ( { label, setting, ...textFieldProps } ) =>
{
  const [ value, setValue ] = useSetting( setting );

  const [ textValue, setTextValue ] = React.useState( () => value.join( '\n' ) );

  return (
    <TextField
      {...textFieldProps}
      label={label}
      variant="outlined"
      multiline={true}
      fullWidth={true}
      InputLabelProps={{
        shrink: true,
      }}
      value={textValue}
      onChange={( e ) => setTextValue( e.target.value )}
      onBlur={() =>
      {
        const v = textValue.trim();
        setValue( v ? v.split( '\n' ) : [] );
      }}
    />
  );
};
