const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.join(__dirname, "../bucket"),
    filename: "./remote2/[name].js",
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'swc-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote2',
      filename: 'remote2/remoteEntry.js',
      exposes: {
        './Button': './src/button.js',
      },
      shared: [
        {
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
         
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
          'dayjs': {
            singleton: true,
            requiredVersion: deps['dayjs'],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './remote2/index.html'
    }),
  ],
  optimization: {
    chunkIds: "named",
    moduleIds: "named",
    removeAvailableModules: true,
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          chunks: "all",
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            let matches = Array.from(
              module.context.matchAll(/[\\/]node_modules[\\/](.*?)([\\/]|$)/g)
            );
            let packageName = matches[0][1];
            if (matches.length === 2) {
              packageName = matches[1][1];
            }
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `pnpm.${packageName.replace("@", "")}`;
          },
          filename: `./vendor/[name].js`
        }
      }
    },
    minimize: false
  }
};