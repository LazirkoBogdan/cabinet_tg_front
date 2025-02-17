import { Container, Graphics, Text } from "pixi.js";
import { ease } from 'pixi-ease';

export class Popup extends Container {
    protected _id: string;
    protected _params: any;
    protected _x: number;
    protected _y: number;
    protected _bgWidth: number;
    protected _bgHeight: number;
    protected _bgStyle: any;
    protected _popupContainer: Container;
    protected _bgGraphics: Graphics;
    protected _buttonWidth: number;
    protected _buttonHeight: number;
    protected _okButton: Container;
    protected _buttonX: number;
    protected _buttonY: number;
    protected _buttonOffsetX: number;
    protected _okButtonStyle: any;
    protected _cancelButton: Container;
    protected _cancelButtonStyle: any;
    protected _popupString: string;
    protected _popupTextStyle: any;
    protected _okButtonTextStyle: any;
    protected _cancelButtonTextStyle: any;
    protected _popupText: Text;
    protected _popupTextX: number;
    protected _popupTextY: number;

    constructor(params: any) {
        super();
        console.log('Popup constructor', params);
        this._params = params;
        this._id = params.id;
        this._x = params.x;
        this._y = params.y;
        this._bgWidth = params.width;
        this._bgHeight = params.height;
        this._bgStyle = params.bgStyle;
        this._popupContainer = new Container();
        this._bgGraphics = new Graphics();
        this._buttonWidth = params.buttonWidth;
        this._buttonHeight = params.buttonHeight;
        this._popupString = params.string;
        this._popupTextX = params.textX;
        this._popupTextY = params.textY;
        this._popupTextStyle = params.popupTextStyle;
        this._buttonX = params.buttonX;
        this._buttonY = params.buttonY;
        this._buttonOffsetX = params.buttonOffsetX;
        this._okButtonStyle = params.okButtonStyle;
        this._cancelButtonStyle = params.cancelButtonStyle;
        this._okButtonTextStyle = params.okButtonTextStyle;
        this._cancelButtonTextStyle = params.cancelButtonTextStyle;

        this._popupText = new Text();
        this._okButton = new Container();
        this._cancelButton = new Container();

        this.initPopup();
        this._popupContainer.visible = false;
        this.addChild(this._popupContainer);
    }

    get bgWidth(): number {
        return this._bgWidth;
    }

    set bgWidth(value: number) {
        this._bgWidth = value;
        this.redrawPopupBG();
    }

    get bgHeight(): number {
        return this._bgHeight;
    }

    set bgHeight(value: number) {
        this._bgHeight = value;
        this.redrawPopupBG();
    }

    get popupString(): string {
        return this._popupString;
    }
    set popupString(value: string) {
        this._popupString = value;
        this._popupText.text = value;
        this.redrawPopupBG();
    }
    initPopup() {
        this.initPopupBG();
        this.initPopupText();
        this.initPopupButtons();
        this.switchToButtonlessPopup();
    }

    initPopupBG() {
        console.log('initPopupBG');
        const bgFill = this._params.bgStyle.bgFill || 0x000000;
        const bgAlpha = this._params.bgStyle.bgAlpha || 0.5;
        const bgRadius = this._params.bgStyle.bgRadius || 10;
        const bgStrokeColor = this._params.bgStyle.bgStrokeColor || 0x000000;
        const bgStrokeWidth = this._params.bgStyle.bgStrokeWidth || 0;
        const strokeFillStyle = {
            color: bgStrokeColor,
            alpha: bgAlpha,
            width: bgStrokeWidth,
        }
        bgStrokeWidth ? 
        this._bgGraphics.fill(bgFill, bgAlpha).stroke(strokeFillStyle)
        .roundRect(-this._bgWidth / 2, -this._bgHeight / 2, this._bgWidth, this._bgHeight, bgRadius).endFill()
        : this._bgGraphics.fill(bgFill, bgAlpha)
        .roundRect(-this._bgWidth / 2, -this._bgHeight / 2, this._bgWidth, this._bgHeight, bgRadius).endFill();
        this._popupContainer.addChild(this._bgGraphics);
    }

    initPopupText() {
        console.log('initPopupText');
        this._popupText = new Text(this._popupString, this._popupTextStyle);
        this._popupText.anchor.set(0.5);
        this._popupText.x = this._popupTextX;
        this._popupText.y = this._popupTextY;
        this._popupContainer.addChild(this._popupText);
    }

    initPopupButtons() {
        console.log('initPopupButtons');
        this.initOkButton();
        this.initCancelButton();
        this._okButton.x = this._buttonX;
        this._okButton.y = this._buttonY;
        this._cancelButton.x = this._buttonX;
        this._cancelButton.y = this._buttonY;
        this.makeButtonSpacing();
        this._popupContainer.addChild(this._okButton, this._cancelButton);
    }

    initOkButton() {
        console.log('initOkButton');
        this.drawOkButtonBG();
        this.initOkButtonText();
        this._okButton.on('pointerdown', () => {
            console.log('OK button clicked');
            this.popupOut(-1000, 1000);
        });
    }

    drawOkButtonBG() {
        const okButtonGraphics = new Graphics();
        const okButtonFill = this._okButtonStyle.okButtonFill || 0x000000;
        const okButtonAlpha = this._okButtonStyle.okButtonAlpha || 0.5;
        const okButtonRadius = this._okButtonStyle.okButtonRadius || 10;
        const okButtonStrokeColor = this._okButtonStyle.okButtonStrokeColor || 0x000000;
        const okButtonStrokeWidth = this._okButtonStyle.okButtonStrokeWidth || 0;
        const strokeFillStyle = {
            color: okButtonStrokeColor,
            alpha: okButtonAlpha,
            width: okButtonStrokeWidth,
        }
        okButtonStrokeWidth ? okButtonGraphics
        .fill(okButtonFill, okButtonAlpha).stroke(strokeFillStyle)
        .roundRect(-this._buttonWidth / 2, -this._buttonHeight / 2, this._buttonWidth, this._buttonHeight, okButtonRadius).endFill() : 
        okButtonGraphics.fill(okButtonFill, okButtonAlpha)
        .roundRect(-this._buttonWidth / 2, -this._buttonHeight / 2, this._buttonWidth, this._buttonHeight, okButtonRadius).endFill();
        this._okButton.addChild(okButtonGraphics);
    }

    initOkButtonText() {
        const okButtonText = new Text('OK', this._okButtonTextStyle);
        okButtonText.anchor.set(0.5);
        okButtonText.x = 0;
        okButtonText.y = 0;
        this._okButton.addChild(okButtonText);
    }

    initCancelButton() {
        console.log('initCancelButton');
        this.drawCancelButtonBG();
        this.initCancelButtonText();
        this._cancelButton.on('pointerdown', () => {
            console.log('Cancel button clicked');
            this.popupOut(-1000, 1000);
        });
    }

    drawCancelButtonBG() {
        const cancelButtonGraphics = new Graphics();
        const cancelButtonFill = this._cancelButtonStyle.cancelButtonFill || 0x000000;
        const cancelButtonAlpha = this._cancelButtonStyle.cancelButtonAlpha || 0.5;
        const cancelButtonRadius = this._cancelButtonStyle.cancelButtonRadius || 10;
        const cancelButtonStrokeColor = this._cancelButtonStyle.cancelButtonStrokeColor || 0x000000;
        const cancelButtonStrokeWidth = this._cancelButtonStyle.cancelButtonStrokeWidth || 0;
        const strokeFillStyle = {
            color: cancelButtonStrokeColor,
            alpha: cancelButtonAlpha,
            width: cancelButtonStrokeWidth,
        }
        cancelButtonStrokeWidth ? cancelButtonGraphics
        .beginFill(cancelButtonFill, cancelButtonAlpha).stroke(strokeFillStyle)
        .drawRoundedRect(-this._buttonWidth / 2, -this._buttonHeight / 2, this._buttonWidth, this._buttonHeight, cancelButtonRadius).endFill() : 
        cancelButtonGraphics.beginFill(cancelButtonFill, cancelButtonAlpha)
        .drawRoundedRect(-this._buttonWidth / 2, -this._buttonHeight / 2, this._buttonWidth, this._buttonHeight, cancelButtonRadius).endFill();
        this._cancelButton.addChild(cancelButtonGraphics);
    }

    initCancelButtonText() {
        const cancelButtonText = new Text('Cancel', this._cancelButtonTextStyle);
        cancelButtonText.anchor.set(0.5);
        cancelButtonText.x = 0;
        cancelButtonText.y = 0;
        this._cancelButton.addChild(cancelButtonText);
    }

    makeButtonSpacing() {
        this._okButton.x = this._buttonX - this._buttonOffsetX - this._buttonWidth / 2;
        this._cancelButton.x = this._buttonX + this._buttonOffsetX + this._buttonWidth / 2;
    }

    switchToButtonlessPopup() {
        this._popupContainer.removeChild(this._okButton);
        this._popupContainer.removeChild(this._cancelButton);
        this.redrawPopupBGWithoutButtons();
    }

    redrawPopupBGWithoutButtons() {
        this._bgGraphics.clear();
        this._popupContainer.removeChild(this._okButton, this._cancelButton, this._popupText, this._bgGraphics);

        // Calculate the new width and height
        const newBgWidth = Math.max(this._bgWidth, this._popupText.width);
        // const newBgHeight = Math.max(this._bgHeight, this._popupText.height);
        const newBgHeight = this._bgHeight;

        // Redraw the background with the new dimensions
        const bgFill = this._params.bgStyle.bgFill || 0x000000;
        const bgAlpha = this._params.bgStyle.bgAlpha || 0.5;
        const bgRadius = this._params.bgStyle.bgRadius || 10;
        const bgStrokeColor = this._params.bgStyle.bgStrokeColor || 0x000000;
        const bgStrokeWidth = this._params.bgStyle.bgStrokeWidth || 0;
        const strokeFillStyle = {
            color: bgStrokeColor,
            alpha: bgAlpha,
            width: bgStrokeWidth,
        };

        if (bgStrokeWidth) {
            this._bgGraphics.beginFill(bgFill, bgAlpha)
                .lineStyle(strokeFillStyle.width, strokeFillStyle.color, strokeFillStyle.alpha)
                .drawRoundedRect(-newBgWidth / 2, -newBgHeight / 2, newBgWidth, newBgHeight, bgRadius)
                .endFill();
        } else {
            this._bgGraphics.beginFill(bgFill, bgAlpha)
                .drawRoundedRect(-newBgWidth / 2, -newBgHeight / 2, newBgWidth, newBgHeight, bgRadius)
                .endFill();
        }
        this._popupText.y = this._bgGraphics.y;

        this._popupContainer.addChild(this._bgGraphics, this._popupText);
    }

    switchToButtonPopup() { 
        console.log('switchToButtonPopup!!!!!!');
        this.redrawPopupBGForButtons();
    }

    redrawPopupBGForButtons() {
        this._bgGraphics.clear();
        this._popupContainer.removeChild(this._okButton, this._cancelButton, this._popupText, this._bgGraphics);

        // Calculate the new width and height
        const buttonWidth = this._params.buttonWidth || 100;
        const buttonHeight = this._params.buttonHeight || 50;
        const buttonOffsetX = this._params.buttonOffsetX || 20;
        const buttonOffsetY =  20;
    
        const numButtons = 2;
        const totalButtonWidth = numButtons * buttonWidth + (numButtons - 1) * buttonOffsetX;
        const totalButtonHeight = buttonHeight;
    
        const newBgWidth = Math.max(this._bgWidth, totalButtonWidth + 2 * buttonOffsetX);
        const newBgHeight = Math.max(this._bgHeight, totalButtonHeight + this._popupText.height + 2 * buttonOffsetY);
    
        // Redraw the background with the new dimensions
        const bgFill = this._params.bgStyle.bgFill || 0x000000;
        const bgAlpha = this._params.bgStyle.bgAlpha || 0.5;
        const bgRadius = this._params.bgStyle.bgRadius || 10;
        const bgStrokeColor = this._params.bgStyle.bgStrokeColor || 0x000000;
        const bgStrokeWidth = this._params.bgStyle.bgStrokeWidth || 0;
        const strokeFillStyle = {
            color: bgStrokeColor,
            alpha: bgAlpha,
            width: bgStrokeWidth,
        };
    
        if (bgStrokeWidth) {
            this._bgGraphics.beginFill(bgFill, bgAlpha)
                .lineStyle(strokeFillStyle.width, strokeFillStyle.color, strokeFillStyle.alpha)
                .drawRoundedRect(-newBgWidth / 2, -newBgHeight / 2, newBgWidth, newBgHeight, bgRadius)
                .endFill();
        } else {
            this._bgGraphics.beginFill(bgFill, bgAlpha)
                .drawRoundedRect(-newBgWidth / 2, -newBgHeight / 2, newBgWidth, newBgHeight, bgRadius)
                .endFill();
        }
    
        this._popupContainer.addChild(this._bgGraphics, this._popupText, this._okButton, this._cancelButton);
    }

    redrawPopupBG() {
        if (this._popupContainer.children.includes(this._okButton) && this._popupContainer.children.includes(this._cancelButton)) {
            this.redrawPopupBGForButtons();
        } else {
            this.redrawPopupBGWithoutButtons();
        }
    }

    popupIn(initialY: number, duration: number) {
        this._popupContainer.y = initialY;
        this._popupContainer.visible = true;
        ease.add(this._popupContainer, { x: this._x, y: this._y }, { duration: duration });
    }
    popupOut(resultingY: number, duration: number) {
        ease.add(this._popupContainer, { x: this._x, y: resultingY }, { duration: duration});
    }
}