class StateMachine<T> {
  // Static instance to ensure a single instance (Singleton)
  private static instance: StateMachine<any> | null = null;
  private currentState: T; // Holds the current state
  private states: Map<T, Function>; // Stores states and their associated handlers

  // Private constructor to prevent direct instantiation
  private constructor(initialState: T) {
    this.currentState = initialState;
    this.states = new Map();
  }

  // Static method to get the single instance of the StateMachine
  public static getInstance<T>(initialState: T): StateMachine<T> {
    // If the instance doesn't exist, create it
    if (!StateMachine.instance) {
      StateMachine.instance = new StateMachine<T>(initialState);
    }
    // Return the singleton instance
    return StateMachine.instance as StateMachine<T>;
  }

  // Method to add a state and its handler
  public addState(state: T, handler: Function): void {
    this.states.set(state, handler);
  }

  // Method to change the current state and trigger its handler
  public changeState(state: T): void {
    if (this.states.has(state)) {
      this.currentState = state;
      this.states.get(state)?.(); // Call the handler for the new state
    } else {
      console.error(`State '${String(state)}' not defined`);
    }
  }

  // Method to get the current state
  public getCurrentState(): T {
    return this.currentState;
  }
}
