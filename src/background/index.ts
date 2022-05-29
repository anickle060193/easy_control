import { initExtension } from './extension';
import { initBrowserAction } from './browserAction';
import { initCommands } from './commands';
import { initMenus } from './menus';
import { initControllers } from './controllers';
import { initControlsPopup } from './controlsPopup';
import { initExternal } from './external';
import { initIdle } from './idle';
import { initNotifications } from './notifications';

initExtension();

initBrowserAction();
initCommands();
initMenus();
initControllers();
initControlsPopup();
initExternal();
initIdle();
initNotifications();
