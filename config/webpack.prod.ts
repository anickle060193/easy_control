import merge from 'webpack-merge';

import common from './webpack.common';

export default merge( common, {
  mode: 'production',
  devtool: 'inline-source-map',
} );
