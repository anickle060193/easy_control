import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import common from './webpack.common';

export default merge( common( true ), {
  watch: true,
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin( {
      'process.env.NODE_ENV': 'development'
    } )
  ]
} );
