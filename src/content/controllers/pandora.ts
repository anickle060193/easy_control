import Controller from '../controller';

export const controller = new Controller( {
  mediaSelector: 'audio:last-of-type',

  playButtonSelector: 'button.Tuner__Control__Play__Button[data-qa="play_button"]',
  pauseButtonSelector: 'button.Tuner__Control__Play__Button[data-qa="pause_button"]',

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

  trackSelector: '.Tuner__Audio__TrackDetail__title',
  albumSelector: null,
  artistSelector: '.NowPlayingTopInfo__current__artistName',
  artworkSelector: '.Tuner__Audio__TrackDetail__img img',

  useMediaForTime: true,

  currentTimeSelector: null,
  remainingTimeSelector: null,
  durationSelector: null,

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,
} );
