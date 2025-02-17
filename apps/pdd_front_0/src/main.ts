import { Application, Assets, Sprite } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { Render } from './Core/Render/Render';
import { SceneLoader } from './Core/Scenes/SceneLoader';
import { SplashScene } from './Core/Scenes/SplashScene';
import { signal } from './Core/Service';
import { StateMachine } from './Core/States/StateMachine';
import { UIScene } from './Core/Scenes/UIScene';
import manifest from './assets/manifest.json';

enum GameState {
  SplashState = 'MainMenu',
  Playing = 'Playing',
  Paused = 'Paused',
  GameOver = 'GameOver',
}

(async () => {
  // Create a new application
  const app = new Render();
  const sceneLoader = new SceneLoader(app);
  console.error('manifest', manifest);

  Assets.resolver.basePath = './assets/';
  // Initialize the application
  await app.init({ background: '#000000', resizeTo: window });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  globalThis.__PIXI_APP__ = app;

  await Assets.init({ manifest: manifest });

  Assets.backgroundLoadBundle(['default', 'bundle', 'game-screen']);

  await Assets.loadBundle('bundle').then(async (res) => {
    const texture = Assets.cache.get('background_land.jpg');

    // Create a bunny Sprite
    const bg = new Sprite(texture);
    bg.x = 960;
    bg.y = 540;
    bg.anchor.set(0.5);
    app.stage.addChild(bg);

    const splashScene = new SplashScene({
      id: 'splash',
      x: 960,
      y: 540,
      width: 2000,
      height: 2000,
    });

    await Assets.loadBundle('game-screen').then((res) => {
      const uiScene = new UIScene({
        id: 'ui',
        x: 960,
        y: 540,
        width: app.view.width,
        height: app.view.height,
      });
      const gameStateMachine = StateMachine.getInstance(GameState.SplashState);
      gameStateMachine.addState(GameState.SplashState, () => {
        console.log('Loader is idle');
        sceneLoader.loadScene(new SplashScene(splashScene));
        signal.on('LOADER:COMPLETE', () => {
          sceneLoader.unloadScene();
        });
        gameStateMachine.changeState(GameState.Playing);
      });

      gameStateMachine.addState(GameState.Playing, () => {
        console.log('Game is playing');
      });

      gameStateMachine.changeState(GameState.SplashState);

      bg.interactive = true;
      (bg as any).interactive = true;
      bg.on('pointerdown', () => {
        uiScene.x = 960 - uiScene.width / 2;
        uiScene.y = 540 - uiScene.height / 2;
        sceneLoader.switchScene(uiScene);
      });
    });
  });

  document.body.appendChild(app.canvas);
})();
