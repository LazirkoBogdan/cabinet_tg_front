import { GameObj } from './GameObj';
import { Sprite, Assets, Texture } from 'pixi.js';
import { OrientedHelper } from './OrientedHelper';

export class GameSprite extends GameObj {
  public sprite: Sprite | undefined;
  protected orientedHelperSprite: OrientedHelper | undefined;
  constructor(config: any) {
    super(config);

    if (config.sprite) {
      if (!config.sprite.texture) {
        throw new Error('Invalid sprite configuration');
      } else {
        if (!Assets.cache.has(config.sprite.texture)) {
          throw new Error(`Texture ${config.sprite.texture} is not loaded.`);
        }

        const texture =
          Assets.cache.get(config.sprite.texture) || Texture.EMPTY;

        this.sprite = new Sprite(texture);
        if (config.sprite.position) {
          this.sprite.position.set(
            config.sprite.position.x || 0,
            config.sprite.position.y || 0
          );
          if (config.sprite.anchor) {
            this.sprite.anchor.set(
              config.sprite.anchor.x,
              config.sprite.anchor.y
            );
          }
        }

        if (config.sprite.scale) {
          this.sprite.scale.set(config.sprite.scale.x, config.sprite.scale.y);
        }

        if (config.sprite.alpha !== undefined) {
          this.sprite.alpha = config.sprite.alpha;
        }

        if (config.sprite.oriented) {
          this.orientedHelperSprite = new OrientedHelper(
            this.sprite,
            config.sprite.oriented
          );
        }

        this.addChild(this.sprite);
      }
    }
  }
}
