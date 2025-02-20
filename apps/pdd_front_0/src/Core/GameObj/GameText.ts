import { GameObj } from './GameObj';
import { Text, TextStyle } from 'pixi.js';
import { OrientedHelper } from './OrientedHelper';

export class GameText extends GameObj {
  public text: Text;
  protected orientedHelperText: OrientedHelper | undefined;

  constructor(config: any) {
    super(config);

    if (!config.text || !config.text.content) {
      throw new Error('GameText requires a valid text configuration.');
    }

    const style = new TextStyle({
      fontFamily: config.text.fontFamily || 'Arial',
      fontSize: config.text.fontSize || 40,
      fill: config.text.fill || '#ffffff',
      stroke: config.text.stroke || false,
      dropShadow: config.text.dropShadow || false,
      fontWeight: config.text.fontWeight || 'normal',
    });

    this.text = new Text({
      text: config.text.content,
      style: style,
    });

    if (config.text.position) {
      this.text.position.set(
        config.text.position.x || 0,
        config.text.position.y || 0
      );
    }

    if (config.text.anchor) {
      this.text.anchor.set(config.text.anchor.x, config.text.anchor.y);
    }

    if (config.text.scale) {
      this.text.scale.set(config.text.scale.x, config.text.scale.y);
    }

    if (config.text.alpha !== undefined) {
      this.text.alpha = config.text.alpha;
    }

    if (config.text.oriented) {
      this.orientedHelperText = new OrientedHelper(
        this.text,
        config.text.oriented
      );
    }

    this.addChild(this.text);
  }

  public setText(newText: string): void {
    this.text.text = newText;
  }
}
