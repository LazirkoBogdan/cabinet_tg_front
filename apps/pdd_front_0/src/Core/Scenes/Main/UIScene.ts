import { Sprite, Text, TextStyle, Graphics, Assets, Container } from 'pixi.js';
import { AbstractScene } from '../AbstractScene';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { sound } from '@pixi/sound';
import { signal } from '../../Service';

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
  counterTimeout: any;
  animationPlaying = false;
  lastSoundPlayed = '';
  hoverInterval: any;
  fadeInterval: any;
  isSoundPlaying = false;

  constructor(params: any) {
    super(params);
    this.init();
    this.setupSignalListeners();
  }

  private async init(): Promise<void> {
    await this.loadAssets();
    this.createUI();
  }

   private createUI(): void {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: '#ffffff',
      stroke: { color: '#4a1850', width: 5, join: 'round' },
      dropShadow: {
          color: '#000000',
          blur: 4,
          angle: Math.PI / 6,
          distance: 6,
      },
      wordWrap: true,
      wordWrapWidth: 440,
  });
    
    this.clickText = new Text({
      text: `${this.clickCount} %`,
      style,
    });
    this.clickText.anchor.set(0.5);
    this.clickText.position.set(112, 880);
    this.clickText.visible = false;
    this.addChild(this.clickText);

     // Створення кнопок інтерфейсу
    this.createUIButton({
      id: 'sound',
      x: 1700,
      y: 75,
      signalName: 'SOUND:TOGGLE_SOUND',
      iconAsset: 'ui_button_sound_off.png',
    });
    this.createUIButton({
      id: 'menu',
      x: 1850,
      y: 75,
      signalName: 'SCENE:TOGGLE_MENU_SCENE',
      iconAsset: 'ui_button_menu.png',
    });
    this.createUIButton({
      id: 'shop',
      x: 1850,
      y: 225,
      signalName: 'SCENE:OPEN_SHOP_SCENE',
      iconAsset: 'ui_button_shop.png',
    });

    // Створення кнопок для переходу на інші сцени
    this.createSceneButton({
      id: 'livingroom',
      x: 100,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_LIVINGROOM',
      iconAsset: 'icon_status_happy.png',
      fillPropKey: 'happyFill',
    });
    this.createSceneButton({
      id: 'bathroom',
      x: 300,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_BATHROOM',
      iconAsset: 'icon_status_shower.png',
      fillPropKey: 'washFill',
    });
    this.createSceneButton({
      id: 'bedroom',
      x: 500,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_BEDROOM',
      iconAsset: 'icon_status_tired.png',
      fillPropKey: 'sleepFill',
    });
    this.createSceneButton({
      id: 'kitchen',
      x: 700,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_KITCHEN',
      iconAsset: 'icon_status_hungry.png',
      fillPropKey: 'hungerFill',
    });
    this.createSceneButton({
      id: 'gameroom',
      x: 900,
      y: 980,
      signalName: 'SCENE:CHANGE_TO_GAMEROOM',
      iconAsset: 'icon_status_joy.png',
      fillPropKey: 'workFill',
    });
  }

  // Зчитування сигналів
  private setupSignalListeners(): void {
    signal.on('SOUND:TOGGLE_SOUND', this.toggleSound);


    console.warn('UIScene signal listeners set up');

    signal.on('SCENE:CHANGE_TO_LIVINGROOM', () => this.updatePlayerCoordinates(1300, 800));
    signal.on('SCENE:CHANGE_TO_BATHROOM', () => this.updatePlayerCoordinates(350, 410));
    signal.on('SCENE:CHANGE_TO_BEDROOM', () => this.updatePlayerCoordinates(900, 600));
    signal.on('SCENE:CHANGE_TO_KITCHEN', () => this.updatePlayerCoordinates(1600, 800));
    signal.on('SCENE:CHANGE_TO_GAMEROOM', () => this.updatePlayerCoordinates(1400, 600));
  }

  private updatePlayerCoordinates(x: number, y: number): void {
    this.player.position.set(x, y);
    console.log(`Player moved to coordinates: (${x}, ${y})`);
  }

  // Функція для включення/виключення звуку
  private toggleSound = (): void => {
    
    const soundButton = this.getChildByName('sound') as Container;
    if (!soundButton) {
      console.error('Sound button not found!');
      return;
    }
    const buttonSprite = soundButton.getChildAt(0) as Sprite;
  
    this.isSoundPlaying = !this.isSoundPlaying;
    if (this.isSoundPlaying) {
      sound.unmuteAll();
      buttonSprite.texture = Assets.cache.get('ui_button_sound_on.png');
    } else {
      sound.muteAll();
      buttonSprite.texture = Assets.cache.get('ui_button_sound_off.png');
    }

    console.log('Sound is now', this.isSoundPlaying ? 'ON' : 'OFF');
  }

  // Завантаження ассетів
  private async loadAssets(): Promise<void> {
    this.player = Spine.from({
      skeleton: 'cat.json',
      atlas: 'cat.atlas',
    });
    this.player.state.setAnimation(0, 'idle', true);
    this.setupPlayer();
  }

  private setupPlayer(): void {
    // Налаштування гравця (кота)
    this.player.x = 1300;
    this.player.y = 800;
    this.player.scale.set(0.5);
    this.player.eventMode = 'static';
    this.player.on('pointerover', this.onPlayerHoverStart, this);
    this.player.on('pointerout', this.onPlayerHoverEnd, this);
    this.addChild(this.player);

    // Завантаження звуку для фону
    const bgSound = Assets.cache.get('1621_Background_Guitar_loop.wav');
    sound.add('bg', bgSound);
    sound.play('bg', { loop: true });

    // Завантаження звуків для кота
    const meow = Assets.cache.get('meow.wav');
    sound.add('meow', meow);
    const purr = Assets.cache.get('purr_meow.wav');
    sound.add('purr', purr);
    sound.muteAll();
  }

  // Початок анімації при наведеннічи натисканні на кота
  private onPlayerHoverStart(): void {
    this.showCounter();

    this.player.on('pointermove', this.onPlayerHoverMove, this);
    this.player.on('pointerdown', this.onPlayerHoverMove, this);
  }

  // Анімація при наведеннічи натисканні на кота
  private onPlayerHoverMove(): void {
    this.showCounter();

    // Якщо анімація не відтворюється, відтворюємо її
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
          this.happinessLevel += 10;
          this.updateClickText();
          this.updateHappyFill();
        }
      }, 100);
    }
    // Якщо анімація відтворюється, встановлюємо таймаут
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      clearInterval(this.hoverInterval);
      this.hoverInterval = null;
    }, 140);
  }

  // Зупинка анімації при відведенні від кота
  private onPlayerHoverEnd(): void {
    this.player.off('pointermove', this.onPlayerHoverMove, this);
    this.player.off('pointerdown', this.onPlayerHoverMove, this);
    clearInterval(this.hoverInterval);
  }
  private showCounter(): void {
    if (this.fadeInterval) {
      clearTimeout(this.fadeInterval);
      this.fadeInterval = null;
    }
    
    this.clickText.visible = true;
    this.clickText.alpha = 1;
    
    clearTimeout(this.counterTimeout);
    this.counterTimeout = setTimeout(() => {
      this.fadeOutCounter();
    }, 3000);
  }

  private fadeOutCounter(): void {
    const fadeDuration = 500; 
    const fadeSteps = 100;
    const fadeStepTime = fadeDuration / fadeSteps;
    let currentStep = 0;
  
    const fadeStep = () => {
      currentStep++;
      this.clickText.alpha = 1 - currentStep / fadeSteps;
      
      if (currentStep < fadeSteps) {
        this.fadeInterval = setTimeout(fadeStep, fadeStepTime);
      } else {
        this.clickText.visible = false;
        this.clickText.alpha = 1;
        this.fadeInterval = null;
      }
    };
    fadeStep();
  }

  // Створення кнопок інтерфейсу
  private createUIButton(options: {
    id: string;
    x: number;
    y: number;
    signalName: string;
    iconAsset: string;
  }): Container {
    const { id, x, y, signalName, iconAsset } = options;
    
    // Розміри кнопки
    const buttonWidth = 100;
    const buttonHeight = 100;

    // Створення контейнера для кнопки
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

    // Якщо є id, присвоюємо його контейнеру
    if (id) {
      container.name = id;
    }

    // Створення спрайту і його присвоєння кнопці
    const buttonBG = new Sprite(Assets.cache.get(iconAsset));
    buttonBG.scale.set(0.08);
    buttonBG.anchor.set(0.5);
    buttonBG.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(buttonBG);

    this.addChild(container);
    return container;
  }

  // Створення кнопок для переходу на інші сцени
  private createSceneButton(options: {
    id: string;
    x: number;
    y: number;
    signalName: string;
    iconAsset: string;
    fillPropKey: keyof UIScene;
  }): Container {
    const { id, x, y, signalName, iconAsset, fillPropKey } = options;

    // Розміри кнопки
    const buttonWidth = 100;
    const buttonHeight = 100;

    // Створення контейнера для кнопки
    const container = new Container();
    container.position.set(x, y);
    container.pivot.set(buttonWidth / 2, buttonHeight / 2);
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.on('pointerdown', () => {
      signal.dispatch(signalName);
    });

    // Якщо є id, присвоюємо його контейнеру
    if (id) {
      container.name = id;
    }

    // Створення графічного елементу кнопки
    const buttonGraphic = new Graphics();
    buttonGraphic.lineStyle(2, 0x000000);
    buttonGraphic.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    container.addChild(buttonGraphic);

    // Створення маски для графічного елементу
    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(buttonWidth / 2, buttonHeight / 2, buttonWidth / 2);
    mask.endFill();
    container.addChild(mask);

    // Створення графічного елементу для заповнення
    const fillGraphic = new Graphics();
    fillGraphic.mask = mask;
    buttonGraphic.addChild(fillGraphic);
    (this as any)[fillPropKey] = fillGraphic;

    // Створення спрайту беку для кнопки
    const buttonBG = new Sprite(Assets.cache.get('icon_status_bg.png'));
    buttonBG.scale.set(0.1);
    buttonBG.anchor.set(0.5);
    buttonBG.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(buttonBG);

    // Створення іконки для кнопки
    const icon = new Sprite(Assets.cache.get(iconAsset));
    icon.scale.set(0.15);
    icon.anchor.set(0.5);
    icon.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(icon);

    this.addChild(container);
    return container;
  }

  // Оновленя графічного елементу для заповнення
  private updateHappyFill(): void {
    const buttonWidth = 100;
    const buttonHeight = 100;
  
    this.happyFill.clear();
    
    const fillHeight = (this.happinessLevel / 1000) * buttonHeight;
    
    let fillColor: number;
    if (fillHeight < 30) {
        fillColor = 0xff0000;
      } else if (fillHeight < 60) {
        fillColor = 0xffff00;
      } else {
       fillColor = 0x00ff00;
    }
  
    this.happyFill.beginFill(fillColor);
    this.happyFill.drawRect(0, buttonHeight - fillHeight, buttonWidth, fillHeight);
    this.happyFill.endFill();
  }
  

  // Оновлення тексту лічильника кліків
  private updateClickText(): void {
    const fillPercentage = (this.happinessLevel / 1000) * 100;
    this.clickText.text = `${fillPercentage.toFixed(2)} %`;
  }
}
