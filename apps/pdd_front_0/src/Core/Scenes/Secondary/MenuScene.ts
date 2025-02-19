import { Sprite, Assets, Graphics, Container, Text } from 'pixi.js';
import { AbstractScene } from '../AbstractScene';
import { signal } from '../../Service';

export class MenuScene extends AbstractScene {
  constructor(params: any) {
    super(params);
    this.init();
  }

  private async init(): Promise<void> {
    this.createPanel();
  }

  private createPanel(): void {
   
    const background = new Graphics();
    background.beginFill(0x808080, 0.5);
    background.drawRect(-2000 / 2, -2000 / 2, 2000, 2000);
    background.endFill();
    background.position.set(940, 560);
    background.eventMode = 'static';

    background.on('pointerdown', () => {
      signal.dispatch("SCENE:TOGGLE_MENU_SCENE");
    });
    this.addChild(background);
    
    const container = new Container();
    container.position.set(940, 560);

    const buttonBG = new Sprite(Assets.cache.get('background_menu.png'));
    buttonBG.anchor.set(0.5);
    buttonBG.scale.set(0.9);
    container.eventMode = 'static';
    container.addChild(buttonBG);

    const closeButton = new Sprite(Assets.cache.get('ui_button_close.png'));
    closeButton.anchor.set(0.5);
    closeButton.scale.set(0.05);
    closeButton.eventMode = 'static';
    closeButton.cursor = 'pointer';
    closeButton.position.set(175, -265);
    closeButton.on('pointerdown', () => {
      signal.dispatch('SCENE:TOGGLE_MENU_SCENE');
    });
    container.addChild(closeButton);

    const button1 = this.createMenuButton({
      x: 0,
      y: -100,
      signalName: 'SCENE:TOGGLE_MENU_SCENE',
      textOnTop: 'ТОЛІК',
    });
    container.addChild(button1);
    
    const button2 = this.createMenuButton({
      x: 0,
      y: 50,
      signalName: 'SCENE:TOGGLE_MENU_SCENE',
      textOnTop: 'ПРИДУМАЙ',
    });
    container.addChild(button2);
    
    const button3 = this.createMenuButton({
      x: 0,
      y: 200,
      signalName: 'SCENE:TOGGLE_MENU_SCENE',
      textOnTop: 'ДИЗАЙН',
    });
    container.addChild(button3);

    this.addChild(container);
  }

  private createMenuButton(options: {
    x: number;
    y: number;
    signalName: string;
    textOnTop: string;
  }): Container {
    const { x, y, signalName, textOnTop } = options;
    const buttonWidth = 100;
    const buttonHeight = 100;

    const container = new Container();
    container.position.set(x, y);
    container.pivot.set(buttonWidth / 2, buttonHeight / 2);
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    container.on('pointerdown', () => {
      signal.dispatch(signalName);
    });

    const buttonBG = new Sprite(Assets.cache.get("buttons_menu_background.png"));
    buttonBG.scale.set(0.8);
    buttonBG.anchor.set(0.5);
    buttonBG.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(buttonBG);

    const buttonText = new Text(textOnTop, {
      fill: 0xffffff,
      fontSize: 20,
      fontWeight: 'bold',
    }); 
    buttonText.anchor.set(0.5);
    buttonText.position.set(buttonWidth / 2, buttonHeight / 2);
    container.addChild(buttonText);

    this.addChild(container);
    return container;
  }
}

