import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import CheckboxSetting from 'options/components/CheckboxSetting';
import KeyboardShortcutSetting from 'options/components/KeyboardShortcutSetting';

import { SettingKey } from 'common/settings';

const KEYBOARD_SHORTCUTS: Array<{
  shortcutSetting: SettingKey.Controls.MediaControls,
  overlaySetting: SettingKey.Controls.OverlayControls,
  description: string,
  allowHiding: boolean,
}> = [
    { shortcutSetting: SettingKey.Controls.MediaControls.MuchSlower, overlaySetting: SettingKey.Controls.OverlayControls.MuchSlower, description: 'Playback Speed Much Slower', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.Slower, overlaySetting: SettingKey.Controls.OverlayControls.Slower, description: 'Playback Speed Slower', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.SkipBackward, overlaySetting: SettingKey.Controls.OverlayControls.SkipBackward, description: 'Skip Backward', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.PlayPause, overlaySetting: SettingKey.Controls.OverlayControls.PlayPause, description: 'Play/Pause', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.SkipForward, overlaySetting: SettingKey.Controls.OverlayControls.SkipForward, description: 'Skip Forward', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.Faster, overlaySetting: SettingKey.Controls.OverlayControls.Faster, description: 'Playback Speed Faster', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.MuchFaster, overlaySetting: SettingKey.Controls.OverlayControls.MuchFaster, description: 'Playback Speed Much Faster', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.Reset, overlaySetting: SettingKey.Controls.OverlayControls.Reset, description: 'Playback Speed Reset', allowHiding: false },
    { shortcutSetting: SettingKey.Controls.MediaControls.Loop, overlaySetting: SettingKey.Controls.OverlayControls.Loop, description: 'Loop', allowHiding: true },
    { shortcutSetting: SettingKey.Controls.MediaControls.Fullscreen, overlaySetting: SettingKey.Controls.OverlayControls.Fullscreen, description: 'Fullscreen', allowHiding: true },
  ];

const styles = ( theme: Theme ) => createStyles( {} );

class GenericMediaControlsSettings extends React.Component<WithStyles<typeof styles>>
{
  public render()
  {
    // const { classes } = this.props;

    return (
      <>
        <Table padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>Control</TableCell>
              <TableCell align="center">Keyboard Shortcut</TableCell>
              <TableCell align="center">Display in Overlay?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {KEYBOARD_SHORTCUTS.map( ( { description, allowHiding, overlaySetting, shortcutSetting }, i ) => (
              <TableRow key={i} hover={true}>
                <TableCell>
                  {description}
                </TableCell>
                <TableCell align="center">
                  <KeyboardShortcutSetting
                    setting={shortcutSetting}
                  />
                </TableCell>
                <TableCell align="center">
                  {allowHiding && (
                    <CheckboxSetting
                      setting={overlaySetting}
                    />
                  )}
                </TableCell>
              </TableRow>
            ) )}
          </TableBody>
        </Table>
      </>
    );
  }
}

export default withStyles( styles )( GenericMediaControlsSettings );
