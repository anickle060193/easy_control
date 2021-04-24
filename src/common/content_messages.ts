export enum ContentMessageId
{
  Update = 'content_message_id__update',
}

export interface BaseContentMessage<T extends ContentMessageId>
{
  id: T;
}

export interface UpdateContentMessage extends BaseContentMessage<ContentMessageId.Update>
{
  playing: boolean;
}

export type ContentMessage = (
  UpdateContentMessage
);
