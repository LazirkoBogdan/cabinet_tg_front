const { rm } = require('fs/promises');

const { AssetPack } = require('@assetpack/core');
const { compress } = require('@assetpack/plugin-compress');
const { pixiTexturePacker } = require('@assetpack/plugin-texture-packer');
const { ffmpeg } = require('@assetpack/plugin-ffmpeg');
const { json } = require('@assetpack/plugin-json');
const { pixiManifest } = require('@assetpack/plugin-manifest');
const { mipmap } = require('@assetpack/plugin-mipmap');
const { webfont } = require('@assetpack/plugin-webfont');

const options = {
  jpg: { quality: 90 },
  webp: { quality: 80, alphaQuality: 80 },
  avif: { quality: 90, alphaQuality: 80 },
};



async function runAssetPack() {
  const assetsFolder = './src/assets';


  const assetpack = new AssetPack({
    entry: './src/raw-assets',
    output: assetsFolder,
    cacheLocation: './src/.assetpack',
    logLevel: 'info',
    cache: true,
    assetSettings: [
      {
        files: ['**/*.png'],
        settings: {
          compress: {
            jpg: true,
            png: true,
            webp: true,
            avif: true,
          },
        },
      },
    ],
    plugins: [
      ffmpeg({
        inputs: ['.mp3', '.ogg'],
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
      pixiTexturePacker({
        texturePacker: {
          removeFileExtension: true,
        },
      }),

      webfont(),
      pixiManifest({
        output: './src/assets/manifest.json',
        createShortcuts: false,
        trimExtensions: false,
        includeMetaData: false,
      }),
    ],
  });

  await assetpack.run();
}

runAssetPack().catch(console.error);
