import { Sprite, Text, Graphics, Assets, Container } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { sound } from '@pixi/sound';

export class LivingroomScene extends AbstractScene {
  clickCount = 0;
  clickText!: Text;
  player!: Spine;
  happyBG!: Sprite;
  happyButton!: Graphics;
  happyFill!: Graphics;
  happinessLevel = 0;
  hoverTimeout: any;
  animationPlaying = false;
  lastSoundPlayed = '';
  hoverInterval: any;

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

    this.player.state.setAnimation(0, 'idle', true);
    this.setupPlayer();
  }

  private setupPlayer(): void {
    this.player.x = 360;
    this.player.y = 600;
    this.player.scale.set(0.5);
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
    this.clickText = new Text(`${this.clickCount} %`, {
      fontSize: 45,
      fill: 0xffffff,
      fontWeight: 'bold',
    });

    this.clickText.position.set(-170, 600);
    this.addChild(this.clickText);
  }

  private createHappyButton(): void {
    const buttonWidth = 100;
    const buttonHeight = 100;

    const container = new Container();
    container.position.set(-100, 750);
    container.pivot.set(buttonWidth / 2, buttonHeight / 2);
    this.addChild(container);

    this.happyButton = new Graphics();
    this.happyButton.lineStyle(2, 0x000000);
    this.happyButton.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    this.happyButton.position.set(0, 0);
    container.addChild(this.happyButton);

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(buttonWidth / 2, buttonHeight / 2, buttonWidth / 2);
    mask.endFill();
    container.addChild(mask);

    this.happyFill = new Graphics();
    this.happyFill.mask = mask;
    this.happyButton.addChild(this.happyFill);

    this.happyBG = new Sprite(Assets.cache.get('icon_status_bg.png'));
    this.happyBG.scale.set(0.1);
    this.happyBG.anchor.set(0.5);
    this.happyBG.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(this.happyBG);

    const happyIcon = new Sprite(Assets.cache.get('icon_status_happy.png'));
    happyIcon.scale.set(0.15);
    happyIcon.anchor.set(0.5);
    happyIcon.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(happyIcon);

    this.updateHappyFill();
  }

  private updateHappyFill(): void {
    const buttonWidth = 100;
    const buttonHeight = 100;

    this.happyFill.clear();
    this.happyFill.beginFill(0x00ff00);
    const fillHeight = (this.happinessLevel / 1000) * buttonHeight;
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
        if (this.happinessLevel < 1000) {
          this.clickCount++;
          this.happinessLevel += 25;
          this.updateClickText();
          this.updateHappyFill();
        }
      }, 100);
    }

    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      clearInterval(this.hoverInterval);
      this.hoverInterval = null;
    }, 140);
  }

  private onPlayerHoverEnd(): void {
    this.player.off('pointermove', this.onPlayerHoverMove, this);
    this.player.off('pointerdown', this.onPlayerHoverMove, this);
    clearInterval(this.hoverInterval);
  }

  private updateClickText(): void {
    const fillPercentage = (this.happinessLevel / 1000) * 100;
    this.clickText.text = `${fillPercentage.toFixed(2)} %`;
  }
}
