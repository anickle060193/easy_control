const autoPauseDisabledTabs = new Set<number>();

export function setAutoPauseEnabledForTab( tabId: number, enabled: boolean ): void
{
  if( enabled )
  {
    autoPauseDisabledTabs.delete( tabId );
  }
  else
  {
    autoPauseDisabledTabs.add( tabId );
  }
}

export function isAutoPauseEnabledForTab( tabId: number ): boolean
{
  return !autoPauseDisabledTabs.has( tabId );
}
