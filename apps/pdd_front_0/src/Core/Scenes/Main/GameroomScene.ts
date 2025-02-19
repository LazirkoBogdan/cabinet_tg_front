import { Sprite, Text, Graphics, Assets, Container } from 'pixi.js';
import { AbstractScene } from '../AbstractScene';

export class GameroomScene extends AbstractScene {
background!: Sprite;

constructor(params: any) {
  super(params);
  this.init();
}

private async init(): Promise<void> {
  await this.loadAssets();
}

private async loadAssets(): Promise<void> {
  const texture = Assets.cache.get('background_gameroom_land.png');
  this.background = new Sprite(texture);
  this.background.anchor.set(0.5);
  this.background.position.set(960, 540);
  this.addChildAt(this.background, 0);
}
}