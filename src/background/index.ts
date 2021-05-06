import { initContextMenus } from './contextMenus';
import { initCommands } from './commands';
import { initBrowserAction } from './browserAction';
import { initIdle } from './idle';
import { initControllers } from './controllers';
import { initNotifications } from './notifications';
import { initControlsPopup } from './controlsPopup';

initContextMenus();
initCommands();
initBrowserAction();
initNotifications();
initIdle();
initControlsPopup();
initControllers();
