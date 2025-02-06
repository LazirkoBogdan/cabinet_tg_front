import { Application, ApplicationOptions } from 'pixi.js';
import { signal } from '../Service/Signal';

export class Render extends Application {
  public orientation: 'land' | 'port' = 'land';
  constructor() {
    super();
  }

  public async init(options?: Partial<ApplicationOptions>): Promise<void> {
    await super.init(options);
    this.renderResizeStage();
    window.addEventListener('resize', this.renderResizeStage.bind(this));
    window.addEventListener(
      'orientationchange',
      this.renderResizeStage.bind(this)
    );
  }

  protected renderResizeStage() {
    let config = {
      stage: {
        land: {
          width: 1920,
          height: 1080,
        },
        port: {
          width: 1080,
          height: 1920,
        },
      },
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    this.orientation =
      config.screen.width > config.screen.height ? 'land' : 'port';
    this.renderer.resize(config.screen.width, config.screen.height);
    const scale = Math.min(
      config.screen.width / config.stage[this.orientation].width,
      config.screen.height / config.stage[this.orientation].height
    );

    this.centerStages(config.stage[this.orientation], config.screen, scale);
  }

  public centerStages(
    stage: any,
    screen: { width: number; height: number },
    scale: number
  ): void {
    const centerX: number = (stage.width * scale - screen.width) / 2;
    const centerY: number = (stage.height * scale - screen.height) / 2;
    this.stage.scale.set(scale);
    this.stage.position.set(-centerX, -centerY);
    signal.dispatch('RENDER:RESIZE', { scale: scale });
  }
}
