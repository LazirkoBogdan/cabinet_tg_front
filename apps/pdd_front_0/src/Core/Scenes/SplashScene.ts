import { Text, Graphics } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
import { SplashLoader } from '../Entities/Splash/SplashLoader';
export class SplashScene extends AbstractScene {
  private _params: any;
  private bgWidth: number;
  private bgHeight: number;
  private loader: SplashLoader;
  constructor(params: any) {
    super(params);
    this._params = params;
    this.bgHeight = params.height || 100;
    this.bgWidth = params.width || 100;
    this.init();
    this.loader = this.initLoader();
    this.addChild(this.loader);
  }
  init() {
    console.log('Splash Scene initialized!!!!!!!!!!!!!!');
    this.initBG();
    this.initSplashText();
    this.initLoader();
  }
  initBG() {
    const background = new Graphics()
      .rect(-this.bgWidth / 2, -this.bgHeight / 2, this.bgWidth, this.bgHeight)
      .fill(0x531b66);
    background.name = 'SplashBG';
    this.addChild(background);
  }
  initSplashText() {
    const text = new Text('Splash Screen', { fill: 0x34d95a });
    text.anchor.set(0.5);
    text.y = -this._params.height / 4;
    this.addChild(text);
  }
  initLoader() {
    return new SplashLoader();
  }
  updateLoader() {
    if (this.loader) {
      this.loader.update();
    }
  }
}
