const { withDangerousMod } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

module.exports = function withModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      const contents = fs.readFileSync(podfilePath, 'utf8');
      const result = mergeContents({
        tag: 'use-modular-headers',
        src: contents,
        newSrc: 'use_modular_headers!',
        anchor: /^platform :ios/m,
        offset: 1,
        comment: '#',
      });
      if (result.didMerge || result.didClear) {
        fs.writeFileSync(podfilePath, result.contents);
      }
      return config;
    },
  ]);
};
