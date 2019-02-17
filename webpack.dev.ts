import merge = require( 'webpack-merge' );

import common from './webpack.common';

export default merge( common, {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map'
} );
