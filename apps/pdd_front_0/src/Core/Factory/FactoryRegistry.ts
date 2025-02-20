// FactoryRegistry.ts
type Constructor<T> = new (config: any) => T;

import { GameSprite } from '../GameObj/GameSprite';
import { GameText } from '../GameObj/GameText';

export class FactoryRegistry {
  private static instance: FactoryRegistry;
  private registry: Map<string, Constructor<any>> = new Map();

  private constructor() {}

  public static getInstance(): FactoryRegistry {
    if (!FactoryRegistry.instance) {
      FactoryRegistry.instance = new FactoryRegistry();
    }
    return FactoryRegistry.instance;
  }

  public register<T>(key: string, ctor: Constructor<T>): void {
    if (this.registry.has(key)) {
      throw new Error(`Class with key "${key}" is already registered.`);
    }
    this.registry.set(key, ctor);
  }

  public create<T>(key: string, config: any): T {
    const ctor = this.registry.get(key);
    if (!ctor) {
      throw new Error(`No class registered with key "${key}".`);
    }
    return new ctor(config);
  }

  public registerDefaults(): void {
    this.register('GameSprite', GameSprite);
    this.register('GameText', GameText);
  }
}
