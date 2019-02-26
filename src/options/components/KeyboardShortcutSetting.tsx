import React from 'react';
import { TextField, Theme, createStyles, WithStyles, withStyles, InputAdornment, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import withSetting, { WithSettingProps } from 'options/components/withSetting';

import { getKeyboardShortcut } from 'common/utilities';

const styles = ( theme: Theme ) => createStyles( {
  input: {
    textAlign: 'center',
  }
} );

interface OwnProps
{
  label?: string;
}

type Props = OwnProps & WithSettingProps & WithStyles<typeof styles>;

class KeyboardShortcutSetting extends React.Component<Props>
{
  public render()
  {
    const { classes, label, value } = this.props;

    return (
      <TextField
        label={label}
        placeholder="Press Key"
        InputProps={{
          classes: {
            input: classes.input
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={this.onClearClick}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        value={value}
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur}
      />
    );
  }

  private onKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
  {
    e.preventDefault();

    this.props.onChange( getKeyboardShortcut( e ) );
  }

  private onBlur = () =>
  {
    this.props.onSave();
  }

  private onClearClick = () =>
  {
    this.props.onSave( '' );
  }
}

export default withSetting<OwnProps>( withStyles( styles )( KeyboardShortcutSetting ) );
