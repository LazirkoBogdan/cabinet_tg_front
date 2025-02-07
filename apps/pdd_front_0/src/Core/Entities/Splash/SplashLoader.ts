import { Assets, Container, Graphics, Sprite } from 'pixi.js';
import { Ease, ease } from 'pixi-ease';
import { signal } from '../../Service';

export class SplashLoader extends Container {
  private value: number;
  private isFilling: boolean;
  protected loaderBG: Sprite;
  private loaderFG: Sprite;
  private loaderMask: Graphics;
  private EventManager: any;
  constructor() {
    super();
    this.value = 5;
    this.isFilling = true;
    this.loaderBG = new Sprite();
    this.loaderFG = new Sprite();
    this.loaderMask = new Graphics();
    this.init();
  }
  async init() {
    await this.initLoaderSprites();
    this.initLoaderMask();
  }

  async initLoaderSprites() {
    const loaderBGTexture = Assets.cache.get('frame.png');
    const loaderFGTexture = Assets.cache.get('progressline.png');

    this.loaderBG.texture = loaderBGTexture;
    this.loaderFG.texture = loaderFGTexture;
    this.loaderBG.anchor.set(0.5);
    this.loaderFG.anchor.set(0.5);
    // this.loaderMask.drawRoundedRect(0, 0, 400, 400, 40);
    // this.loaderMask.endFill();
    // this.loaderBG.x = 500;
    // this.loaderFG.y = 100;

    //  this.loaderBG.width = 100;

    this.addChild(this.loaderBG, this.loaderFG);

    this.update();
  }

  initLoaderMask() {
    this.loaderMask
      .fill(0x000000)
      .rect(
        -this.loaderFG.width / 2,
        -this.loaderFG.height / 2,
        this.loaderFG.width,
        this.loaderFG.height
      )
      .endFill();
    this.loaderFG.mask = this.loaderMask;
    this.addChild(this.loaderMask);
  }
  update() {
    this.loaderMask.x = -this.loaderFG.width;
    const targetX = 0;
    ease.add(
      this.loaderMask,
      { x: targetX },
      { duration: 2000, ease: 'easeInOutSine' }
    ).complete = () => {
      signal.dispatch('LOADER:COMPLETE');
    };
  }
}
