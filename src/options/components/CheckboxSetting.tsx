import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';

import { useSetting } from '../../common/hooks/useSetting';
import { SettingKeyFromValue } from '../../common/settings';

interface Props
{
  setting: SettingKeyFromValue<boolean>;
  label: string;
}

export const CheckboxSetting: React.FC<Props> = ( { setting, label } ) =>
{
  const [ checked, setChecked ] = useSetting( setting );

  return (
    <FormControlLabel
      label={label}
      control={(
        <Checkbox
          checked={checked}
          onChange={( _e, checked ) => setChecked( checked )}
        />
      )}
    />
  );
};
