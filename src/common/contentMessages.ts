import { ControllerCapabilities, ControllerMedia, ControllerStatus } from './controllers';

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
  status: Readonly<ControllerStatus>;
  mediaChangedIndication: Readonly<string | null>;
  media: Readonly<ControllerMedia>;
  capabilities: Readonly<ControllerCapabilities>;
}

export type ContentMessage = (
  UpdateContentMessage
);
