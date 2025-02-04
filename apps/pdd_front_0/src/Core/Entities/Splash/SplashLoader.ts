import { Container, Sprite } from 'pixi.js'
export class SplashLoader extends Container {
    private _params: any
    constructor(params: any) {
        super(params)
        console.log('Splash Loader initialized');
        this._params = params;
        this.init();
    }
    init() {
        this.initLoaderSprites();
    }

    initLoaderSprites() {
        const loaderBG = new Sprite();
        const loaderFG = new Sprite();
    }
}