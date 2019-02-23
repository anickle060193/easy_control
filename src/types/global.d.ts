declare module 'easy_control'
{
  global
  {
    export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

    interface Clipboard
    {
      readText(): Promise<string>;
      writeText( newClipText: string ): Promise<void>;
    }

    interface NavigatorClipboard
    {
      readonly clipboard: Clipboard;
    }

    interface Navigator extends NavigatorClipboard { }
  }
}
