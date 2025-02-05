import { Assets, Container, Sprite } from 'pixi.js'
export class SplashLoader extends Container {
    private value: number
    private isFilling: boolean
    protected loaderBG: Sprite
    private loaderFG: Sprite
    constructor() {
        super()
        console.log('Splash Loader initialized');
        this.value = 5; // Initial progress value
        this.isFilling = true; // Flag to control filling direction
        this.loaderBG = new Sprite();
        this.loaderFG = new Sprite();
        this.init();
    }
    init() {
        this.initLoaderSprites();
    }

    async initLoaderSprites() {
        const loaderBGTexture = await Assets.load('./assets/loader/frame.png');
        const loaderFGTexture = await Assets.load('./assets/loader/progress_line.png');
        this.loaderBG.texture = loaderBGTexture;
        this.loaderFG.texture = loaderFGTexture;
        this.loaderBG.anchor.set(0.5);
        this.loaderFG.anchor.set(0.5);
        // this.loaderBG.x = 500;
        // this.loaderFG.y = 100;

        //  this.loaderBG.width = 100;


        this.addChild(this.loaderBG, this.loaderFG);

        this.update();
    }
    update(width: number = 5) {

        this.loaderFG.width = width;

        if (!this.loaderFG) {
            return;
        }




        // this.isFilling ? this.value++ :this.value = 0;
        console.log('this.value', this.value);

        // Reverse direction if bounds are reached
        if (this.value > 100) {
            return;
        }

        // // Update the width of the foreground sprite to simulate progress
        // / (this.value / 100) * this.loaderBG.width

        console.log('this.loaderFG.width', this.loaderFG.width);
    }
}