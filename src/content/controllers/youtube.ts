import Controller from '../controller';

export const controller = new Controller();

controller.mediaSelector = 'video';
controller.useMediaForIsPlaying = true;

controller.useMediaForPlay = true;
controller.useMediaForPause = true;

controller.useDocumentMediaEventsForPolling = true;
