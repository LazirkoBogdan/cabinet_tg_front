import { Container } from 'pixi.js';

export interface SceneParams {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export abstract class AbstractScene extends Container {
  private id: string;

  constructor(params: SceneParams) {
    super();
    if (!params.id || params.x === undefined || params.y === undefined) {
      throw new Error('Invalid parameters for AbstractScene');
    }
    this.id = params.id;
    this.x = params.x;
    this.y = params.y;
    this.visible = false;
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
