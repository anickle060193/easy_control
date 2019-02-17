import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

import withSetting, { WithSettingProps } from 'options/components/withSetting';

interface Props
{
  label?: string;
}

class CheckboxSetting extends React.Component<Props & WithSettingProps>
{
  public render()
  {
    const { label, value } = this.props;

    let checkbox = (
      <Checkbox
        checked={value as boolean}
        onChange={this.onChange}
      />
    );

    if( label )
    {
      return (
        <FormControlLabel
          label={label}
          control={checkbox}
        />
      );
    }
    else
    {
      return (
        checkbox
      );
    }
  }

  private onChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onSave( e.target.checked );
  }
}

export default withSetting<Props>( CheckboxSetting );
