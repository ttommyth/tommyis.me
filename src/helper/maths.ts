import seedrandom from 'seedrandom';

// Standard Normal variate using Box-Muller transform.
export function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

export function getDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Seedable pseudo-random number generator using seedrandom
export class RandomMachine {
  private rng: seedrandom.PRNG;

  constructor(seed: number | string) {
    this.rng = seedrandom(seed.toString());
  }

  // Returns a uniform random number in [0, 1)
  random(): number {
    return this.rng();
  }

  // alias for random()
  next(): number {
    return this.random();
  }

  // Standard normal variate using Box-Muller transform
  gaussianRandom(mean = 0, stdev = 1): number {
    const u = 1 - this.random();
    const v = this.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdev + mean;
  }
}

// Create a new seeded random machine
export function createSeededRandomMachine(
  seed: number | string,
): RandomMachine {
  return new RandomMachine(seed);
}

// Seed the global Math.random with a seeded generator (overrides Math.random)
export function seedMathRandom(seed: number | string): void {
  Math.random = seedrandom(seed.toString());
}
