import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import common from './webpack.common';

export default merge( common( false ), {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin( {
      'process.env.NODE_ENV': 'production'
    } ),
    new webpack.optimize.UglifyJsPlugin( {
      sourceMap: true
    } )
  ]
} );
