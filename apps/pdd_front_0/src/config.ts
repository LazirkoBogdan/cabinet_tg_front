export const CONFIG = {
  GAME: {
    WIDTH: 1280, // Canvas width
    HEIGHT: 720, // Canvas height
    BACKGROUND_COLOR: 0x222222, // Background color of the game
    FPS: 60, // Frames per second
  },
  PERS: {
    INITIAL_HUNGER: 100, // Initial hunger level
    INITIAL_HAPPINESS: 100, // Initial happiness level
    INITIAL_ENERGY: 100, // Initial energy level
    HUNGER_DECREASE_RATE: 1, // Rate of hunger decrease (per second)
    HAPPINESS_DECREASE_RATE: 0.5, // Rate of happiness decrease (per second)
    ENERGY_DECREASE_RATE: 0.75, // Energy consumption rate
  },
  SCRATCH: {
    COINS_PER_CLICK: 1, // Number of coins per click
    BONUS_MULTIPLIER: 2, // Multiplier for bonus clicks
    BONUS_CHANCE: 0.1, // Chance to get a bonus (10%)
  },
  ROOM: {
    DEFAULT_THEME: 'classic', // Default room theme
    ITEM_PRICE_MULTIPLIER: 1.2, // Price increase multiplier for items
  },
  TON: {
    ENABLED: true, // TON integration enabled
    CURRENCY: 'TON', // Currency type
    ITEM_PURCHASE_COST: 0.05, // Cost of an item in TON
    WALLET_CONNECT_URL: 'https://ton-wallet.com/connect', // URL to connect wallet
  },
  STORAGE: {
    LOCAL_STORAGE_KEY: 'cat_game_save', // Key for local storage
    AUTO_SAVE_INTERVAL: 30, // Auto-save interval (in seconds)
  },
};
