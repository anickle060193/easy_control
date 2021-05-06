import { ControllerCapabilities, ControllerCommand, ControllerMedia, ControllerStatus } from './controllers';

export enum BackgroundMessageId
{
  Command = 'background_message_id__command',
  Update = 'background_message_id__update',
}

export interface BaseBackgroundMessage<T extends BackgroundMessageId>
{
  id: T;
}

export interface CommandBackgroundMessage extends BaseBackgroundMessage<BackgroundMessageId.Command>
{
  command: ControllerCommand;
}

export interface UpdateBackgroundMessage extends BaseBackgroundMessage<BackgroundMessageId.Update>
{
  status: ControllerStatus;
  media: ControllerMedia;
  capabilities: ControllerCapabilities;
}

export type BackgroundMessage = (
  CommandBackgroundMessage |
  UpdateBackgroundMessage
);
