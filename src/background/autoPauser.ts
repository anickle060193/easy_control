const autoPauseDisabledTabs = new Set<number>();

export function setAutoPauseEnabledForTab( tabId: number, enabled: boolean )
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

export function isAutoPauseEnabledForTab( tabId: number )
{
  return !autoPauseDisabledTabs.has( tabId );
}
