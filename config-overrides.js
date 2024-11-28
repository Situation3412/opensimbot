const webpack = require('webpack');

module.exports = function override(config, env) {
  // Don't apply these rules to electron files
  const electronFiles = /[\\/]src[\\/]electron[\\/]/;
  
  // Add resolve fallbacks
  config.resolve = {
    ...config.resolve,
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
      "crypto": false,
      "stream": false,
      "util": false,
      "assert": false,
      "http": false,
      "https": false,
      "os": false,
      "electron": false
    }
  };

  // Add plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  ];

  // Exclude electron files from webpack bundling
  config.module.rules.push({
    test: electronFiles,
    use: 'null-loader'
  });

  return config;
};