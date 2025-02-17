import { Application } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
import { ease } from 'pixi-ease';

export class SceneLoader {
  private app: Application;
  private currentScene: AbstractScene | null;

  constructor(app: Application) {
    this.app = app;
    this.currentScene = null;
  }

  /**
   * Load a scene with optional animation.
   * @param scene The scene to load.
   * @param animation The animation configuration.
   * @param duration The duration of the animation in milliseconds.
   */
  public loadScene(
    scene: AbstractScene,
    animation: object = {},
    duration = 0
  ): void {
    if (this.currentScene) {
      this.unloadScene();
    }
    this.currentScene = scene;
    this.app.stage.addChild(this.currentScene);
    this.currentScene.show();
    if (Object.keys(animation).length > 0) {
      console.log('Animation is playing!');
      // Assuming ease.add is a function that takes an object and a duration
      ease.add(this.currentScene, animation, { duration });
    }
  }

  /**
   * Unload the current scene.
   */
  public unloadScene(): void {
    if (this.currentScene) {
      this.currentScene.hide();
      this.app.stage.removeChild(this.currentScene);
      this.currentScene = null;
    }
  }

  /**
   * Switch to a new scene.
   * @param scene The scene to switch to.
   */
  public switchScene(scene: AbstractScene): void {
    this.loadScene(scene);
  }
}
