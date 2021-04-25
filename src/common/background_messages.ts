export enum BackgroundMessageId
{
  PlayPause = 'background_message_id__play_pause',
  Play = 'background_message_id__play',
  Pause = 'background_message_id__pause',
  Next = 'background_message_id__next',
  Previous = 'background_message_id__previous',
  SkipBackward = 'background_message_id__skip_backward',
  SkipForward = 'background_message_id__skip_foward',
  Like = 'background_message_id__like',
  Unlike = 'background_message_id__unlike',
  Dislike = 'background_message_id__dislike',
  Undislike = 'background_message_id__undislike',
  VolumeUp = 'background_message_id__volume_up',
  VolumeDown = 'background_message_id__volume_down',
}

export interface BaseBackgroundMessage<T extends BackgroundMessageId>
{
  id: T;
}

export type BackgroundMessage = (
  BaseBackgroundMessage<BackgroundMessageId>
);
