import { Text, Graphics } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
import { SplashLoader } from '../Entities/Splash/SplashLoader';
import { Popup } from '../Entities/Popup/Popup';

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
    // const popup = this.initPopup();

    // setTimeout(() => {
    //   popup.popupIn(-1000, 1000)
    // }, 5000)
    // setTimeout(() => {
    //   popup.popupOut(-1000, 1000)
    // }, 7000)
    // this.addChild(this.loader, popup);
    this.addChild(this.loader);
  }
  init() {
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
  initPopup() {
    const popupParams = {
      id: 'splashPopup',
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      bgStyle: {
        bgFill: 0xffffff,
        bgAlpha: 1,
        bgRadius: 10,
        bgStrokeColor: 0x000000,
        bgStrokeWidth: 2,
      },
      buttonWidth: 100,
      buttonHeight: 50,
      string: 'Welcome to the Splash Screen!',
      textX: 0,
      textY: -30,
      popupTextStyle: { fill: 0x000000, fontSize: 20 },
      buttonX: 0,
      buttonY: 50,
      buttonOffsetX: 15,
      okButtonStyle: {
        okButtonFill: 0x00ff00,
        okButtonAlpha: 1,
        okButtonRadius: 10,
        okButtonStrokeColor: 0x000000,
        okButtonStrokeWidth: 2,
      },
      cancelButtonStyle: {
        cancelButtonFill: 0xff0000,
        cancelButtonAlpha: 1,
        cancelButtonRadius: 10,
        cancelButtonStrokeColor: 0x000000,
        cancelButtonStrokeWidth: 2,
      },
      okButtonTextStyle: { fill: 0xffffff, fontSize: 16 },
      cancelButtonTextStyle: { fill: 0xffffff, fontSize: 16 },
    };
    return new Popup(popupParams);
  }
  updateLoader() {
    if (this.loader) {
      // this.loader.update();
    }
  }
}
