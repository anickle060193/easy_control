import React from 'react';
import { TextField, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import withSetting, { WithSettingProps } from 'options/components/withSetting';

const styles = ( theme: Theme ) => createStyles( {
  root: {
    maxWidth: '100%',
    width: 400,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  }
} );

interface OwnProps
{
  label: string;
  helpText?: string;
  splitLines?: boolean;
}

type Props = OwnProps & WithSettingProps & WithStyles<typeof styles>;

class TextSetting extends React.Component<Props>
{
  public render()
  {
    const { classes, label, helpText, value } = this.props;

    let text = Array.isArray( value ) ? value.join( '\n' ) : value;

    return (
      <TextField
        className={classes.root}
        multiline={true}
        rows={8}
        label={label}
        helperText={helpText}
        value={text}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }

  private onChange = ( e: React.ChangeEvent<HTMLTextAreaElement> ) =>
  {
    this.props.onChange( e.target.value );
  }

  private onBlur = ( e: React.UIEvent<HTMLTextAreaElement> ) =>
  {
    if( this.props.splitLines )
    {
      this.props.onSave( e.currentTarget.value.split( /[\r\n]+/ ) );
    }
    else
    {
      this.props.onSave( e.currentTarget.value );
    }
  }
}

export default withSetting<OwnProps>( withStyles( styles )( TextSetting ) );
