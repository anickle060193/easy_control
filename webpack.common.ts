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
    changelog: path.resolve( __dirname, 'src', 'changelog', 'index.tsx' ),
    controlsPopup: path.resolve( __dirname, 'src', 'controlsPopup', 'index.tsx' ),
    options: path.resolve( __dirname, 'src', 'options', 'index.tsx' ),

    amazonMusic: path.resolve( __dirname, 'src', 'controllers', 'amazon_music_controller.ts' ),
    amazonVideo: path.resolve( __dirname, 'src', 'controllers', 'amazon_video_controller.ts' ),
    bandcamp: path.resolve( __dirname, 'src', 'controllers', 'bandcamp_controller.ts' ),
    googlePlayMusic: path.resolve( __dirname, 'src', 'controllers', 'google_play_music_controller.ts' ),
    hboGo: path.resolve( __dirname, 'src', 'controllers', 'hbo_go_controller.ts' ),
    hulu: path.resolve( __dirname, 'src', 'controllers', 'hulu_controller.ts' ),
    netflix: path.resolve( __dirname, 'src', 'controllers', 'netflix_controller.ts' ),
    pandora: path.resolve( __dirname, 'src', 'controllers', 'pandora_controller.ts' ),
    spotify: path.resolve( __dirname, 'src', 'controllers', 'spotify_controller.ts' ),
    twitch: path.resolve( __dirname, 'src', 'controllers', 'twitch_controller.ts' ),
    youtube: path.resolve( __dirname, 'src', 'controllers', 'youtube_controller.ts' ),

    audioVideo: path.resolve( __dirname, 'src', 'controllers', 'audio_video_controller.ts' ),
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
      controlsPopup: path.resolve( __dirname, 'src', 'controlsPopup' ),
      controllers: path.resolve( __dirname, 'src', 'controllers' ),
      options: path.resolve( __dirname, 'src', 'options' ),
    }
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin( [ build ] ),
    new HtmlWebpackPlugin( {
      template: path.join( __dirname, 'src', 'changelog', 'index.html' ),
      filename: 'changelog.html',
      chunks: [ 'changelog' ]
    } ),
    new HtmlWebpackPlugin( {
      template: path.join( __dirname, 'src', 'controlsPopup', 'index.html' ),
      filename: 'controlsPopup.html',
      chunks: [ 'controlsPopup' ]
    } ),
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
