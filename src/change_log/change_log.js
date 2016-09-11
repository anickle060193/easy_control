$( function()
{
    $( 'body' ).scrollspy( { target : '#versions-sidebar', offset : 60 } );

    $( 'a[data-issue]' ).each( function()
    {
        this.href = "https://github.com/anickle060193/easy_control/issues/" + this.dataset.issue;
        $( this ).text( "[Issue #" + this.dataset.issue + "]" );
    } );

    $( 'span[data-type]' ).each( function()
    {
        if( this.dataset.type === 'enhancement' )
        {
            $( this ).addClass( 'label label-info' ).text( 'Enhancement' );
        }
        else if( this.dataset.type === 'bug' )
        {
            $( this ).addClass( 'label label-danger' ).text( 'Bug Fix' );
        }
        else if( this.dataset.type === 'feature' )
        {
            $( this ).addClass( 'label label-success' ).text( 'New Feature' );
        }
    } );
} );