import Controller from './controller';

import { controller as pandoraController } from './controllers/pandora';
import { controller as youtubeController } from './controllers/youtube';
import { controller as spotifyController } from './controllers/spotify';

import { ControllerId } from '../common/controllers';

type UrlMatch = string | RegExp | UrlMatch[];

interface ControllerConfig
{
  matches: UrlMatch;
  controller: Controller;
}

export const CONTROLLERS_CONFIG: { [ key in ControllerId ]: ControllerConfig } = {
  [ ControllerId.Pandora ]: {
    matches: /^https:\/\/www.pandora.com(\/.*)?$/i,
    controller: pandoraController,
  },
  [ ControllerId.Youtube ]: {
    matches: /^https:\/\/www.youtube.com(\/.*)?$/i,
    controller: youtubeController,
  },
  [ ControllerId.Spotify ]: {
    matches: /^https:\/\/[^.]+.spotify.com(\/.*)?$/i,
    controller: spotifyController,
  },
};
