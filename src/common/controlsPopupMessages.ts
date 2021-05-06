import { ControllerCommand } from './controllers';

export enum ControlsPopupMessageId
{
  Command = 'controls_popup_message_id__command',
}

export interface BaseControlsPopupMessage<T extends ControlsPopupMessageId>
{
  id: T;
}

export interface CommandControlsPopupMessage extends BaseControlsPopupMessage<ControlsPopupMessageId.Command>
{
  command: ControllerCommand;
}

export type ControlsPopupMessage = (
  CommandControlsPopupMessage
);
