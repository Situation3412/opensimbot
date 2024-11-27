const webpack = require('webpack');

module.exports = function override(config, env) {
  // Don't apply these rules to electron files
  const electronFiles = /[\\/]src[\\/]electron[\\/]/;
  
  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: electronFiles,
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "util": require.resolve("util/"),
      }
    }
  });

  // Add plugins
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // Exclude electron files from webpack bundling
  config.module.rules.push({
    test: electronFiles,
    use: 'null-loader'
  });

  return config;
}; 