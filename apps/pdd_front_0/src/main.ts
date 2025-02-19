import { Application, Assets, Sprite } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { Render } from './Core/Render/Render';
import { SceneLoader } from './Core/Scenes/SceneLoader';
import { SplashScene } from './Core/Scenes/SplashScene';
import { signal } from './Core/Service';
import { StateMachine } from './Core/States/StateMachine';
import { UIScene } from './Core/Scenes/UIScene';
import { LivingroomScene } from './Core/Scenes/LivingroomScene';
import { BathroomScene } from './Core/Scenes/BathroomScene';
import { BadroomScene } from './Core/Scenes/BadroomScene';
import { GameroomScene } from './Core/Scenes/GameroomScene';
import { KitchenScene } from './Core/Scenes/KitchenScene';
import { MenuScene } from './Core/Scenes/MenuScene';
import manifest from './assets/manifest.json';

enum GameState {
  SplashState = 'MainMenu',
  Playing = 'Playing',
  Paused = 'Paused',
  GameOver = 'GameOver',
}

(async function main() {
  const app = new Render();
  const sceneLoader = new SceneLoader(app);
  let currScene: string | null = null;



  console.error('manifest', manifest);
  Assets.resolver.basePath = './assets/';
  await app.init({ background: '#000000', resizeTo: window });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  globalThis.__PIXI_APP__ = app;

  await Assets.init({ manifest });
  Assets.backgroundLoadBundle(['default', 'bundle', 'game-screen']);
  await Assets.loadBundle('bundle');

  const splashScene = new SplashScene({
    id: 'splash',
    x: 960,
    y: 540,
    width: 2000,
    height: 2000,
  });
  sceneLoader.registerScene('splash', splashScene);

  await Assets.loadBundle('game-screen');

  const uiScene = new UIScene({
    id: 'ui',
    x: 0,
    y: 0,
    width: app.view.width,
    height: app.view.height,
  });
  sceneLoader.registerScene('ui', uiScene);

  const createScene = <T>(
    SceneClass: new (config: any) => T,
    id: string
  ): T =>
    new SceneClass({
      id,
      x: 0,
      y: 0,
      width: app.view.width,
      height: app.view.height,
    });

  const scenes = {
    livingroom: createScene(LivingroomScene, 'livingroom'),
    bathroom: createScene(BathroomScene, 'bathroom'),
    badroom: createScene(BadroomScene, 'badroom'),
    kitchen: createScene(KitchenScene, 'kitchen'),
    gameroom: createScene(GameroomScene, 'gameroom'),
    menu: createScene(MenuScene, 'menu'),
  };

  Object.entries(scenes).forEach(([key, scene]) =>
    sceneLoader.registerScene(key, scene)
  );

  const sceneSwitchMap: Record<string, string> = {
    'SCENE:CHANGE_TO_LIVINGROOM': 'livingroom',
    'SCENE:CHANGE_TO_BATHROOM': 'bathroom',
    'SCENE:CHANGE_TO_BADROOM': 'badroom',
    'SCENE:CHANGE_TO_KITCHEN': 'kitchen',
    'SCENE:CHANGE_TO_GAMEROOM': 'gameroom',
  };

  Object.entries(sceneSwitchMap).forEach(([event, targetScene]) => {
    signal.on(event, () => {
      if (!currScene || currScene === targetScene) return;

      console.log(`Switching from ${currScene} to ${targetScene}...`);
      sceneLoader.switchScene(currScene, targetScene);
      currScene = targetScene;
      console.log('currScene:', currScene);
    });
  });

  let isMenuOpen = false;
  signal.on('SCENE:TOGGLE_MENU_SCENE', () => {
    if(isMenuOpen){
      console.log('Opening menu scene on top...');
      sceneLoader.removeScene('menu', { alpha: 0 });
    } else {
      console.log('Opening menu scene on top...');
      sceneLoader.addScene('menu', { alpha: 1 }, 500, 3);
    }
    isMenuOpen = !isMenuOpen;
    console.log('isMenuOpen:', isMenuOpen);
  });

  const gameStateMachine = StateMachine.getInstance(GameState.SplashState);

  gameStateMachine.addState(GameState.SplashState, () => {
    console.log('Loader is idle');
    sceneLoader.addScene('splash', { alpha: 1 }, 500);

    signal.once('LOADER:COMPLETE', () => {
      sceneLoader.removeScene('splash', { alpha: 0 }, 500);
      sceneLoader.addScene('ui', { alpha: 1 }, 500, 1);
      sceneLoader.addScene('livingroom', { alpha: 1 }, 500, 0);
      currScene = 'livingroom';
      console.log('currScene:', currScene);
      gameStateMachine.changeState(GameState.Playing);
    });
  });

  gameStateMachine.addState(GameState.Playing, () => {
    console.log('Game is playing');
  });

  gameStateMachine.changeState(GameState.SplashState);

  document.body.appendChild(app.canvas);
})();
