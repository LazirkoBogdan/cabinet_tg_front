import { Sprite, Text, Graphics, Assets } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { AbstractScene } from './AbstractScene';
import { sound } from '@pixi/sound';

export class BaseScene extends AbstractScene {
  private clickCount = 0;
  private clickText!: Text;
  private background!: Sprite;
  private player!: Spine;
  private happyButton!: Graphics;
  private happyFill!: Graphics;
  private happinessLevel = 0;
  private hoverTimeout: any;
  private animationPlaying = false;
  private lastSoundPlayed = '';

  constructor(params: any) {
    super(params);
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadAssets();
    this.createUI();
    this.createHappyButton();
  }

  private async loadAssets(): Promise<void> {
    this.player = Spine.from({
      skeleton: 'cat.json',
      atlas: 'cat.atlas',
    });

    this.player.x = 960;
    this.player.y = 540;

    this.player.state.setAnimation(0, 'idle', true);

    this.setupPlayer();
  }

  private setupPlayer(): void {
    this.player.scale.set(0.3);

    this.player.x = window.innerWidth / 2;
    this.player.y = window.innerHeight / 2;
    this.player.eventMode = 'static';
    this.player.on('pointerover', this.onPlayerHoverStart, this);
    this.player.on('pointerout', this.onPlayerHoverEnd, this);
    this.addChild(this.player);

    const bgSound = Assets.cache.get('1621_Background_Guitar_loop.wav');
    sound.add('bg', bgSound);
    sound.play('bg', { loop: true });

    const meow = Assets.cache.get('meow.wav');
    sound.add('meow', meow);

    const purr = Assets.cache.get('purr_meow.wav');
    sound.add('purr', purr);
  }

  private createUI(): void {
    this.clickText = new Text(`Clicks: ${this.clickCount}`, {
      fontSize: 64,
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
      fontSize: 30,
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
      if (!this.animationPlaying) {
        this.animationPlaying = true;
        this.player.state.setAnimation(0, 'happy', false);
        const previousSound = this.lastSoundPlayed;
        let catReaction;
        do {
          catReaction = Math.random() > 0.5 ? 'purr' : 'meow';
        } while (catReaction === previousSound);
        this.lastSoundPlayed = catReaction;

        sound.play(catReaction, { loop: false });
        this.player.state.addListener({
          complete: () => {
            this.animationPlaying = false;
            this.player.state.setAnimation(0, 'idle', true);
          },
        });
      }

      this.hoverInterval = setInterval(() => {
        this.clickCount++;
        this.updateClickText();

        if (this.happinessLevel < 10000) {
          this.happinessLevel += 50;
          this.updateHappyFill();
        }
      }, 100);
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
}
