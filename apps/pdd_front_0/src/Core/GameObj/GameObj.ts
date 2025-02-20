// GameObj.ts
import * as PIXI from 'pixi.js';
import { FactoryRegistry } from '../Factory/FactoryRegistry';
import { OrientedHelper } from './OrientedHelper';

export class GameObj extends PIXI.Container {
  public id: string;
  public config: any;
  protected isDestroyed: boolean = false;
  protected orientedHelper: OrientedHelper | undefined;

  constructor(config: any) {
    super();
    this.config = config;
    this.id = config.id || `obj_${Math.random().toString(36).substr(2, 9)}`;

    if (config.position) {
      this.position.set(config.position.x || 0, config.position.y || 0);
    }
    if (config.scale) {
      this.scale.set(config.scale.x, config.scale.y);
    }
    if (config.alpha !== undefined) {
      this.alpha = config.alpha;
    }

    if (config.oriented) {
      this.orientedHelper = new OrientedHelper(this, config);
    }
  }

  public update(delta: number): void {
    if (this.isDestroyed) return;
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.removeChildren();
    this.destroy();
  }
}
