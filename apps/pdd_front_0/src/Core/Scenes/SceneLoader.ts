import { Application } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
import { ease } from 'pixi-ease';

export class SceneLoader {
    private app: Application;
    private currentScene: AbstractScene | null;

    constructor(app: Application) {
        this.app = app;
        this.currentScene = null;
    }

    public loadScene(scene: AbstractScene, animation: object = {}, duration: object = {duration :0}): void {
        if (this.currentScene) {
            this.unloadScene();
        }
        this.currentScene = scene;
        this.app.stage.addChild(this.currentScene);
        this.currentScene.show();
        if (animation) {
            console.log('animation' );
            ease.add(this.currentScene, animation, duration);
        }
}

    public unloadScene(): void {
        if (this.currentScene) {
            this.currentScene.hide();
            this.app.stage.removeChild(this.currentScene);
            this.currentScene = null;
        }
    }

    public switchScene(scene: AbstractScene): void {
        this.loadScene(scene);
    }
}

