import { initExtension } from './extension';
import { initBrowserAction } from './browserAction';
import { initCommands } from './commands';
import { initContextMenus } from './contextMenus';
import { initControllers } from './controllers';
import { initControlsPopup } from './controlsPopup';
import { initExternal } from './external';
import { initIdle } from './idle';
import { initNotifications } from './notifications';

void ( async () =>
{
  initExtension();

  initBrowserAction();
  initCommands();
  await initContextMenus();
  initControllers();
  initControlsPopup();
  initExternal();
  initIdle();
  initNotifications();
} )();
