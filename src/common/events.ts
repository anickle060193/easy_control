import * as $ from 'jquery';
import * as _ from 'lodash';

declare global
{
  interface JQueryStatic
  {
    event: {
      special: string[];
    }
  }
}

function createElementPollingEvent<T>( eventName: string, getData: ( this: HTMLElement ) => T, dataEqual: ( oldValue: T, newValue: T ) => boolean )
{
  if( typeof $[ eventName ] !== 'undefined'
    || typeof $.event.special[ eventName ] !== 'undefined' )
  {
    console.error( 'Event "' + eventName + '" already exists.' );
    return;
  }

  let elems: HTMLElement[] = [];
  let timeoutId: number = 0;

  function setup( this: HTMLElement )
  {
    elems.push( this );

    if( elems.length === 1 )
    {
      poll();
    }
  }

  function teardown( this: HTMLElement )
  {
    let elem = $( this );
    _.pull( elems, this );
    elem.removeData( eventName );

    if( elems.length === 0 )
    {
      window.clearInterval( timeoutId );
    }
  }

  function poll()
  {
    $.each( elems, function()
    {
      let elem = $( this );
      let data: T | undefined = elem.data( eventName );
      let newData: T = getData.call( this );

      if( typeof data !== 'undefined' )
      {
        if( !dataEqual.call( this, data, newData ) )
        {
          elem.data( eventName, newData );
          elem.trigger( eventName, [ newData ] );
        }
      }
      else
      {
        elem.data( eventName, newData );
        elem.trigger( eventName, [ newData ] );
      }
    } );

    if( elems.length > 0 )
    {
      timeoutId = window.setTimeout( poll, 100 );
    }
  }

  $.event.special[ eventName ] = {
    setup: setup,
    teardown: teardown
  };
}

createElementPollingEvent<JQuery.Coordinates>(
  'move',
  function()
  {
    return $( this ).offset()!;
  },
  function( oldOffset, newOffset )
  {
    return oldOffset.left === newOffset.left && oldOffset.top === newOffset.top;
  }
);


createElementPollingEvent<boolean>(
  'visible',
  function()
  {
    return $( this ).is( ':visible' );
  },
  function( oldVisibility, newVisibility )
  {
    return oldVisibility === newVisibility;
  }
);


createElementPollingEvent<boolean>(
  'loopchange',
  function()
  {
    return this.nodeName === 'VIDEO' && ( this as HTMLVideoElement ).loop;
  },
  function( oldLoop, newLoop )
  {
    return oldLoop === newLoop;
  }
);
