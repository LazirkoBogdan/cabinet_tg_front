import { Container } from 'pixi.js';

export abstract class AbstractScene extends Container {
    private id: string;
    constructor(params: any) {
        super();
        this.id = params.id;
        this.x = params.x;
        this.y = params.y;
        this.visible = false;
    }

    public show(): void {
        this.visible = true;
        console.log(`Scene ${this.id} is now visible.`);
    }

    public hide(): void {
        this.visible = false;
        console.log(`Scene ${this.id} is now hidden.`);
    }

    public isVisible(): boolean {
        return this.visible;
    }
}

