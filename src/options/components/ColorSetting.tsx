import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { Popper, Fade, ClickAwayListener } from '@material-ui/core';

import withSetting, { WithSettingProps } from 'options/components/withSetting';

interface State
{
  anchorEl: HTMLElement | null;
}

type Props = WithSettingProps;

class ColorSetting extends React.Component<Props, State>
{
  public readonly state: State = {
    anchorEl: null
  };

  public render()
  {
    const { value } = this.props;
    const { anchorEl } = this.state;

    return (
      <>
        <input
          type="color"
          style={{ height: 30 }}
          value={value as string}
          onClick={this.onInputClick}
          onChange={this.onChange}
        />
        <Popper
          open={anchorEl !== null}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition={true}
        >
          {( { TransitionProps } ) => (
            <Fade {...TransitionProps}>
              <ClickAwayListener onClickAway={this.onClose}>
                <ChromePicker
                  color={value as string}
                  onChange={this.onColorChange}
                />
              </ClickAwayListener>
            </Fade>
          )}
        </Popper>
      </>
    );
  }

  private onInputClick = ( e: React.MouseEvent<HTMLElement> ) =>
  {
    e.preventDefault();

    this.setState( { anchorEl: e.currentTarget } );
  }

  private onClose = () =>
  {
    this.setState( { anchorEl: null } );
    this.props.onSave();
  }

  private onColorChange = ( color: ColorResult ) =>
  {
    this.props.onChange( color.hex );
  }

  private onChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    this.props.onSave( e.target.value );
  }
}

export default withSetting<{}>( ColorSetting );
