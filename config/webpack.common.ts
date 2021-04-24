import path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const root = path.resolve( __dirname, '..' );
const build = path.resolve( root, 'build' );
const src = path.resolve( root, 'src' );

const config: webpack.Configuration = {
  entry: {
    background: path.resolve( src, 'background', 'index.ts' ),
    content: path.resolve( src, 'content', 'index.ts' ),
  },
  output: {
    path: build,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin( {
      typescript: {
        configFile: path.resolve( src, 'tsconfig.json' ),
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
      eslint: {
        files: path.resolve( src, '**', '*.{js,jsx,ts,tsx}' ),
      },
    } ),
    new CopyWebpackPlugin( {
      patterns: [
        {
          from: path.resolve( src, 'manifest.json' ),
          to: build,
          toType: 'dir',
          transform: ( content ) => JSON.stringify( {
            name: process.env[ 'npm_package_displayName' ],
            description: process.env[ 'npm_package_description' ],
            version: process.env[ 'npm_package_version' ],
            ...JSON.parse( content.toString() ),
          }, null, 2 ),
        },
        {
          from: path.resolve( root, 'assets' ),
          to: path.resolve( build, 'assets' ),
        },
      ],
    } ),
  ],
};

export default config;
