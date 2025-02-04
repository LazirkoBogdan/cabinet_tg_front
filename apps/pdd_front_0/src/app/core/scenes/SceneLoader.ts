import * as PIXI from 'pixi.js';
import { AbstractScene } from './AbstractScene';

export class SceneLoader {
    private app: PIXI.Application;
    private currentScene: AbstractScene | null;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.currentScene = null;
    }

    public loadScene(scene: AbstractScene): void {
        if (this.currentScene) {
            this.unloadScene();
        }
        this.currentScene = scene;
        this.app.stage.addChild(this.currentScene);
        this.currentScene.show();
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

