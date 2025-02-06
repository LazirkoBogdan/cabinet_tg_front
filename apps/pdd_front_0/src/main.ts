import { Application, Assets, Sprite } from 'pixi.js';
import { Render } from './Core/Render/Render';
import { SceneLoader } from './Core/Scenes/SceneLoader';
import { SplashScene } from './Core/Scenes/SplashScene';
import { signal } from './Core/Service';
import { StateMachine } from './Core/States/StateMachine';
import { BaseScene } from './Core/Scenes/BaseScene';
import manifest from './assets/manifest.json';
import { ease } from 'pixi-ease';

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

  await Assets.init({ manifest: manifest });

  Assets.backgroundLoadBundle(['default']);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  globalThis.__PIXI_APP__ = app;

  console.error('app', app);
  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load('./game-screen/loader/living_room.jpg');

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  // bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.x = 960;
  bunny.y = 540;
  bunny.anchor.set(0.5);
  app.stage.addChild(bunny);

  const splashScene = new SplashScene({
    id: 'splash',
    x: 960,
    y: 540,
    width: app.view.width,
    height: app.view.height,
  });
  const baseScene = new BaseScene({
    id: 'base',
    x: 960,
    y: 540,
    width: app.view.width,
    height: app.view.height,
  });

  const gameStateMachine = StateMachine.getInstance(GameState.SplashState);
  gameStateMachine.addState(GameState.SplashState, () => {
    console.log('Loader is idle');
    splashScene.x = -app.view.width / 2;
    sceneLoader.loadScene(splashScene, { x: 960 }, { duration: 1000, ease: 'easeInOutSine' });
    signal.on('LOADER:COMPLETE', () => {
      // sceneLoader.unloadScene();
      gameStateMachine.changeState(GameState.Playing);
    });
  });

  gameStateMachine.addState(GameState.Playing, () => {
    console.log('Game is playing');
    // baseScene.x = -app.view.width / 2;
    // sceneLoader.loadScene(baseScene, { x: 960 }, { duration: 1000, ease: 'easeInOutSine' });

  });

  gameStateMachine.changeState(GameState.SplashState);

  // Listen for animate update
  app.ticker.add((time) => {
    //  bunny.rotation += 0.1 * time.deltaTime;
  });

  // Add click event listener to bunny
  bunny.interactive = true;
  (bunny as any).interactive = true;
  bunny.on('pointerdown', () => {
    baseScene.x = 960 - baseScene.width / 2;
    baseScene.y = 540 - baseScene.height / 2;
    sceneLoader.switchScene(baseScene);
  });
})();
