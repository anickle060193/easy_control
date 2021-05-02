import { ControllerMedia, ControllerStatus } from './controllers';

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
  status: ControllerStatus
  media: ControllerMedia;
}

export type ContentMessage = (
  UpdateContentMessage
);
