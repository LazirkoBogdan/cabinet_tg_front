import { Sprite, Graphics, Container } from 'pixi.js';
import { AbstractScene } from './AbstractScene';

export class MenuScene extends AbstractScene {
  private panel!: Graphics;

  constructor(params: any) {
    super(params);
    this.init();
  }

  private async init(): Promise<void> {
    this.createPanel();
  }

  private createPanel(): void {
    this.panel = new Graphics();
    this.panel.beginFill(0x333333, 0.8); 
    this.panel.drawRoundedRect(0, 0, 400, 600, 20); 
    this.panel.endFill();
    
    this.panel.pivot.set(200, 300); 
    this.panel.position.set(960, 540); 
    
    this.addChild(this.panel);
  }
}
