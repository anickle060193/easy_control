import Controller from './controller';

import { controller as pandoraController } from './controllers/pandora';
import { controller as youtubeController } from './controllers/youtube';
import { controller as spotifyController } from './controllers/spotify';

import { ControllerId } from '../common/controllers';

type UrlMatch = string | RegExp | UrlMatch[];

interface ControllerConfig
{
  label: string;
  matches: UrlMatch;
  controller: Controller;
}

const CONTROLLERS: { [ key in ControllerId ]: ControllerConfig } = {
  [ ControllerId.Pandora] : {
    label: 'Pandora',
    matches: /^https:\/\/www.pandora.com(\/.*)?$/i,
    controller: pandoraController,
  },
  [ ControllerId.Youtube] : {
    label: 'Youtube',
    matches: /^https:\/\/www.youtube.com(\/.*)?$/i,
    controller: youtubeController,
  },
  [ ControllerId.Spotify] : {
    label: 'Spotify',
    matches: /^https:\/\/[^.]+.spotify.com(\/.*)?$/i,
    controller: spotifyController,
  },
};

export default CONTROLLERS;
