import webpack from 'webpack';
import path from 'path';
import WebpackBar from 'webpackbar';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const build = path.resolve( __dirname, 'build' );

const config: webpack.Configuration = {
  entry: {
    background: path.resolve( __dirname, 'src', 'background', 'index.ts' ),
    options: path.resolve( __dirname, 'src', 'options', 'index.tsx' ),
    changelog: path.resolve( __dirname, 'src', 'changelog', 'index.tsx' ),
    pandora: path.resolve( __dirname, 'src', 'controllers', 'pandora_controller.ts' ),
    youtube: path.resolve( __dirname, 'src', 'controllers', 'youtube_controller.ts' ),
    spotify: path.resolve( __dirname, 'src', 'controllers', 'spotify_controller.ts' ),
    audioVideo: path.resolve( __dirname, 'src', 'controllers', 'audio_video_controller.ts' ),
    netflix: path.resolve( __dirname, 'src', 'controllers', 'netflix_controller.ts' ),
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
      background: path.resolve( __dirname, 'src', 'background' ),
      changelog: path.resolve( __dirname, 'src', 'changelog' ),
      common: path.resolve( __dirname, 'src', 'common' ),
      controllers: path.resolve( __dirname, 'src', 'controllers' ),
      options: path.resolve( __dirname, 'src', 'options' ),
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
