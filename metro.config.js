const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // The website is a separate web project; keep Metro from crawling it.
    blockList: [/[/\\]website[/\\].*/],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
