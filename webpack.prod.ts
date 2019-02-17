import merge = require( 'webpack-merge' );
import ZipWebpackPlugin = require( 'zip-webpack-plugin' );

import common from './webpack.common';

export default merge( common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new ZipWebpackPlugin( {
      path: __dirname,
      filename: 'playlist_subscriber.zip'
    } )
  ]
} );
