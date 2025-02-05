import { rm } from 'fs/promises';


import { AssetPack } from '@assetpack/core';
import { compress } from '@assetpack/plugin-compress';
import { pixiTexturePacker } from '@assetpack/plugin-texture-packer';
import { ffmpeg } from '@assetpack/plugin-ffmpeg';
import { json } from '@assetpack/plugin-json';
import { pixiManifest } from '@assetpack/plugin-manifest';
import { mipmap } from '@assetpack/plugin-mipmap';
import { webfont } from '@assetpack/plugin-webfont';

const options = {
  jpg: { quality: 90 },
  webp: { quality: 80, alphaQuality: 80 },
  avif: { quality: 90 },
};

const assetsFolder = './src/assets';
const assetsCache = './src/.assetpack';
await rm(assetsFolder, { recursive: true, force: true });
async function runAssetPack() {

  // await rm(assetsCache, { recursive: true, force: true });

  const assetpack = new AssetPack({
    entry: './src/raw-assets',
    output: assetsFolder,
    cacheLocation: './src/.assetpack',
    logLevel: 'info',
    cache: false,
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
      pixiTexturePacker({
        texturePacker: {

          removeFileExtension: true,
        }
      }),
      compress(options),
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

await runAssetPack().catch(console.error);


