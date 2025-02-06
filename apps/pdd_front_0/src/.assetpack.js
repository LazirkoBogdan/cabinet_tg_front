<<<<<<< HEAD
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

 await  rm(assetsFolder, { recursive: true, force: true });
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
=======
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
      compression: { jpg: true, png: true, avif: true },
      texturePacker: { nameStyle: 'short' },
      audio: {
        inputs: ['.mp3', '.ogg', '.wav'],
>>>>>>> d0f6375 ([fix] common js)
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
      },

      manifest: { createShortcuts: true },
    }),
  ],
});

  await assetpack.run();
}

 runAssetPack().catch(console.error);
