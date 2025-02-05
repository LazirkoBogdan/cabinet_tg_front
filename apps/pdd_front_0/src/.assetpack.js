import { AssetPack } from '@assetpack/core';

import { compress } from '@assetpack/plugin-compress';
import { pixiTexturePacker } from '@assetpack/plugin-texture-packer';
import { ffmpeg } from '@assetpack/plugin-ffmpeg';
import { json } from '@assetpack/plugin-json';
import { pixiManifest } from '@assetpack/plugin-manifest';
import { mipmap } from '@assetpack/plugin-mipmap';
import { webfont } from '@assetpack/plugin-webfont';

const options = {
  jpg: {},
  png: { quality: 90 },
  webp: { quality: 80, alphaQuality: 80 },
  avif: true,
  bc7: false,
  astc: false,
  basis: false,
  etc: false,
};

// "@assetpack/core": "^0.8.0",
//   "@assetpack/plugin-compress": "^0.8.0",
//     "@assetpack/plugin-ffmpeg": "^0.8.0",
//       "@assetpack/plugin-json": "^0.8.0",
//         "@assetpack/plugin-manifest": "^0.8.0",
//           "@assetpack/plugin-mipmap": "^0.8.0",
//             "@assetpack/plugin-texture-packer": "^0.8.0",
//               "@assetpack/plugin-webfont": "^0.5.1",

const assetpack = new AssetPack({
  entry: './raw-assets',
  output: './assets',
  cache: true,
  cacheLocation: '.assetpack',
  logLevel: 'info',
  //@ts-ignore
  plugins: [

    json(),

    //@ts-ignore
    compress(options),
    //@ts-ignore
    pixiTexturePacker({
      texturePacker: {
        padding: 2,
        //@ts-ignore
        nameStyle: 'relative',
        removeFileExtension: false,
      },
      resolutionOptions: {
        template: '@%%x',
        resolutions: { default: 1, low: 0.5 },
        fixedResolution: 'default',
        maximumTextureSize: 4096,
      },
    }),
    ffmpeg({
      inputs: ['.mp3', '.ogg', '.wav'],
      outputs: [
        {
          formats: ['.mp3'],
          recompress: false,
          options: {
            audioBitrate: 96,
            audioChannels: 1,
            audioFrequency: 48000,
          },
        },
        {
          formats: ['.ogg'],
          recompress: false,
          options: {
            audioBitrate: 32,
            audioChannels: 1,
            audioFrequency: 22050,
          },
        },
      ],
    }),
    mipmap({
      template: "@%%x",
      resolutions: { default: 1, low: 0.5 }, // { high: 2, default: 1, low: 0.5 }
      fixedResolution: "default",
    }),
    pixiManifest({
      output: './assets/manifest.json',
      createShortcuts: false,
      trimExtensions: false,
      //@ts-ignore
      includeMetaData: true,
      nameStyle: 'short',
    }),
  ],
});

await assetpack.run();
