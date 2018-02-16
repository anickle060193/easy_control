import * as webpack from 'webpack';
import * as path from 'path';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ExtractTextWebpackPlugin from 'extract-text-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const build = path.resolve( __dirname, 'build' );

const config = ( development: boolean ): webpack.Configuration => ( {
  entry: {
    background: './src/background/index.ts',
    options: './src/options/index.ts'
  },
  output: {
    path: build,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract( {
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: !development
              }
            }
          ]
        } ),
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.ts', '.css' ]
  },
  plugins: [
    new CleanWebpackPlugin( [ build ] ),
    new ExtractTextWebpackPlugin( '[name].bundle.css' ),
    new HtmlWebpackPlugin( {
      template: path.join( __dirname, 'src', 'options', 'index.html' ),
      filename: 'options.html',
      chunks: [ 'options' ]
    } ),
    new CopyWebpackPlugin( [
      {
        from: 'src/manifest.json',
        transform: ( content, path ) =>
        {
          return JSON.stringify( {
            name: process.env.npm_package_displayName,
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,

            ...JSON.parse( content )
          }, null, 2 );
        }
      },
      {
        from: './assets',
        to: 'assets',
        toType: 'dir'
      }
    ] )
  ]
} );

export default config;
