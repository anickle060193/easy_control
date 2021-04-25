import Controller from '../controller';

export const controller = new Controller( {
  mediaSelector: 'audio:last-of-type',

  playButtonSelector: 'button[data-qa="play_button"]',
  pauseButtonSelector: 'button[data-qa="pause_button"]',

  useMediaForIsPlaying: true,
  useMediaSessionForIsPlaying: false,
  usePlayButtonForPlaying: false,
  usePauseButtonForPlaying: false,

  usePlayButtonForPlay: true,
  useMediaForPlay: true,

  usePauseButtonForPause: true,
  useMediaForPause: true,

  useDocumentMediaEventsForPolling: true,
  useMediaForPolling: false,
  useMutationObserverForPolling: false,

  playerSelector: null,

  useMediaSessionForTrack: false,
  useMediaSessionForAlbum: false,
  useMediaSessionForArtist: false,
  useMediaSessionForArtwork: false,

  trackSelector: '.nowPlayingTopInfo__current__trackName',
  albumSelector: '.nowPlayingTopInfo__current__albumName',
  artistSelector: '.NowPlayingTopInfo__current__artistName',
  artworkSelector: 'img.NowPlayinfTopInfo__artContainer__img',

  useMediaForTime: true,

  currentTimeSelector: null,
  remainingTimeSelector: null,
  durationSelector: null,

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,
} );
