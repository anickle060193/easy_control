import { initExtension } from './extension';
import { initContextMenus } from './contextMenus';
import { initCommands } from './commands';
import { initBrowserAction } from './browserAction';
import { initNotifications } from './notifications';
import { initIdle } from './idle';
import { initControlsPopup } from './controlsPopup';
import { initControllers } from './controllers';

initExtension();
initContextMenus();
initCommands();
initBrowserAction();
initNotifications();
initIdle();
initControlsPopup();
initControllers();
