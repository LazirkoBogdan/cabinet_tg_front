export const GameScene = {
  id: 'gameScene',
  visible: true,
  objects: [
    {
      type: 'GameSprite',
      config: {
        id: 'bg',
        sprite: {
          texture: 'background_gameroom.png',
          anchor: { x: 0.5, y: 0.5 },
        },
        oriented: true,
        land: {
          position: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
          alpha: 1,
        },
        port: {
          position: { x: 0, y: 0 },
          scale: { x: 0.8, y: 0.8 },
          alpha: 1,
        },
      },
    },
    {
      type: 'GameSprite',
      config: {
        id: 'showe',
        sprite: {
          texture: 'icon_status_shower.png',
          anchor: { x: 0.5, y: 0.5 },
        },
        oriented: true,
        land: { position: { x: 400, y: 300 }, scale: { x: 1, y: 1 }, alpha: 1 },
        port: {
          position: { x: 200, y: 100 },
          scale: { x: 0.8, y: 0.8 },
          alpha: 0.8,
        },
      },
    },
    {
      type: 'GameText',
      config: {
        id: 'titleText',
        text: {
          content: 'Welcome to the Game!',
          fontFamily: 'Arial',
          fontSize: 60,
          fill: '#ffffff',
          stroke: { color: '#004620', width: 4 },
          dropShadow: {
            color: '#111111',
            blur: 3,
            angle: 2.1,
            distance: 5,
          },
          position: { x: 960, y: 100 },
          anchor: { x: 0.5, y: 0.5 },
        },
      },
    },
    {
      type: 'GameText',
      config: {
        id: 'scoreText',
        text: {
          content: 'Score: 0',
          fontFamily: 'Verdana',
          fontSize: 40,
          fill: '#ffcc00',
          stroke: { color: '#000000', width: 5 },

          oriented: true,
          land: {
            position: { x: 400, y: 300 },
          },
          port: {
            position: { x: 200, y: 100 },
          },
        },
      },
    },
    {
      type: 'GameText',
      config: {
        id: 'footerText',
        text: {
          content: 'Powered by PixiJS 8',
          fontFamily: 'Courier New',
          fontSize: 30,
          fill: '#aaaaaa',
          position: { x: 960, y: 1000 },
          anchor: { x: 0.5, y: 1 },
        },
      },
    },
  ],
};
