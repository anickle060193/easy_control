import React from 'react';
import { TextField, InputAdornment, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import withSetting, { WithSettingProps } from 'options/components/withSetting';

import { SettingsType, SettingsKey } from 'common/settings';

const styles = ( theme: Theme ) => createStyles( {
  root: {
    maxWidth: '100%',
    width: 300,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  }
} );

function isValid( value: SettingsType[ SettingsKey ] )
{
  return (
    typeof value === 'number'
    && isFinite( value )
  );
}

interface Props
{
  label: string;
  endAdornmentText?: string;
  helperText?: string;
}

class NumberSetting extends React.Component<Props & WithSettingProps & WithStyles<typeof styles>>
{
  public render()
  {
    const { classes, label, endAdornmentText, helperText, value } = this.props;

    return (
      <TextField
        className={classes.root}
        label={label}
        type="number"
        value={isValid( value ) ? value : ''}
        onChange={this.onChange}
        onBlur={this.onBlur}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          endAdornment: endAdornmentText && (
            <InputAdornment position="end">
              {endAdornmentText}
            </InputAdornment>
          )
        }}
        helperText={helperText}
      />
    );
  }

  private onChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onChange( e.target.valueAsNumber );
  }

  private onBlur = () =>
  {
    if( isValid( this.props.value ) )
    {
      this.props.onSave();
    }
    else
    {
      this.props.onReset();
    }
  }
}

export default withSetting<Props>( withStyles( styles )( NumberSetting ) );
