import Controller from '../controller';

export const controller = new Controller( {
  mediaSelector: 'video',

  playButtonSelector: null,
  pauseButtonSelector: null,

  useMediaForIsPlaying: true,
  useMediaSessionForIsPlaying: true,
  usePlayButtonForPlaying: false,
  usePauseButtonForPlaying: false,

  usePlayButtonForPlay: false,
  useMediaForPlay: true,

  usePauseButtonForPause: false,
  useMediaForPause: true,

  useDocumentMediaEventsForPolling: true,
  useMediaForPolling: false,
  useMutationObserverForPolling: false,

  playerSelector: null,

  useMediaSessionForTrack: true,
  useMediaSessionForAlbum: false,
  useMediaSessionForArtist: true,
  useMediaSessionForArtwork: true,

  trackSelector: '#info-contents h1.title',
  albumSelector: null,
  artistSelector: '#primary #channel-name a',
  artworkSelector: '#meta-contents #avatar img',

  useMediaForTime: true,

  currentTimeSelector: null,
  remainingTimeSelector: null,
  durationSelector: null,

  currentTimeFormat: null,
  remainingTimeFormat: null,
  durationFormat: null,
} );
