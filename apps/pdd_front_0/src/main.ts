import { Application, Assets, Sprite } from 'pixi.js';
import { SceneLoader } from './Core/Scenes/SceneLoader';
import { SplashScene } from './Core/Scenes/SplashScene';
import { signal } from './Core/Service';
import { StateMachine } from './Core/States/StateMachine';
import { BaseScene } from './Core/Scenes/BaseScene';
import manifest from './assets/manifest.json';

enum GameState {
  SplashState = 'MainMenu',
  Playing = 'Playing',
  Paused = 'Paused',
  GameOver = 'GameOver',
}

(async () => {
  // Create a new application
  const app = new Application();
  const sceneLoader = new SceneLoader(app);
  console.error('manifest', manifest);

  Assets.resolver.basePath = './assets/';
  // Initialize the application
  await app.init({ background: '#000000', resizeTo: window });

  await Assets.init({ manifest: manifest });

  Assets.backgroundLoadBundle(['default']);

  //@ts-ignore
  globalThis.__PIXI_APP__ = app;

  console.error('app', app);
  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;

  app.stage.addChild(bunny);
  const splashScene = new SplashScene({
    id: 'splash',
    x: app.view.width / 2,
    y: app.view.height / 2,
    width: app.view.width,
    height: app.view.height,
  });
  const baseScene = new BaseScene({
    id: 'base',
    x: app.view.width / 2,
    y: app.view.height / 2,
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

  // Listen for animate update
  app.ticker.add((time) => {
    bunny.rotation += 0.1 * time.deltaTime;
  });

  // Resize event listener
  window.addEventListener('resize', () => {
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    app.resize();
  });

  // Add click event listener to bunny
  bunny.interactive = true;
  (bunny as any).interactive = true;
  bunny.on('pointerdown', () => {
    baseScene.x = app.screen.width / 2 - baseScene.width / 2;
    baseScene.y = app.screen.height / 2 - baseScene.height / 2;
    sceneLoader.switchScene(baseScene);
  });
})();
