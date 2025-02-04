import { Graphics, Text } from 'pixi.js';
import { AbstractScene } from './AbstractScene';

export class BaseScene extends AbstractScene {
  private clickCount: number = 0;
  private clickText: Text;

  constructor(params: any) {
    super(params);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const background = new Graphics();
    background.beginFill(0xffffff);
    background.drawRect(0, 0, screenWidth, screenHeight);
    background.endFill();
    this.addChild(background);

    const player = new Graphics();
    player.beginFill(0x00ff00);
    player.drawCircle(0, 0, 50);
    player.endFill();
    player.x = screenWidth / 2;
    player.y = screenHeight / 2;
    player.eventMode = 'static';
    player.on('pointerdown', this.onPlayerClick, this);
    this.addChild(player);

    this.clickText = new Text(`Clicks: ${this.clickCount}`, {
      fontSize: 24,
      fill: 0x000000,
    });
    this.clickText.x = 10;
    this.clickText.y = 10;
    this.addChild(this.clickText);
  }

  private onPlayerClick(): void {
    this.clickCount++;
    this.clickText.text = `Clicks: ${this.clickCount}`;
    console.log(`Player clicked ${this.clickCount} times`);
  }
}
