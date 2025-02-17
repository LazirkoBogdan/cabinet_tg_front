import { pixiPipes } from '@assetpack/core/pixi';
import { AssetPack } from '@assetpack/core';
const assetsFolder = './src/assets';
const assetpack = new AssetPack({
  entry: './src/raw-assets',
  output: assetsFolder,
  pipes: [
    ...pixiPipes({
      cacheBust: true,
      resolutions: { default: 1, low: 0.5 },
      compression: { jpg: true, png: true, avif: true, },
      texturePacker: { nameStyle: "short" },
      audio: {
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
          }
        ]
      },


      manifest: { createShortcuts: true },
    }),
  ],
});

// To run AssetPack
await assetpack.run();
await assetpack.watch();
