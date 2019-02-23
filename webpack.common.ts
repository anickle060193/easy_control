import webpack = require( 'webpack' );
import path = require( 'path' );
import WebpackBar = require( 'webpackbar' );
import CleanWebpackPlugin = require( 'clean-webpack-plugin' );
import HtmlWebpackPlugin = require( 'html-webpack-plugin' );
import CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const build = path.resolve( __dirname, 'build' );

const config: webpack.Configuration = {
  entry: {
    options: path.resolve( __dirname, 'src', 'options', 'index.tsx' ),
    changelog: path.resolve( __dirname, 'src', 'changelog', 'index.tsx' ),
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
      },
      {
        test: /\.(png)$/,
        use: 'url-loader',
      },
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.woff', '.woff2', '.png' ],
    alias: {
      common: path.resolve( __dirname, 'src', 'common' ),
      options: path.resolve( __dirname, 'src', 'options' ),
      changelog: path.resolve( __dirname, 'src', 'changelog' ),
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
    new HtmlWebpackPlugin( {
      template: path.join( __dirname, 'src', 'changelog', 'index.html' ),
      filename: 'changelog.html',
      chunks: [ 'changelog' ]
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
