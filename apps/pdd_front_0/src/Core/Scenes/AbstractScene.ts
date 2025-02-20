import { Container } from 'pixi.js';
import { FactoryRegistry } from '../Factory/FactoryRegistry';

export interface SceneParams {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  objects?: any[];
}

export interface SceneConfig {
  id: string;

  objects: Array<{
    type: string;
    config: any;
  }>;
}

export abstract class AbstractScene extends Container {
  private id: string;
  private factory: FactoryRegistry | undefined;
  protected sceneObjects: any = [];

  constructor(params: SceneParams) {
    super();
    if (!params.id) {
      throw new Error('Invalid parameters for AbstractScene');
    }

    this.id = params.id;
    if (params.objects) {
      this.factory = FactoryRegistry.getInstance();
      this.buildScene({ id: this.id, objects: params.objects }).then(
        (objects) => {
          this.addChild(objects);
        }
      );
    } else {
      this.x = params.x;
      this.y = params.y;
      this.visible = false;
    }
  }

  public async buildScene(
    config: SceneConfig,
    batchSize: number = 4,
    delay: number = 50
  ): Promise<Container> {
    const sceneContainer = new Container();
    sceneContainer.label = config.id;

    if (!this.factory) {
      throw new Error('Factory not initialized');
    }

    const objects = config.objects;

    for (let i = 0; i < objects.length; i += batchSize) {
      const batch = objects.slice(i, i + batchSize);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          batch.forEach((objConfig) => {
            if (!this.factory) {
              throw new Error('Factory not initialized');
            }
            const gameObject = this.factory.create(
              objConfig.type,
              objConfig.config
            ) as Container;

            this.sceneObjects.push({
              id:
                objConfig.config.id ||
                `obj_${Math.random().toString(36).substr(2, 9)}`,
              obj: gameObject,
            });

            sceneContainer.addChild(gameObject);
          });

          resolve();
        }, delay);
      });
    }

    return sceneContainer;
  }

  public getSceneObjects(): any {
    return this.sceneObjects;
  }

  public getGameObjectById(id: string): any {
    return this.sceneObjects.find((obj: any) => obj.id === id);
  }

  /**
   * Show the scene by setting it visible.
   */
  public show(): void {
    this.visible = true;
    console.log(`Scene ${this.id} is now visible.`);
  }

  /**
   * Hide the scene by setting it invisible.
   */
  public hide(): void {
    this.visible = false;
    console.log(`Scene ${this.id} is now hidden.`);
  }

  /**
   * Check if the scene is visible.
   * @returns {boolean} True if the scene is visible, false otherwise.
   */
  public isVisible(): boolean {
    return this.visible;
  }
}
