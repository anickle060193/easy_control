import webpack = require( 'webpack' );
import path = require( 'path' );
import WebpackBar = require( 'webpackbar' );
import CleanWebpackPlugin = require( 'clean-webpack-plugin' );
import HtmlWebpackPlugin = require( 'html-webpack-plugin' );
import CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const build = path.resolve( __dirname, 'build' );

const config: webpack.Configuration = {
  entry: {
    options: path.resolve( 'src', 'options', 'index.tsx' ),
  },
  output: {
    path: build,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,
            fallback: 'file-loader'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.woff', '.woff2' ],
    alias: {
      common: path.resolve( __dirname, 'src', 'common' ),
      background: path.resolve( __dirname, 'src', 'background' ),
      options: path.resolve( __dirname, 'src', 'options' ),
      utils: path.resolve( __dirname, 'src', 'utils' ),
    }
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin( [ build ] ),
    new HtmlWebpackPlugin( {
      template: path.join( __dirname, 'src', 'options', 'index.html' ),
      filename: 'options.html',
      chunks: [ 'options' ]
    } ),
    new CopyWebpackPlugin( [
      {
        from: path.resolve( __dirname, 'src', 'manifest.json' ),
        to: build,
        toType: 'dir',
        transform: ( content ) => ( JSON.stringify( {
          name: process.env.npm_package_displayName,
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse( content )
        }, null, 2 ) )
      },
      {
        from: path.resolve( __dirname, 'src', 'assets' ),
        to: path.resolve( build ),
      }
    ] )
  ]
};

export default config;
