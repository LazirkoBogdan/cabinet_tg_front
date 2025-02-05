import { Application, Assets, Sprite } from 'pixi.js';
import { SceneLoader } from './Core/Scenes/SceneLoader';
import { SplashScene } from './Core/Scenes/SplashScene';
import { signal } from './Core/Service';
import { BaseScene } from './Core/Scenes/BaseScene';

(async () => {
  // Create a new application
  const app = new Application();
  const sceneLoader = new SceneLoader(app);
  // Initialize the application
  await app.init({ background: '#000000', resizeTo: window });
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
  sceneLoader.loadScene(new SplashScene({ id: 'splash', x: 0, y: 0 }));
  sceneLoader.loadScene(new SplashScene(splashScene));

  signal.on('LOADER:COMPLETE', () => {
    sceneLoader.unloadScene();
  });

  // setTimeout(() => {
  //   splashScene.updateLoader();
  // }, 2000)

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
  });

  // Resize event listener
  window.addEventListener('resize', () => {
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    app.resize();
  });
})();
