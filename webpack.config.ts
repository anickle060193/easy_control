import * as webpack from "webpack";
import * as path from "path";

const build = path.resolve( __dirname, 'build' );

const config: webpack.Configuration = {
  entry: {
    background: './src/background/index.ts'
  },
  output: {
    path: build,
    filename: '[name].bundle.js'
  }
};

export default config;
