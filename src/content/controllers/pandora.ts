import Controller from '../controller';

export const controller = new Controller();

controller.mediaSelector = 'audio:last-of-type';
controller.useMediaForIsPlaying = true;

controller.playButtonSelector = 'button[data-qa="play_button"]';
controller.pauseButtonSelector = 'button[data-qa="pause_button"]';

controller.useDocumentMediaEventsForPolling = true;
