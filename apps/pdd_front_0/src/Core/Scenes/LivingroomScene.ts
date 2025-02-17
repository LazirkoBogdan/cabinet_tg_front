import { Sprite, Assets } from 'pixi.js';
import { AbstractScene } from './AbstractScene';

export class LivingroomScene extends AbstractScene {
  background!: Sprite;

  constructor(params: any) {
    super(params);
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadAssets();
  }

  private async loadAssets(): Promise<void> {
    this.background = Assets.cache.get('background_land.jpg');
    this.setupScene();
  }

  private setupScene(): void {
    this.background.x = 960;
    this.background.y = 540;
    this.background.anchor.set(0.5);
    this.addChild(this.background);
  }
}
