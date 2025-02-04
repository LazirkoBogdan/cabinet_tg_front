import { Text } from 'pixi.js';
import { AbstractScene } from './AbstractScene';
export class SplashScene extends AbstractScene {
    constructor(params: any) {
        super(params);
        const text = new Text('Splash Scene', { fill: 0xffffff });
        text.x = 100;
        text.y = 100;
        this.addChild(text);
    }

}