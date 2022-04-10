import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

import { useSetting } from '../../common/hooks/useSetting';
import { SettingKeyFromValue } from '../../common/settings';

interface Props
{
  setting: SettingKeyFromValue<boolean>;
  label?: string;
}

export const CheckboxSetting: React.FC<Props> = ( { setting, label } ) =>
{
  const [ checked, setChecked ] = useSetting( setting );

  const checkbox = (
    <Checkbox
      checked={checked}
      onChange={( _e, checked ) => setChecked( checked )}
    />
  );

  if( !label )
  {
    return checkbox;
  }

  return (
    <FormControlLabel
      label={label}
      control={checkbox}
    />
  );
};
