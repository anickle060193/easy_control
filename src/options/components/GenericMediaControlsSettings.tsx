import React from 'react';
import { Theme, createStyles, withStyles, WithStyles, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import CheckboxSetting from 'options/components/CheckboxSetting';
import KeyboardShortcutSetting from 'options/components/KeyboardShortcutSetting';

import { Settings } from 'common/settings';

const KEYBOARD_SHORTCUTS: Array<{
  shortcutSetting: Settings.Controls.MediaControls,
  overlaySetting: Settings.Controls.OverlayControls,
  description: string,
  allowHiding: boolean,
}> = [
    { shortcutSetting: Settings.Controls.MediaControls.MuchSlower, overlaySetting: Settings.Controls.OverlayControls.MuchSlower, description: 'Playback Speed Much Slower', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.Slower, overlaySetting: Settings.Controls.OverlayControls.Slower, description: 'Playback Speed Slower', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.SkipBackward, overlaySetting: Settings.Controls.OverlayControls.SkipBackward, description: 'Skip Backward', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.PlayPause, overlaySetting: Settings.Controls.OverlayControls.PlayPause, description: 'Play/Pause', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.SkipForward, overlaySetting: Settings.Controls.OverlayControls.SkipForward, description: 'Skip Forward', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.Faster, overlaySetting: Settings.Controls.OverlayControls.Faster, description: 'Playback Speed Faster', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.MuchFaster, overlaySetting: Settings.Controls.OverlayControls.MuchFaster, description: 'Playback Speed Much Faster', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.Reset, overlaySetting: Settings.Controls.OverlayControls.Reset, description: 'Playback Speed Reset', allowHiding: false },
    { shortcutSetting: Settings.Controls.MediaControls.Loop, overlaySetting: Settings.Controls.OverlayControls.Loop, description: 'Loop', allowHiding: true },
    { shortcutSetting: Settings.Controls.MediaControls.Fullscreen, overlaySetting: Settings.Controls.OverlayControls.Fullscreen, description: 'Fullscreen', allowHiding: true },
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
