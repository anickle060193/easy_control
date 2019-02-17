import React from 'react';

import { SettingsKey, SettingsType, settings } from 'common/settings';

export interface WithSettingProps
{
  value: SettingsType[ SettingsKey ];
  onChange: ( value: SettingsType[ SettingsKey ] ) => void;
  onSave: ( value?: SettingsType[ SettingsKey ] ) => void;
  onReset: () => void;
}

interface WrappedWithSettingProps
{
  setting: SettingsKey;
}

export default function withSetting<P>( WrappedComponent: React.ComponentType<P & WithSettingProps> ): React.ComponentType<P & WrappedWithSettingProps>
{
  interface State
  {
    value: SettingsType[ SettingsKey ];
  }

  class WithSettingComponent extends React.Component<P & WrappedWithSettingProps, State>
  {
    public readonly state: State = {
      value: settings.get( this.props.setting )
    };

    public componentDidMount()
    {
      settings.initialize( () =>
      {
        this.setState( { value: settings.get( this.props.setting ) } );
      } );
    }

    public render()
    {
      const { value } = this.state;

      return (
        <WrappedComponent
          {...this.props}
          value={value}
          onChange={this.onChange}
          onSave={this.onSave}
          onReset={this.onReset}
        />
      );
    }

    private onChange = ( value: SettingsType[ SettingsKey ] ) =>
    {
      this.setState( { value: value } );
    }

    private onSave = ( value?: SettingsType[ SettingsKey ] ) =>
    {
      if( typeof value === 'undefined' )
      {
        settings.set( this.props.setting, this.state.value );
      }
      else
      {
        this.onChange( value );
        settings.set( this.props.setting, value );
      }
    }

    private onReset = () =>
    {
      this.onChange( settings.get( this.props.setting ) );
    }
  }

  return WithSettingComponent;
}
