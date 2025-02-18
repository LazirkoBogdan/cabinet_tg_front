import { Sprite, Text, Graphics, Assets, Container } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { sound } from '@pixi/sound';
import { signal } from '../Service';

export class UIScene extends AbstractScene {
  clickCount = 0;
  clickText!: Text;
  player!: Spine;
  happyFill!: Graphics;
  washFill!: Graphics;
  sleepFill!: Graphics;
  hungerFill!: Graphics;
  workFill!: Graphics;
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

    // Create scene buttons via helper
    this.createSceneButton({
      x: 100,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_LIVINGROOM',
      iconAsset: 'icon_status_happy.png',
      fillPropKey: 'happyFill',
    });
    this.createSceneButton({
      x: 300,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_BATHROOM',
      iconAsset: 'icon_status_shower.png',
      fillPropKey: 'washFill',
    });
    this.createSceneButton({
      x: 500,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_BADROOM',
      iconAsset: 'icon_status_tired.png',
      fillPropKey: 'sleepFill',
    });
    this.createSceneButton({
      x: 700,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_KITCHEN',
      iconAsset: 'icon_status_hungry.png',
      fillPropKey: 'hungerFill',
    });
    this.createSceneButton({
      x: 900,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_GAMEROOM',
      iconAsset: 'play.png',
      fillPropKey: 'workFill',
    });
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
    this.player.x = 960;
    this.player.y = 800;
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
    this.clickText.anchor.set(0);
    this.clickText.position.set(20, 20);
    this.addChild(this.clickText);
  }


  private createSceneButton(options: {
    x: number;
    y: number;
    signalName: string;
    iconAsset: string;
    fillPropKey: keyof UIScene;
  }): Container {
    const { x, y, signalName, iconAsset, fillPropKey } = options;
    const buttonWidth = 100;
    const buttonHeight = 100;

    const container = new Container();
    container.position.set(x, y);
    container.pivot.set(buttonWidth / 2, buttonHeight / 2);
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.on('pointerdown', () => {
      console.log(
        `Button clicked! Changing scene to ${signalName.replace(
          'SCENE:CHANGE_TO_',
          ''
        )}Scene.`
      );
      signal.dispatch(signalName);
    });

    // Draw button outline.
    const buttonGraphic = new Graphics();
    buttonGraphic.lineStyle(2, 0x000000);
    buttonGraphic.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    container.addChild(buttonGraphic);

    // Create a circular mask.
    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(buttonWidth / 2, buttonHeight / 2, buttonWidth / 2);
    mask.endFill();
    container.addChild(mask);

    // Create fill graphic and assign it to the corresponding property.
    const fillGraphic = new Graphics();
    fillGraphic.mask = mask;
    buttonGraphic.addChild(fillGraphic);
    (this as any)[fillPropKey] = fillGraphic;

    // Add button background sprite.
    const buttonBG = new Sprite(Assets.cache.get('icon_status_bg.png'));
    buttonBG.scale.set(0.1);
    buttonBG.anchor.set(0.5);
    buttonBG.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(buttonBG);

    // Add icon sprite.
    const icon = new Sprite(Assets.cache.get(iconAsset));
    icon.scale.set(0.15);
    icon.anchor.set(0.5);
    icon.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(icon);

    this.addChild(container);
    return container;
  }

  private updateHappyFill(): void {
    const buttonWidth = 100;
    const buttonHeight = 100;
    this.happyFill.clear();
    this.happyFill.beginFill(0x00ff00);
    const fillHeight = (this.happinessLevel / 1000) * buttonHeight;
    this.happyFill.drawRect(0, buttonHeight - fillHeight, buttonWidth, fillHeight);
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
