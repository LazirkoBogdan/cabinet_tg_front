import { Application } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
import { ease } from 'pixi-ease';

/**
 * Wraps ease.add in a promise.
 * 
 * @param target The object to animate.
 * @param animation The animation properties.
 * @param duration Duration of the animation in milliseconds.
 * @returns A promise that resolves when the animation is complete.
 */
function easePromise(target: any, animation: object, duration: number): Promise<void> {
  return new Promise(resolve => {
    // Cast options to any to allow adding a complete callback.
    ease.add(target, animation, { duration, complete: resolve } as any);
  });
}

export class SceneLoader {
  private app: Application;
  // All registered scenes (can be preloaded)
  private registeredScenes: Map<string, AbstractScene>;
  // Scenes that are currently active (added to the stage)
  private activeScenes: Map<string, AbstractScene>;

  constructor(app: Application) {
    this.app = app;
    this.registeredScenes = new Map();
    this.activeScenes = new Map();
  }

  /**
   * Register a scene with a unique name.
   * @param name Unique identifier for the scene.
   * @param scene The scene instance.
   */
  public registerScene(name: string, scene: AbstractScene): void {
    if (this.registeredScenes.has(name)) {
      console.warn(`Scene "${name}" is already registered. Overwriting.`);
    }
    this.registeredScenes.set(name, scene);
  }

  /**
   * Unregister a scene.
   * @param name The name of the scene to unregister.
   */
  public unregisterScene(name: string): void {
    if (this.registeredScenes.has(name)) {
      this.registeredScenes.delete(name);
    } else {
      console.warn(`Scene "${name}" is not registered.`);
    }
  }

  /**
   * Adds (loads) a scene onto the stage by its registered name.
   * This method does not remove any already active scenes.
   * @param name The name of the registered scene.
   * @param animation Optional animation configuration for the scene entering.
   * @param duration Duration of the entering animation in milliseconds.
   * @param index The position (layer) to add the scene at (default is 0).
   */
  public addScene(name: string, animation: object = {}, duration = 0, index = 0): void {
    const scene = this.registeredScenes.get(name);
    if (!scene) {
      console.error(`Scene "${name}" is not registered.`);
      return;
    }
    if (this.activeScenes.has(name)) {
      console.warn(`Scene "${name}" is already active.`);
      return;
    }
    // Add the scene at the specified index.
    this.app.stage.addChildAt(scene, index);
    scene.show();
    if (Object.keys(animation).length > 0 && duration > 0) {
      ease.add(scene, animation, { duration } as any);
    }
    this.activeScenes.set(name, scene);
  }

  /**
   * Removes (unloads) an active scene from the stage.
   * @param name The name of the scene to remove.
   * @param animation Optional animation configuration for the scene exiting.
   * @param duration Duration of the exit animation in milliseconds.
   */
  public removeScene(name: string, animation: object = {}, duration = 0): void {
    const scene = this.activeScenes.get(name);
    if (!scene) {
      console.warn(`Scene "${name}" is not active.`);
      return;
    }
    if (duration > 0 && Object.keys(animation).length > 0) {
      easePromise(scene, animation, duration).then(() => {
        scene.hide();
        console.log("Scene removed after animation");
        this.app.stage.removeChild(scene);
        this.activeScenes.delete(name);
      });
    } else {
      scene.hide();
      console.log("Scene removed immediately");
      this.app.stage.removeChild(scene);
      this.activeScenes.delete(name);
    }
  }

  /**
   * Switches one active scene for another.
   * It will remove the old scene (with optional exit animation) and then add the new scene (with optional entrance animation).
   * @param oldName The name of the scene to remove.
   * @param newName The name of the scene to add.
   * @param outAnimation Optional animation for the outgoing scene.
   * @param inAnimation Optional animation for the incoming scene.
   * @param duration Duration for both animations in milliseconds.
   */
  public switchScene(oldName: string, newName: string, duration = 100): void {
    // Fade out and remove the current scene.
    this.removeScene(oldName, { alpha: 0 });
  
    // Retrieve the new scene.
    const newScene = this.registeredScenes.get(newName);
    if (!newScene) {
      console.error(`Scene "${newName}" is not registered.`);
      return;
    }
  
    // Reset the new scene's alpha so it can fade in properly.
    newScene.alpha = 0;
    newScene.visible = true;
  
    // Add the new scene at stage index 0.
    this.app.stage.addChildAt(newScene, 0);
    newScene.show();
  
    // Fade in the new scene from alpha 0 to 1.
    ease.add(newScene, { alpha: 1 }, { duration });
  
    // Mark the new scene as active.
    this.activeScenes.set(newName, newScene);
  }  
  
  

  /**
   * Moves an active scene to a new layer (child index) on the stage.
   * @param name The name of the active scene to move.
   * @param newIndex The new index (layer) position.
   */
  public moveScene(name: string, newIndex: number): void {
    const scene = this.activeScenes.get(name);
    if (!scene) {
      console.warn(`Scene "${name}" is not active.`);
      return;
    }
    // Change the scene's child index (layer) on the stage.
    this.app.stage.setChildIndex(scene, newIndex);
  }

  /**
   * Retrieve an active scene by name.
   * @param name The name of the active scene.
   */
  public getActiveScene(name: string): AbstractScene | undefined {
    return this.activeScenes.get(name);
  }

  /**
   * Removes all active scenes from the stage.
   * @param animation Optional animation configuration for the scenes exiting.
   * @param duration Duration of the exit animations in milliseconds.
   */
  public removeAllScenes(animation: object = {}, duration = 0): void {
    this.activeScenes.forEach((scene, name) => {
      if (duration > 0 && Object.keys(animation).length > 0) {
        easePromise(scene, animation, duration).then(() => {
          scene.hide();
          this.app.stage.removeChild(scene);
          this.activeScenes.delete(name);
        });
      } else {
        scene.hide();
        this.app.stage.removeChild(scene);
        this.activeScenes.delete(name);
      }
    });
  }
}
