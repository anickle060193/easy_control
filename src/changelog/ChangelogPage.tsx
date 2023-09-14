import React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import { CheckboxSetting } from '../options/components/CheckboxSetting';

import { SettingKey } from '../common/settings';

import { ChangelogVersion } from './components/ChangelogVersion';
import { ChangelogEntry } from './components/ChangelogEntry';

import copyMediaLinkShortcut from './images/copy_media_link_shortcut.png';
import openInExisting from './images/open_in_existing.png';
import notificationPause from './images/notification_pause.png';
import customizeControllerColor from './images/customize_controller_color.png';
import loopMedia from './images/loop_media.png';
import enableDisableControllers from './images/enable_disable_controllers.png';
import blacklistOption from './images/blacklist_option.png';
import removeMediaControls from './images/remove_media_controls.png';
import mediaControlsDraggable from './images/media_controls_draggable.png';
import disableAutoPauseForTab from './images/disable_auto_pause_for_tab.png';
import autoPausedNotificationOption from './images/auto_paused_notification_option.png';
import autoPausedNotification from './images/auto_paused_notification.png';
import showChangeLogOnUpdate from './images/show_change_log_on_update.png';
import disableAutoPause from './images/disable_auto_pause.png';
import notificationLength from './images/notification_length.png';
import playbackSpeedControls from './images/playback_speed_controls.png';
import playbackSpeedControlsOptions from './images/playback_speed_controls_options.png';
import reformattedNotificationSettings from './images/reformatted_notification_settings.png';
import keyboardShortcuts from './images/keyboard_shortcuts.png';
import noActiveNotification from './images/no_active_notification.png';
import notificationNext from './images/notification_next.png';
import pauseLockInactivity from './images/pause_lock_inactivity.png';
import defaultSite from './images/default_site.png';
import notification from './images/notification.png';
import icon from '../../assets/icon48.png';

export const ChangelogPage: React.FC = () =>
{
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Easy Control Options
          </Typography>
          <Box
            sx={{
              marginLeft: 'auto',
            }}
          >
            <CheckboxSetting
              label="Show changelog on update?"
              setting={SettingKey.Other.ShowChangeLogOnUpdate}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 4,
          overflowY: 'auto',
        }}
      >
        <ChangelogVersion version="4.0.3">
          <ChangelogEntry changeType="bug" text="Prevent background controller from being unloaded while any media controllers are active." />
        </ChangelogVersion>

        <ChangelogVersion version="4.0.2">
          <ChangelogEntry changeType="bug" text="Fix Spotify controller (again)." />
        </ChangelogVersion>

        <ChangelogVersion version="4.0.1">
          <ChangelogEntry changeType="bug" text="Fix Spotify controller." />
        </ChangelogVersion>

        <ChangelogVersion version="4.0.0">
          <ChangelogEntry changeType="bug" text="Fix controls overlay not showing." />
          <ChangelogEntry changeType="enhancement" text="Improve controls overlay display." />
          <ChangelogEntry changeType="enhancement" text="Add custom skip forward/backward amounts." />
          <ChangelogEntry changeType="enhancement" text="Improve options page display." />
          <ChangelogEntry changeType="bug" text="Re-add notifications support." />
        </ChangelogVersion>

        <ChangelogVersion version="3.1.0">
          <ChangelogEntry changeType="bug" text="Fix Pandora selectors." />
          <ChangelogEntry changeType="bug" text="Fix Spotify selectors." />
          <ChangelogEntry changeType="bug" text="Add 'Options' item to browser action menu." />
          <ChangelogEntry changeType="bug" text="Fix context menu items." />
          <ChangelogEntry changeType="bug" text="Fix controls popup." />
          <ChangelogEntry changeType="bug" text="Fix 'Set Keyboard Shortcuts' button on options page." issueNumber={138} />
          <ChangelogEntry changeType="bug" text="Limit browser action icon update rate to prevent flashing on Firefox." issueNumber={139} />
        </ChangelogVersion>

        <ChangelogVersion version="3.0.0">
          <ChangelogEntry changeType="feature" text="Complete extension re-write." />
          <ChangelogEntry changeType="feature" text="Added support for Firefox." />
        </ChangelogVersion>

        <ChangelogVersion version="2.4.1">
          <ChangelogEntry changeType="bug" text="Fixed name of extension." />
        </ChangelogVersion>

        <ChangelogVersion version="2.4.0">
          <ChangelogEntry changeType="feature" text="Added external message handling." />
        </ChangelogVersion>

        <ChangelogVersion version="2.3.0">
          <ChangelogEntry changeType="enhancement" text="Added Skip Forward and Skip Backward to extension keyboard shortcuts." issueNumber={126} />
        </ChangelogVersion>

        <ChangelogVersion version="2.2.0">
          <ChangelogEntry changeType="enhancement" text="Improving media controls overlay updating." />
        </ChangelogVersion>

        <ChangelogVersion version="2.1.0">
          <ChangelogEntry changeType="enhancement" text="Do not show media overlay controls is video is not visible." />
          <ChangelogEntry changeType="bug" text="Fix Youtube channel page vidoes not being handled correctly." />
          <ChangelogEntry changeType="enhancement" text="Show snackbar message when attempting to use unsupported controller action." />
          <ChangelogEntry changeType="enhancement" text="Confirm before resetting settings to defaults." />
          <ChangelogEntry changeType="feature" text="Added support for HBO Go." issueNumber={26} />
        </ChangelogVersion>

        <ChangelogVersion version="2.0.0">
          <ChangelogEntry changeType="enhancement" text="Improved extension icon." issueNumber={67} />
          <ChangelogEntry changeType="feature" text="Added default playback speed option." issueNumber={123} />
          <ChangelogEntry changeType="feature" text="Added controls popup." issueNumber={101} />
          <ChangelogEntry changeType="enhancement" text="Updated content notifications to be slient." issueNumber={125} />
          <ChangelogEntry changeType="enhancement" text="Major re-work of extension." />
        </ChangelogVersion>

        <ChangelogVersion version="1.28.0">
          <ChangelogEntry changeType="enhancement" text="Added playback speed controls to Google Play Music." issueNumber={122} />
          <ChangelogEntry changeType="bug" text="Fix incorrect artwork from displaying for Pandora notification." />
        </ChangelogVersion>

        <ChangelogVersion version="1.27.0">
          <ChangelogEntry changeType="enhancement" text="Added play/pause control to generic media overlay." issueNumber={120} />
          <ChangelogEntry changeType="enhancement" text="Added skip backward/forward controls to generic media overlay." issueNumber={121} />
        </ChangelogVersion>

        <ChangelogVersion version="1.26.0">
          <ChangelogEntry changeType="bug" text="Update loop media overlay control when video is set to loop externally." issueNumber={100} />
          <ChangelogEntry changeType="bug" text="Corrected mouse movement behavior related to media controls overlay." />
          <ChangelogEntry changeType="enhancement" text="Display keyboard shortcuts in media overlay tooltips." issueNumber={96} />
          <ChangelogEntry changeType="enhancement" text="Added fullscreen control to media overlay." issueNumber={110} />
          <ChangelogEntry changeType="enhancement" text="Dynamically determine icon color for generic media controller." issueNumber={117} />
        </ChangelogVersion>

        <ChangelogVersion version="1.25.0">
          <ChangelogEntry changeType="enhancement" text="Added support for more complex keyboard shortcuts." issueNumber={[ 113, 115 ]} />
          <ChangelogEntry changeType="enhancement" text="Added ability to hide certain media overlay controls." issueNumber={116} />
          <ChangelogEntry changeType="bug" text="Prevent changelog from opening on Chrome update." issueNumber={111} />
          <ChangelogEntry changeType="bug" text="Fix Pandora track name notification duplication when track name is displaying as marquee." issueNumber={112} />
        </ChangelogVersion>

        <ChangelogVersion version="1.24.0">
          <ChangelogEntry changeType="bug" text="Reverted 'Reverted changes to SpotifyController.'" issueNumber={106} />
        </ChangelogVersion>

        <ChangelogVersion version="1.23.0">
          <ChangelogEntry changeType="bug" text="Reverted changes to SpotifyController." issueNumber={108} />
        </ChangelogVersion>

        <ChangelogVersion version="1.22.0">
          <ChangelogEntry changeType="bug" text="Updated SpotifyController for new Spotify web UI." issueNumber={106} />
        </ChangelogVersion>

        <ChangelogVersion version="1.21.0">
          <ChangelogEntry changeType="bug" text="Updated PandoraController for new Pandora layout." />
        </ChangelogVersion>

        <ChangelogVersion version="1.20.0">
          <ChangelogEntry changeType="feature" text="Added option to hide controls when mouse is idle for a certain amount of time." issueNumber={102} />
          <ChangelogEntry changeType="enhancement" text="Track name is now copied with link for Spotify." issueNumber={98} />
        </ChangelogVersion>

        <ChangelogVersion version="1.19.0">
          <ChangelogEntry changeType="enhancement" text="Opening link to Spotify song will browse to the song's album in existing tab if configured." issueNumber={84} />
          <ChangelogEntry changeType="bug" text="Fixed loop media control not updating on video change." issueNumber={90} />
          <ChangelogEntry changeType="bug" text="Fixed Hulu new content notifications showing wrong thumbnail." />
          <ChangelogEntry changeType="bug" text="Fixed error occuring when a new content notification could not be shown due to invalid thumbnail image." />
          <ChangelogEntry changeType="enhancement" text="Updated to use ES6 style class declarations." issueNumber={89} />
          <ChangelogEntry changeType="enhancement" text="New content notifications now replace the previous new content notification if triggered in succession." />
          <ChangelogEntry changeType="feature" text="Added the ability to copy a link to the currently playing media." issueNumber={88} image={{ src: copyMediaLinkShortcut, alt: 'Copy Media Link Keyboard Shortcut' }} />
        </ChangelogVersion>

        <ChangelogVersion version="1.18.0">
          <ChangelogEntry changeType="feature" text="Added ability to open new content in existing tabs." issueNumber={84} image={{ src: openInExisting, alt: 'Open in Existing' }} />
          <ChangelogEntry text="Added initialization function back to controllers." issueNumber={63} />
          <ChangelogEntry changeType="bug" text="Media controls are now no longer shown for hidden media elements." issueNumber={[ 75, 87 ]} />
          <ChangelogEntry changeType="enhancement" text="Media controls are now constrained within the media element." issueNumber={85} />
          <ChangelogEntry changeType="enhancement" text="Updated the media controls reset keyboard shortcut to re-add the controls if they've been removed and re-position the controls back to the top-left of the media." issueNumber={83} />
          <ChangelogEntry changeType="enhancement" text="Added pause button to new content notifications." issueNumber={81} image={{ src: notificationPause, alt: 'Notification Pause' }} />
          <ChangelogEntry text="Added event handlers for event page." issueNumber={80} />
          <ChangelogEntry changeType="bug" text="Fixed errors caused by trying to create duplicate context menus." issueNumber={79} />
          <ChangelogEntry changeType="bug" text="Fixed media controls being too large on Youtube." issueNumber={82} />
        </ChangelogVersion>

        <ChangelogVersion version="1.17.0">
          <ChangelogEntry text="Removed unused popup code." />
          <ChangelogEntry changeType="bug" text="Fixed media controls background being squished." issueNumber={77} />
          <ChangelogEntry changeType="bug" text="Fixed controls being added after controller is disconnected." />
          <ChangelogEntry changeType="bug" text="Fixed keyboard shortcuts being intercepted by Hulu search." issueNumber={76} />
          <ChangelogEntry changeType="bug" text="Fixed Amazon Music new content showing as 'loading...'." issueNumber={78} />
          <ChangelogEntry changeType="bug" text="Added Amazon Music CDN." />
          <ChangelogEntry text="Cleaned up code." />
          <ChangelogEntry text="Removed unused popup HTML/css." />
          <ChangelogEntry changeType="enhancement" text="Much faster/slower speed playback controls are no longer locked to increments of 0.5." issueNumber={73} />
          <ChangelogEntry changeType="enhancement" text="The new content provider tab opened from clicking the browser action is now focused on opening." issueNumber={74} />
        </ChangelogVersion>

        <ChangelogVersion version="1.16.0">
          <ChangelogEntry changeType="enhancement" text="Clicking on the body of any notification will bring that content provider's tab to the front." issueNumber={72} />
          <ChangelogEntry changeType={[ 'bug', 'enhancement' ]} text="Minor rework of media detection." issueNumber={71} />
          <ChangelogEntry changeType={[ 'bug', 'enhancement' ]} text="Re-worked the display of the media controls overlay." issueNumber={[ 69, 70 ]} />
        </ChangelogVersion>

        <ChangelogVersion version="1.15.1">
          <ChangelogEntry changeType="enhancement" text="Playback speed is now persisted on a per-site, per-tab basis." issueNumber={61} />
        </ChangelogVersion>

        <ChangelogVersion version="1.15.0">
          <ChangelogEntry changeType="bug" text="Fixed issue where Spotify would display new content notifications when hovering over song title." />
          <ChangelogEntry changeType="enhancement" text="Site blacklist now checks against the content source as well as current page URL." issueNumber={[ 33, 49 ]} />
          <ChangelogEntry changeType="bug" text="Fixed issue where newly-added media elements were not being detected." />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://www.twitch.tv">Twitch</a>.</>} issueNumber={41} />
          <ChangelogEntry text="Unified settings retrieval/handling in background procress." />
          <ChangelogEntry changeType="enhancement" text="Added ability to reset all settings to defaults from options page." issueNumber={59} />
          <ChangelogEntry changeType="feature" text="Controller colors are now customizable." issueNumber={44} image={{ src: customizeControllerColor, alt: 'Customize Controller Color' }} />
          <ChangelogEntry changeType="feature" text="Added the ability to loop content for media controllers." issueNumber={38} image={{ src: loopMedia, alt: 'Loop Media' }} />
          <ChangelogEntry changeType="feature" text="Added the ability to enable/disable individual controllers." issueNumber={19} image={{ src: enableDisableControllers, alt: 'Enable/Disable Controllers' }} />
          <ChangelogEntry text="Generalized options popup greatly to help ease new controller addition." issueNumber={28} />
          <ChangelogEntry text="Improved status polling for media controllers." issueNumber={57} />
          <ChangelogEntry text="Centralized handling of settings loading/change handling in controllers." />
          <ChangelogEntry changeType="enhancement" text="Improved and unified audio/video element recognition in webpage." issueNumber={50} />
          <ChangelogEntry changeType="bug" text="Fixed new content not showing notification when the same content was repeated." />
          <ChangelogEntry text="Performed a massive re-organization of extension file structure to move everything out from a single directory." />
          <ChangelogEntry changeType="bug" text="Fixed spamming console with erros on extension reload." issueNumber={58} />
        </ChangelogVersion>

        <ChangelogVersion version="1.14.0">
          <ChangelogEntry changeType="enhancement" text="Added descriptive change labels to change log." issueNumber={54} />
          <ChangelogEntry changeType="feature" text="Added site blacklist option to prevent controlling generic media on certain sites." issueNumber={49} image={{ src: blacklistOption, alt: 'Site Blacklist Option' }} />
          <ChangelogEntry changeType="enhancement" text="Added ability to remove media controls." issueNumber={56} image={{ src: removeMediaControls, alt: 'Media Controls are Removable' }} />
          <ChangelogEntry changeType="enhancement" text="Made media controls draggable." issueNumber={55} image={{ src: mediaControlsDraggable, alt: 'Media Controls are Draggable' }} />
          <ChangelogEntry changeType="bug" text="Fixed pause on inactivity option label" issueNumber={52} />
          <ChangelogEntry changeType="bug" text="Fixed media controls not appearing on Netflix" issueNumber={53} />
          <ChangelogEntry text="Updated default install/update settings." />
        </ChangelogVersion>

        <ChangelogVersion version="1.13.0">
          <ChangelogEntry changeType="feature" text="Added option to disable auto-pause on a per-tab basis through browser action context menu." issueNumber={37} image={{ src: disableAutoPauseForTab, alt: 'Disable Auto-Pause for Tab' }} />
          <ChangelogEntry changeType="enhancement" text="Added option to disable showing auto-paused content notification." image={{ src: autoPausedNotificationOption, alt: 'Auto-Paused Notification Option' }} />
          <ChangelogEntry changeType="feature" text="Added notifications to display when content is auto-paused. Notifications include a prompt to disable auto-pause for that content's tab." issueNumber={37} image={{ src: autoPausedNotification, alt: 'Auto-Paused Notification' }} />
          <ChangelogEntry changeType="enhancement" text="Made showing change log on update configurable." image={{ src: showChangeLogOnUpdate, alt: 'Show Change Log on Update' }} />
          <ChangelogEntry changeType="bug" text="Fixed playback speed control icons not loading correctly on some computers." issueNumber={43} />
          <ChangelogEntry text="Abstracted content scripts in manifest.json to make adding new controllers/scripts easier." />
          <ChangelogEntry changeType="bug" text="Fixed issue where keyboard shortcuts were being handled multiple times after opening multiple videos on Youtube." issueNumber={51} />
          <ChangelogEntry changeType="bug" text="Fixed playback controls not working when Netflix was full-screened." issueNumber={48} />
        </ChangelogVersion>

        <ChangelogVersion version="1.12.0">
          <ChangelogEntry changeType="enhancement" text="Added button to options page to view change log." />
          <ChangelogEntry changeType="enhancement" text="Added images to change log." issueNumber={42} />
        </ChangelogVersion>

        <ChangelogVersion version="1.11.0">
          <ChangelogEntry changeType="feature" text="Created this change log." issueNumber={42} />
          <ChangelogEntry changeType="bug" text="Fixed embedded Youtube videos not being recognized." />
          <ChangelogEntry changeType="bug" text="Fixed playback speed controls displaying badly on full-screened video." issueNumber={46} />
          <ChangelogEntry changeType="bug" text="Fixed how playback speed controls looked on generic sites." issueNumber={45} />
          <ChangelogEntry changeType="bug" text="Fixed issue with pausing Youtube videos in newly-opened tabs before video had auto-played." issueNumber={32} />
        </ChangelogVersion>

        <ChangelogVersion version="1.10.0">
          <ChangelogEntry changeType="feature" text="Added ability to disable pausing of currently playing content when new content starts playing." issueNumber={37} image={{ src: disableAutoPause, alt: 'Disable Auto-Pause' }} />
          <ChangelogEntry changeType="enhancement" text="Improved how default settings are set upon install/update." issueNumber={40} />
          <ChangelogEntry changeType="enhancement" text="Made the playback speed controls easier to see." issueNumber={39} />
        </ChangelogVersion>

        <ChangelogVersion version="1.9.1">
          <ChangelogEntry changeType="bug" text="Fixed an issue where multiple playback speed controls were being appended to the document." />
        </ChangelogVersion>

        <ChangelogVersion version="1.9.0">
          <ChangelogEntry changeType="enhancement" text="Added a configurable option to change how long content change notifications last." issueNumber={36} image={{ src: notificationLength, alt: 'Notification Length' }} />
          <ChangelogEntry changeType="feature" text="Added rudimentary volume controls. (Currently only supports HTML content providers.)" issueNumber={30} />
          <ChangelogEntry text="Code clean up regarding extended Controllers and unsupported functions." />
        </ChangelogVersion>

        <ChangelogVersion version="1.8.0">
          <ChangelogEntry changeType="feature" text="Added initial implementation of playback speed controls. (Only supports HTML content providers.)" issueNumber={29} image={[ { src: playbackSpeedControls, alt: 'Playback Speed Controls' }, { src: playbackSpeedControlsOptions, alt: 'Playback Speed Controls Options' } ]} />
          <ChangelogEntry changeType="bug" text="Fixed Hulu notification option not staying selected." issueNumber={31} />
          <ChangelogEntry text="Updated README.md to link to extension in Chrome Web Store." />
        </ChangelogVersion>

        <ChangelogVersion version="1.7.0">
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="http://www.hulu.com/">Hulu</a>.</>} issueNumber={27} />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://www.amazon.com/gp/video/getstarted/">Amazon Video</a>.</>} issueNumber={24} />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://music.amazon.com/">Amazon Music</a>.</>} issueNumber={24} />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://www.netflix.com/">Netflix</a>.</>} issueNumber={23} />
        </ChangelogVersion>

        <ChangelogVersion version="1.6.0">
          <ChangelogEntry text="Updated promotional materials." />
          <ChangelogEntry changeType="bug" text="Fixed issue where notifications for Youtube would not have a thumbnail." />
          <ChangelogEntry changeType="bug" text="A notification is now shown when the same content is played again." issueNumber={6} />
          <ChangelogEntry text="Now only retrieve tab/frame name when content is found." issueNumber={16} />
          <ChangelogEntry changeType="enhancement" text="Reformatted notifications table in options page." issueNumber={18} image={{ src: reformattedNotificationSettings, alt: 'Reformatted Notification SettingKey' }} />
          <ChangelogEntry changeType="feature" text="Add ability to support generic HTML audio and video elements on any webpage." issueNumber={[ 8, 16, 22 ]} />
          <ChangelogEntry changeType="bug" text="Fixed issue where focus/blur was being handled multiple times on the same page." issueNumber={12} />
          <ChangelogEntry changeType="enhancement" text="Added a more reliable way to check if a controller is playing in the active tab." issueNumber={12} />
          <ChangelogEntry text="Prevent locking due to inactivity on Youtube." issueNumber={20} />
          <ChangelogEntry changeType="bug" text="Fixed Youtube not recognizing that a new Youtube video was opened." issueNumber={21} />
        </ChangelogVersion>

        <ChangelogVersion version="1.5.0">
          <ChangelogEntry changeType="bug" text="Fixed new controls and generalized YoutubeController." issueNumber={16} />
          <ChangelogEntry text="Added link to create an Github issue from the options page." issueNumber={3} />
          <ChangelogEntry changeType="bug" text="Added Pandora CDN to permissions." issueNumber={13} />
          <ChangelogEntry text="Added more controls and keyboard shortcuts for each." issueNumber={1} image={{ src: keyboardShortcuts, alt: 'Keyboard Shortcuts' }} />
          <ChangelogEntry changeType="enhancement" text="Added a way to open the Chrome keyboard shortcuts from the options page." />
        </ChangelogVersion>

        <ChangelogVersion version="1.4.0">
          <ChangelogEntry changeType="enhancement" text="When the currently playing content is closed, the last-playing content is made the current content." issueNumber={11} />
        </ChangelogVersion>

        <ChangelogVersion version="1.3.0">
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://bandcamp.com/">Bandcamp</a>.</>} issueNumber={9} />
        </ChangelogVersion>

        <ChangelogVersion version="1.2.0">
          <ChangelogEntry changeType="enhancement" text="Added option to not show notifications for the active content tab." issueNumber={4} image={{ src: noActiveNotification, alt: 'No Active Notification' }} />
        </ChangelogVersion>

        <ChangelogVersion version="1.1.2">
          <ChangelogEntry changeType="bug" text="Fixed check in checkboxes on options page not displaying when checked." issueNumber={7} />
        </ChangelogVersion>

        <ChangelogVersion version="1.1.1">
          <ChangelogEntry changeType="bug" text={<>Fixed issue with Google Play Music not being recognized by <i>some</i> people.</>} />
          <ChangelogEntry changeType="enhancement" text="Content change notifications now display artwork." issueNumber={2} />
          <ChangelogEntry changeType="enhancement" text="Added 'Next' button to content change notification." issueNumber={5} image={{ src: notificationNext, alt: 'Notification Next' }} />
          <ChangelogEntry changeType="feature" text="Initial addition of more content controls: Previous, Next, Like, Unlike, Dislike, Undislike. (Support for various controls depends on the content provider.)" issueNumber={1} />
        </ChangelogVersion>

        <ChangelogVersion version="1.1.0">
          <ChangelogEntry changeType="feature" text="Added option to pause content when the computer is locked or after a set period of inactivity." image={{ src: pauseLockInactivity, alt: 'Pause on Lock/Inactivity' }} />
        </ChangelogVersion>

        <ChangelogVersion version="1.0.0">
          <ChangelogEntry text={<>Uploaded to <a href="https://chrome.google.com/webstore/detail/easy-control/oanebiaiakkpfipgnkpmcpkjfnclbgfi">Chrome Web Store</a>.</>} />
          <ChangelogEntry text="Created promotional images." />
          <ChangelogEntry text="Updated options page to use include jQuery instead of CDN." />
          <ChangelogEntry changeType="feature" text="Added 'Default Site' option. Clicking the browser action when no content is playing will open the default site in a new tab." image={{ src: defaultSite, alt: 'Default Site' }} />
          <ChangelogEntry text="Renamed extension to 'Easy Control'." />
          <ChangelogEntry text="Created README.md." />
          <ChangelogEntry changeType="feature" text="Added options page." />
          <ChangelogEntry changeType="enhancement" text="Added better icon." image={{ src: icon, alt: 'Easy Control' }} />
          <ChangelogEntry changeType="bug" text="Fixed issue with notifications only showing up the first time." />
          <ChangelogEntry changeType="bug" text="Fixed artist name issue with Pandora." />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://play.google.com/music/">Google Play Music</a>.</>} />
          <ChangelogEntry text="Added notifications on content change." image={{ src: notification, alt: 'Notification' }} />
          <ChangelogEntry changeType="feature" text="Added keyboard shortcut to pause/play content." />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://www.youtube.com/">Youtube</a>.</>} />
          <ChangelogEntry text="Code cleanup." />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="https://play.spotify.com/">Spotify</a>.</>} />
          <ChangelogEntry changeType="feature" text={<>Added support for <a href="http://www.pandora.com/">Pandora</a>.</>} />
        </ChangelogVersion>

      </Box>
    </Box>
  );
};
