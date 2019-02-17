import { ContentInfo } from "./content";

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
}

type AllMessageTypes = ( MessageTypes.ToBackground | MessageTypes.FromBackground );

interface BaseMessage<T extends AllMessageTypes>
{
  type: T;
}

interface FromBackgroundMessage extends BaseMessage<
  MessageTypes.FromBackground.Pause |
  MessageTypes.FromBackground.Play |
  MessageTypes.FromBackground.Next |
  MessageTypes.FromBackground.Previous |
  MessageTypes.FromBackground.Like |
  MessageTypes.FromBackground.Unlike |
  MessageTypes.FromBackground.Dislike |
  MessageTypes.FromBackground.Undislike |
  MessageTypes.FromBackground.VolumeUp |
  MessageTypes.FromBackground.VolumeDown
  > { }

interface DataMessage<T extends AllMessageTypes, D> extends BaseMessage<T>
{
  data: D;
}

type OpenContentLinkData = string;

interface InitializeData
{
  color: string;
  allowPauseOnInactivity: boolean;
  hostname: string;
}

type NewContentData = ContentInfo;

interface StatusData
{
  paused: boolean;
  progress: number;
  active: boolean;
}

type OpenContentLinkMessage = DataMessage<MessageTypes.FromBackground.OpenContentLink, OpenContentLinkData>;
type InitializeMessage = DataMessage<MessageTypes.ToBackground.Initialize, InitializeData>;
type NewContentMessage = DataMessage<MessageTypes.ToBackground.NewContent, NewContentData>;
type StatusMessage = DataMessage<MessageTypes.ToBackground.Status, StatusData>;

export type Message = (
  FromBackgroundMessage |
  OpenContentLinkMessage |
  InitializeMessage |
  NewContentMessage |
  StatusMessage
);

export const fromBackgroundMessage = ( type: MessageTypes.FromBackground ): FromBackgroundMessage => ( {
  type: MessageTypes.FromBackground.Play
} );

export const openContentLinkMessage = ( data: OpenContentLinkData ): OpenContentLinkMessage => ( {
  type: MessageTypes.FromBackground.OpenContentLink,
  data
} );

export const initializeMessage = ( data: InitializeData ): InitializeMessage => ( {
  type: MessageTypes.ToBackground.Initialize,
  data
} );

export const newContentMessage = ( data: NewContentData ): NewContentMessage => ( {
  type: MessageTypes.ToBackground.NewContent,
  data
} );

export const statusMessage = ( data: StatusData ): StatusMessage => ( {
  type: MessageTypes.ToBackground.Status,
  data
} );
