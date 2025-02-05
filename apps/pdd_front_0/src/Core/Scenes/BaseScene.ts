import { Sprite, Text, Graphics, Assets } from 'pixi.js';
import { AbstractScene } from './AbstractScene';

export class BaseScene extends AbstractScene {
  private clickCount: number = 0;
  private clickText!: Text;
  private background!: Sprite;
  private player!: Sprite;
  private happyButton!: Graphics;
  private happyFill!: Graphics;
  private happinessLevel: number = 0;
  private hoverTimeout: any;

  constructor(params: any) {
    super(params);
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadAssets();
    this.createUI();
    this.createHappyButton();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private async loadAssets(): Promise<void> {
    const [bgTexture, playerTexture] = await Promise.all([
      Assets.load('./assets/base_screen/bg.png'),
      Assets.load('./assets/base_screen/kitty.png'),
    ]);

    this.background = new Sprite(bgTexture);
    this.player = new Sprite(playerTexture);

    this.setupBackground();
    this.setupPlayer();
  }

  private setupBackground(): void {
    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;
    this.addChild(this.background);
  }

  private setupPlayer(): void {
    this.player.scale.set(0.3);
    this.player.anchor.set(0.5);
    this.player.x = window.innerWidth / 2;
    this.player.y = window.innerHeight / 2;
    this.player.eventMode = 'static';
    this.player.on('pointerover', this.onPlayerHoverStart, this);
    this.player.on('pointerout', this.onPlayerHoverEnd, this);
    this.addChild(this.player);
  }

  private createUI(): void {
    this.clickText = new Text(`Clicks: ${this.clickCount}`, {
      fontSize: 32,
      fill: 0xff0000,
      fontWeight: 'bold',
    });

    this.clickText.position.set(20, 20);
    this.addChild(this.clickText);
  }

  private createHappyButton(): void {
    const buttonWidth = 120;
    const buttonHeight = 100;

    this.happyButton = new Graphics();
    this.happyButton.lineStyle(2, 0x000000);
    this.happyButton.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    this.happyButton.position.set(20, 60);
    this.addChild(this.happyButton);

    this.happyFill = new Graphics();
    this.happyButton.addChild(this.happyFill);

    const buttonText = new Text('Happiness', {
      fontSize: 18,
      fill: 0x000000,
      fontWeight: 'bold',
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(buttonWidth / 2, buttonHeight / 2);
    this.happyButton.addChild(buttonText);

    this.updateHappyFill();
  }

  private updateHappyFill(): void {
    const buttonWidth = 120;
    const buttonHeight = 100;

    this.happyFill.clear();
    this.happyFill.beginFill(0x00ff00);

    const fillHeight = (this.happinessLevel / 10000) * buttonHeight;
    this.happyFill.drawRect(
      0,
      buttonHeight - fillHeight,
      buttonWidth,
      fillHeight
    );
    this.happyFill.endFill();
  }

  private onPlayerHoverStart(): void {
    this.player.on('pointermove', this.onPlayerHoverMove, this);
    this.player.on('pointerdown', this.onPlayerHoverMove, this);
  }

  private onPlayerHoverEnd(): void {
    this.player.off('pointermove', this.onPlayerHoverMove, this);
    this.player.off('pointerdown', this.onPlayerHoverMove, this);
    clearInterval(this.hoverInterval);
  }

  private hoverInterval: any;

  private onPlayerHoverMove(): void {
    if (!this.hoverInterval) {
      this.hoverInterval = setInterval(() => {
        this.clickCount++;
        this.updateClickText();

        if (this.happinessLevel < 10000) {
          this.happinessLevel += 50;
          this.updateHappyFill();
        }
      }, 100); // Increase every 100ms while moving or clicking
    }

    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      clearInterval(this.hoverInterval);
      this.hoverInterval = null;
    }, 100); // Stop increasing after 100ms of no movement
  }

  private updateClickText(): void {
    this.clickText.text = `Clicks: ${this.clickCount}`;
    console.log(`Player hovered ${this.clickCount} times`);
  }

  private onResize(): void {
    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;
    this.player.x = window.innerWidth / 2;
    this.player.y = window.innerHeight / 2;
  }
}
