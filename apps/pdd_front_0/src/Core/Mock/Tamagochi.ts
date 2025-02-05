class Tamagotchi {
  private name: string;
  private hunger: number;
  private thirst: number;
  private energy: number;
  private happiness: number;
  private boredom: number;
  private health: number;
  private age: number;
  private isAlive: boolean;

  constructor(name: string) {
    this.name = name;
    this.hunger = 50; // 0 - full, 100 - very hungry
    this.thirst = 50; // 0 - hydrated, 100 - very thirsty
    this.energy = 50; // 0 - exhausted, 100 - fully energized
    this.happiness = 50; // 0 - sad, 100 - very happy
    this.boredom = 50; // 0 - engaged, 100 - bored
    this.health = 100; // 0 - sick, 100 - healthy
    this.age = 0; // Age in days
    this.isAlive = true;

    this.startLifeCycle();
  }

  private startLifeCycle() {
    setInterval(() => {
      if (!this.isAlive) return;

      this.hunger += 5;
      this.thirst += 4;
      this.energy -= 5;
      this.happiness -= 3;
      this.boredom += 4;
      this.age += 1;

      if (
        this.hunger >= 100 ||
        this.thirst >= 100 ||
        this.energy <= 0 ||
        this.happiness <= 0 ||
        this.health <= 0
      ) {
        this.isAlive = false;
        console.log(`${this.name} has passed away :(`);
      }
    }, 5000); // Updates every 5 seconds
  }

  feed() {
    if (!this.isAlive) return;
    this.hunger = Math.max(0, this.hunger - 20);
    console.log(`${this.name} has eaten!`);
  }

  drink() {
    if (!this.isAlive) return;
    this.thirst = Math.max(0, this.thirst - 20);
    console.log(`${this.name} has drunk water!`);
  }

  play() {
    if (!this.isAlive) return;
    this.happiness = Math.min(100, this.happiness + 15);
    this.energy = Math.max(0, this.energy - 10);
    this.boredom = Math.max(0, this.boredom - 15);
    console.log(`${this.name} is playing!`);
  }

  sleep() {
    if (!this.isAlive) return;
    this.energy = Math.min(100, this.energy + 25);
    console.log(`${this.name} is sleeping.`);
  }

  wakeUp() {
    if (!this.isAlive) return;
    this.energy = Math.min(100, this.energy + 10);
    console.log(`${this.name} has woken up!`);
  }

  getStatus() {
    if (!this.isAlive) {
      console.log(`${this.name} is no longer with us.`);
      return;
    }
    console.log(
      `${this.name} - Hunger: ${this.hunger}, Thirst: ${this.thirst}, Energy: ${this.energy}, Happiness: ${this.happiness}, Boredom: ${this.boredom}, Health: ${this.health}, Age: ${this.age}`
    );
  }
}

// // Example usage
// const pet = new Tamagotchi('Spinach');
// pet.getStatus();
// setTimeout(() => pet.feed(), 6000);
// setTimeout(() => pet.drink(), 8000);
// setTimeout(() => pet.play(), 10000);
// setTimeout(() => pet.sleep(), 15000);
// setTimeout(() => pet.wakeUp(), 20000);
