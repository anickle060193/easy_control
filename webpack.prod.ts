import merge from 'webpack-merge';
import ZipWebpackPlugin from 'zip-webpack-plugin';

import common from './webpack.common';

export default merge( common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new ZipWebpackPlugin( {
      path: __dirname,
      filename: 'easy_control.zip'
    } )
  ]
} );
