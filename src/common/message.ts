import { ContentInfo } from 'common/content';

export namespace MessageTypes
{
  export const enum ToBackground
  {
    Initialize = 'to_background.initialize',
    NewContent = 'to_background.new_content',
    Status = 'to_background.status'
  }

  export const enum FromBackground
  {
    Pause = 'from_background.pause',
    Play = 'from_background.play',
    Next = 'from_background.next',
    Previous = 'from_background.previous',
    Like = 'from_background.like',
    Unlike = 'from_background.unlike',
    Dislike = 'from_background.dislike',
    Undislike = 'from_background.undislike',
    VolumeUp = 'from_background.volume_up',
    VolumeDown = 'from_background.volume_down',
    OpenContentLink = 'from_background.open_content_link'
  }

  export const enum ToControlsPopup
  {
    Update = 'to_controls_popup.update',
  }

  export const enum FromControlsPopup
  {
    Pause = 'from_controls_popup.pause',
    Play = 'from_controls_popup.play',
    Next = 'from_controls_popup.next',
    Previous = 'from_controls_popup.previous',
    Like = 'from_controls_popup.like',
    Unlike = 'from_controls_popup.unlike',
    Dislike = 'from_controls_popup.dislike',
    Undislike = 'from_controls_popup.undislike',
    VolumeUp = 'from_controls_popup.volume_up',
    VolumeDown = 'from_controls_popup.volume_down',
  }
}

type AllMessageTypes = (
  MessageTypes.ToBackground |
  MessageTypes.FromBackground |
  MessageTypes.ToControlsPopup |
  MessageTypes.FromControlsPopup
);

interface BaseMessage<T extends AllMessageTypes>
{
  type: T;
}

type BasicMessageType = (
  MessageTypes.FromBackground.Pause |
  MessageTypes.FromBackground.Play |
  MessageTypes.FromBackground.Next |
  MessageTypes.FromBackground.Previous |
  MessageTypes.FromBackground.Like |
  MessageTypes.FromBackground.Unlike |
  MessageTypes.FromBackground.Dislike |
  MessageTypes.FromBackground.Undislike |
  MessageTypes.FromBackground.VolumeUp |
  MessageTypes.FromBackground.VolumeDown |
  MessageTypes.FromControlsPopup.Pause |
  MessageTypes.FromControlsPopup.Play |
  MessageTypes.FromControlsPopup.Next |
  MessageTypes.FromControlsPopup.Previous |
  MessageTypes.FromControlsPopup.Like |
  MessageTypes.FromControlsPopup.Unlike |
  MessageTypes.FromControlsPopup.Dislike |
  MessageTypes.FromControlsPopup.Undislike |
  MessageTypes.FromControlsPopup.VolumeUp |
  MessageTypes.FromControlsPopup.VolumeDown
);

interface BasicMessage extends BaseMessage<BasicMessageType> { }

interface DataMessage<T extends AllMessageTypes, D> extends BaseMessage<T>
{
  data: D;
}

type OpenContentLinkData = string;

export interface SupportedOperations
{
  playPause?: boolean;
  previous?: boolean;
  next?: boolean;
  like?: boolean;
  dislike?: boolean;
  volumeUp?: boolean;
  volumeDown?: boolean;
}

export interface ControllerInitializeData
{
  color: string;
  allowPauseOnInactivity: boolean;
  hostname: string | null;
  supportedOperations: SupportedOperations;
}

export type NewContentData = ContentInfo;

export interface StatusData
{
  paused: boolean;
  progress: number;
  active: boolean;
  isLiked: boolean;
  isDisliked: boolean;
}

export interface ControlsPopupUpdateData
{
  color: string;
  supportedOperations: SupportedOperations;
  status: StatusData;
  content: ContentInfo | null;
}

type OpenContentLinkMessage = DataMessage<MessageTypes.FromBackground.OpenContentLink, OpenContentLinkData>;
type ControllerInitializeMessage = DataMessage<MessageTypes.ToBackground.Initialize, ControllerInitializeData>;
type NewContentMessage = DataMessage<MessageTypes.ToBackground.NewContent, NewContentData>;
type StatusMessage = DataMessage<MessageTypes.ToBackground.Status, StatusData>;
type ControlsPopupUpdateMessage = DataMessage<MessageTypes.ToControlsPopup.Update, ControlsPopupUpdateData | null>;

export type Message = (
  BasicMessage |
  OpenContentLinkMessage |
  ControllerInitializeMessage |
  NewContentMessage |
  StatusMessage |
  ControlsPopupUpdateMessage
);

export const createBasicMessage = ( type: BasicMessageType ): BasicMessage => ( {
  type: type
} );

export const createOpenContentLinkMessage = ( data: OpenContentLinkData ): OpenContentLinkMessage => ( {
  type: MessageTypes.FromBackground.OpenContentLink,
  data
} );

export const createControllerInitializeMessage = ( data: ControllerInitializeData ): ControllerInitializeMessage => ( {
  type: MessageTypes.ToBackground.Initialize,
  data
} );

export const createNewContentMessage = ( data: NewContentData ): NewContentMessage => ( {
  type: MessageTypes.ToBackground.NewContent,
  data
} );

export const createStatusMessage = ( data: StatusData ): StatusMessage => ( {
  type: MessageTypes.ToBackground.Status,
  data
} );

export const createControlsPopupUpdateMessage = ( data: ControlsPopupUpdateData | null ) => ( {
  type: MessageTypes.ToControlsPopup.Update,
  data
} );
