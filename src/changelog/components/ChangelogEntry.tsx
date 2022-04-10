import React from 'react';
import { Box, Button, colors, SxProps, Theme, Typography } from '@mui/material';

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

const CHANGE_TYPE_SX: { [ type in ChangeType ]: SxProps<Theme> } = {
  bug: {
    background: BUG_COLOR,
    color: ( theme ) => theme.palette.getContrastText( BUG_COLOR ),
  },
  feature: {
    background: FEATURE_COLOR,
    color: ( theme ) => theme.palette.getContrastText( FEATURE_COLOR ),
  },
  enhancement: {
    background: ENHANCEMENT_COLOR,
    color: ( theme ) => theme.palette.getContrastText( ENHANCEMENT_COLOR ),
  },
};

export const ChangelogEntry: React.FC<Props> = ( { changeType, text, issueNumber, image } ) =>
{
  return (
    <li>
      {( typeof changeType !== 'undefined' ) && (
        arrayable( changeType ).map( ( c ) => (
          <Typography
            key={c}
            sx={{
              marginRight: 0.5,
              padding: [ 0.25, 0.5 ],
              borderRadius: 3,
              ...CHANGE_TYPE_SX[ c ],
            }}
            component="span"
            variant="caption"
          >
            {CHANGE_TYPES[ c ]}
          </Typography>
        ) )
      )}
      <Typography
        sx={{
          verticalAlign: 'middle',
        }}
        variant="body1"
        component="span"
      >
        {text}
      </Typography>
      {( typeof issueNumber !== 'undefined' ) && (
        arrayable( issueNumber ).map( ( issue ) => (
          <Button
            key={issue}
            sx={{
              whiteSpace: 'nowrap',
              marginLeft: 1,
            }}
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
          <Box
            key={src}
            component="img"
            sx={{
              display: 'block',
              marginBlock: 1,
            }}
            src={src}
            alt={alt}
          />
        ) )
      )}
    </li>
  );
};
