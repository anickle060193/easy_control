import Controller from './controller';

import { controller as pandoraController } from './controllers/pandora';
import { controller as youtubeController } from './controllers/youtube';
import { controller as spotifyController } from './controllers/spotify';

type UrlMatch = string | RegExp | UrlMatch[];

interface ControllerConfig
{
  label: string;
  matches: UrlMatch;
  controller: Controller;
}

const CONTROLLERS: ControllerConfig[] = [
  {
    label: 'Pandora',
    matches: /^https:\/\/www.pandora.com(\/.*)?$/i,
    controller: pandoraController,
  },
  {
    label: 'Youtube',
    matches: /^https:\/\/www.youtube.com(\/.*)?$/i,
    controller: youtubeController,
  },
  {
    label: 'Spotify',
    matches: /^https:\/\/[^.]+.spotify.com(\/.*)?$/i,
    controller: spotifyController,
  },
];

export default CONTROLLERS;
