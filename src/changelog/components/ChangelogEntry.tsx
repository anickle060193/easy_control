import React from 'react';
import { Button, colors, createStyles, makeStyles, Typography } from '@material-ui/core';
import classNames from 'classnames';

export type Arrayable<T> = T | T[];

function arrayable<T>( v: Arrayable<T> ): T[]
{
  if( Array.isArray( v ) )
  {
    return v;
  }
  else
  {
    return [ v ];
  }
}

export type ChangeType = 'bug' | 'feature' | 'enhancement';

const CHANGE_TYPES: { [ key in ChangeType ]: string } = {
  [ 'bug' ]: 'Bug',
  [ 'feature' ]: 'Feature',
  [ 'enhancement' ]: 'Enhancement',
};

interface ChangelogEntryImage
{
  src: string;
  alt: string;
}

interface Props
{
  changeType?: Arrayable<ChangeType>;
  text: React.ReactNode;
  issueNumber?: Arrayable<number>;
  image?: Arrayable<ChangelogEntryImage>;
}

const BUG_COLOR = colors.red[ 500 ];
const FEATURE_COLOR = colors.green[ 500 ];
const ENHANCEMENT_COLOR = colors.blue[ 500 ];

const useStyles = makeStyles( ( theme ) => createStyles( {
  changeType: {
    marginRight: theme.spacing( 0.5 ),
    padding: theme.spacing( 0.25, 0.5 ),
    borderRadius: 3,
  },
  bug: {
    background: BUG_COLOR,
    color: theme.palette.getContrastText( BUG_COLOR ),
  },
  feature: {
    background: FEATURE_COLOR,
    color: theme.palette.getContrastText( FEATURE_COLOR ),
  },
  enhancement: {
    background: ENHANCEMENT_COLOR,
    color: theme.palette.getContrastText( ENHANCEMENT_COLOR ),
  },
  text: {
    verticalAlign: 'middle',
  },
  issueLink: {
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing( 1 ),
  },
  image: {
    display: 'block',
    marginBlock: theme.spacing( 1 ),
  },
} ) );

export const ChangelogEntry: React.FC<Props> = ( { changeType, text, issueNumber, image } ) =>
{
  const styles = useStyles();

  return (
    <li>
      {( typeof changeType !== 'undefined' ) && (
        arrayable( changeType ).map( ( c ) => (
          <Typography
            key={c}
            className={classNames( styles.changeType, styles[ c ] )}
            component="span"
            variant="caption"
          >
            {CHANGE_TYPES[ c ]}
          </Typography>
        ) )
      )}
      <Typography
        className={styles.text}
        variant="body1"
        component="span"
      >
        {text}
      </Typography>
      {( typeof issueNumber !== 'undefined' ) && (
        arrayable( issueNumber ).map( ( issue ) => (
          <Button
            key={issue}
            className={styles.issueLink}
            color="secondary"
            variant="text"
            size="small"
            href={`https://github.com/anickle060193/easy_control/issues/${issue}`}
            target="_blank"
            rel="noopener noreferrer nofollower"
          >
            Issue #{issue}
          </Button>
        ) )
      )}
      {( typeof image !== 'undefined' ) && (
        arrayable( image ).map( ( { src, alt } ) => (
          <img
            key={src}
            className={styles.image}
            src={src}
            alt={alt}
          />
        ) )
      )}
    </li>
  );
};
