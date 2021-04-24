export enum BackgroundMessageId
{
  Pause = 'background_message_id__pause',
}

export interface BaseBackgroundMessage<T extends BackgroundMessageId>
{
  id: T;
}

export type BackgroundMessage = (
  BaseBackgroundMessage<BackgroundMessageId.Pause>
);
