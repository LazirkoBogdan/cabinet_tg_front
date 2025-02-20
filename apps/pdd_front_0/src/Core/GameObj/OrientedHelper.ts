// OrientedManager.ts
export class OrientedHelper {
  private landConfig: any;
  private portConfig: any;
  private currentOrientation: 'land' | 'port';
  private target: any;

  constructor(target: any, config: any) {
    this.target = target;
    this.landConfig = config.land || {};
    this.portConfig = config.port || {};
    this.currentOrientation =
      window.innerWidth > window.innerHeight ? 'land' : 'port';

    this.applyConfig();
    this.setupResizeListener();
  }

  protected applyConfig(): void {
    const activeConfig =
      this.currentOrientation === 'land' ? this.landConfig : this.portConfig;
    console.error('activeConfig', activeConfig);

    if (activeConfig.position) {
      this.target.position.set(
        activeConfig.position.x || 0,
        activeConfig.position.y || 0
      );
    }
    if (activeConfig.scale) {
      this.target.scale.set(
        activeConfig.scale.x || 1,
        activeConfig.scale.y || 1
      );
    }
    if (activeConfig.alpha !== undefined) {
      this.target.alpha = activeConfig.alpha;
    }
  }

  protected setupResizeListener(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  protected onResize(): void {
    const newOrientation =
      window.innerWidth > window.innerHeight ? 'land' : 'port';

    if (newOrientation !== this.currentOrientation) {
      this.currentOrientation = newOrientation;
      this.applyConfig();
    }
  }

  public destroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}
