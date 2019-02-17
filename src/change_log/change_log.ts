$( function()
{
  // $( 'body' ).scrollspy( { target: '#versions-sidebar', offset: 60 } );

  $( 'a[data-issue]' ).each( ( _, elem: HTMLAnchorElement ) =>
  {
    elem.href = "https://github.com/anickle060193/easy_control/issues/" + elem.dataset.issue;
    $( elem ).text( "[Issue #" + elem.dataset.issue + "]" );
  } );

  $( 'span[data-type]' ).each( ( _, elem: HTMLSpanElement ) =>
  {
    if( elem.dataset.type === 'enhancement' )
    {
      $( elem ).addClass( 'label label-info' ).text( 'Enhancement' );
    }
    else if( elem.dataset.type === 'bug' )
    {
      $( elem ).addClass( 'label label-danger' ).text( 'Bug Fix' );
    }
    else if( elem.dataset.type === 'feature' )
    {
      $( elem ).addClass( 'label label-success' ).text( 'New Feature' );
    }
  } );
} );
