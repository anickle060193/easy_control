import { ControllerId } from './controllers';
import storage from './storage';

type InternalSettingOnChangeEventHandlerCallback = ( changes: Record<string, unknown>, area: 'local' | 'sync' | 'managed' ) => void;

class SettingOnChangeEvent
{
  private readonly handlers = new WeakMap<() => void, InternalSettingOnChangeEventHandlerCallback>();

  public constructor(
    private readonly key: string
  )
  {
  }

  public addEventListener( callback: () => void ): void
  {
    const onChange: InternalSettingOnChangeEventHandlerCallback = ( changes, area ) =>
    {
      if( area === 'sync'
      && this.key in changes )
      {
        callback();
      }
    };

    this.handlers.set( callback, onChange );

    chrome.storage.onChanged.addListener( onChange );
  }

  public removeEventListener( callback: () => void ): void
  {
    const onChange = this.handlers.get( callback );
    if( onChange )
    {
      chrome.storage.onChanged.removeListener( onChange );
      this.handlers.delete( callback );
    }
  }
}

type Validator<T> = ( value: unknown ) => value is T;

const VALIDATORS = {
  boolean: ( value: unknown ): value is boolean => typeof value === 'boolean',
  number: ( value: unknown ): value is number => typeof value === 'number',
  string: ( value: unknown ): value is string => typeof value === 'string',
  bigint: ( value: unknown ): value is BigInt => typeof value === 'bigint',
  symbol: ( value: unknown ): value is symbol => typeof value === 'symbol',
  undefined: ( value: unknown ): value is undefined => typeof value === 'undefined',
  function: ( value: unknown ): value is ( () => void ) => typeof value === 'function',
  object: ( value: unknown ): value is Record<string, unknown> => typeof value === 'object',
};

const stringArrayValidator: Validator<string[]> = ( value ): value is string[] => Array.isArray( value ) && value.every( ( v ): v is string => typeof v === 'string' );

class SettingEntry<T>
{
  public readonly onChanged = new SettingOnChangeEvent( this.key );

  public constructor(
    private readonly key: string,
    private readonly defaultValue: T,
    private readonly validator: Validator<T> = VALIDATORS[ typeof defaultValue ] as Validator<T> )
  {
  }

  public async get(): Promise<T>
  {
    try
    {
      const value = await storage.get( 'sync', this.key );
      if( this.validator( value ) )
      {
        return value;
      }
      else
      {
        console.warn( 'Unexpected setting value type:', this.key, value );
      }
    }
    catch( e )
    {
      console.warn( 'Failed to get setting:', this.key, e );
    }

    return this.defaultValue;
  }

  public set( value: T ): Promise<void>
  {
    try
    {
      return storage.set( 'sync', this.key, value );
    }
    catch( e )
    {
      console.warn( 'Failed to set setting:', this.key, value, e );
    }

    return Promise.resolve();
  }
}

function createControllerSettings( controller: ControllerId )
{
  return {
    enabled: new SettingEntry( `settings.${controller}.enabled`, true ),
    notificationsEnabled: new SettingEntry( `settings.${controller}.notificationsEnabled`, false ),
  };
}

const CONTROLLER_SETTINGS: { [ key in ControllerId ]: ReturnType<typeof createControllerSettings> } = {
  [ ControllerId.Pandora ]: createControllerSettings( ControllerId.Pandora ),
  [ ControllerId.Youtube ]: createControllerSettings( ControllerId.Youtube ),
  [ ControllerId.Spotify ]: createControllerSettings( ControllerId.Spotify ),
};

export const settings = {
  controllers: CONTROLLER_SETTINGS,
  others: {
    notificationsEnabled: new SettingEntry( 'settings.others.notificationsEnabled', false ),
    noActiveWindowNotifications: new SettingEntry( 'settings.others.noActiveWindowNotifications', true ),
    pauseOnLock: new SettingEntry( 'settings.others.pauseOnLock', false ),
    pauseOnInactivity: new SettingEntry( 'settings.others.pauseOnInactivity', false ),
    inactivityTimeout: new SettingEntry( 'settings.others.inactivityTimeout', 60 * 5 ),
    autoPauseEnabled: new SettingEntry( 'settings.others.autoPauseEnabled', true ),
    showChangelogOnUpdate: new SettingEntry( 'settings.others.showChangelogOnUpdate', true ),
    siteBlacklist: new SettingEntry( 'settings.others.siteBlacklist', [], stringArrayValidator ),
  },
};
