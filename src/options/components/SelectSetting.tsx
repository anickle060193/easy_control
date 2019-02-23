import React from 'react';
import { TextField, MenuItem, Theme, WithStyles, withStyles, createStyles } from '@material-ui/core';

import withSetting, { WithSettingProps } from 'options/components/withSetting';

const styles = ( theme: Theme ) => createStyles( {
  root: {
    maxWidth: '100%',
    width: 300,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  }
} );

interface Option
{
  value: string;
  label: string;
}

interface Props
{
  label: string;
  options: Option[];
}

class SelectSetting extends React.Component<Props & WithSettingProps & WithStyles<typeof styles>>
{
  public render()
  {
    const { classes, label, options, value } = this.props;

    return (
      <TextField
        className={classes.root}
        select={true}
        label={label}
        value={value}
        onChange={this.onChange}
      >
        {options.map( ( option, i ) => (
          <MenuItem key={i} value={option.value}>
            {option.label}
          </MenuItem>
        ) )}
      </TextField>
    );
  }

  private onChange = ( e: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    this.props.onChange( e.target.value );
  }
}

export default withSetting<Props>( withStyles( styles )( SelectSetting ) );
