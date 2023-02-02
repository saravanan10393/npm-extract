const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const deps = require('./package.json').dependencies;
module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.join(__dirname, "../bucket"),
    filename: "./host/[name].js",
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'swc-loader',
        exclude: /node_modules/,
        // options: {
        //   presets: ['@babel/preset-react'],
        // },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'host/remoteEntry.js',
      remotes: {
        remote: ['remote@http://localhost/remote/remoteEntry.js'],
        remote2: ['remote2@http://localhost/remote2/remoteEntry.js'],
      },
      shared: [
        {
          react: {
            // eager: true,
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            // eager: true,
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
      scriptLoading: "blocking",
      minify: false
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
    }
  }
};