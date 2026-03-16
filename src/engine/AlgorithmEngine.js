/**
 * Core Algorithm Execution Engine
 * Decouples algorithm logic from UI and visualization.
 */
class AlgorithmEngine {
  constructor(generatorFn, params) {
    this.generatorFn = generatorFn;
    this.params = params;
    this.steps = [];
    this.currentStepIndex = -1;
    this.isComplete = false;
    this.generator = this.generatorFn(this.params);
  }

  /**
   * Execute the next step of the algorithm
   * Returns the state of the algorithm after the step.
   */
  stepForward() {
    // If we've already cached this step, just move forward
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      return this.steps[this.currentStepIndex];
    }

    // Otherwise, generate the next step if not complete
    if (this.isComplete) return null;

    const { value, done } = this.generator.next();
    
    if (done) {
      this.isComplete = true;
      return null;
    }

    // Cache the step for backward navigation
    this.steps.push(value);
    this.currentStepIndex++;
    return value;
  }

  /**
   * Go back one step
   * Returns the previously cached state.
   */
  stepBackward() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      return this.steps[this.currentStepIndex];
    }
    return null;
  }

  reset(newParams) {
    this.params = newParams || this.params;
    this.steps = [];
    this.currentStepIndex = -1;
    this.isComplete = false;
    this.generator = this.generatorFn(this.params);
    return null;
  }

  getCurrentStep() {
    return this.steps[this.currentStepIndex] || null;
  }

  getHistory() {
    return this.steps;
  }
}

export default AlgorithmEngine;
