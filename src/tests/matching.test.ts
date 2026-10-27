/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import {
  BASE_WEIGHTS,
  calculateMatchScore,
  computeCategoryScore,
  computeCityScore,
  computeJaccardSimilarity,
} from '../matching/matching';

describe('Jaccard Similarity Calculation', () => {
  it('returns 1.0 for identical non-empty interest sets', () => {
    const setA = ['Trekking', 'Photography', 'Cafes'];
    const setB = ['Trekking', 'Photography', 'Cafes'];
    const score = computeJaccardSimilarity(setA, setB);
    expect(score).toBe(1.0);
  });

  it('returns 0.0 for completely disjoint sets', () => {
    const setA = ['Cricket', 'Football'];
    const setB = ['Art and culture', 'Movies'];
    const score = computeJaccardSimilarity(setA, setB);
    expect(score).toBe(0.0);
  });

  it('calculates exact fractional intersection over union for partial overlap', () => {
    // A = {Trekking, Photography, Cafes} (|A| = 3)
    // B = {Trekking, Cycling} (|B| = 2)
    // Intersection = {Trekking} (1)
    // Union = {Trekking, Photography, Cafes, Cycling} (4)
    // J(A, B) = 1 / 4 = 0.25
    const setA = ['Trekking', 'Photography', 'Cafes'];
    const setB = ['Trekking', 'Cycling'];
    const score = computeJaccardSimilarity(setA, setB);
    expect(score).toBeCloseTo(0.25, 4);
  });

  it('handles case-insensitivity and whitespace trimming gracefully', () => {
    const setA = [' trekking ', 'PHOTOGRAPHY'];
    const setB = ['Trekking', 'photography'];
    const score = computeJaccardSimilarity(setA, setB);
    expect(score).toBe(1.0);
  });

  it('returns null when both sets are empty (prevents fabricated compatibility)', () => {
    const score = computeJaccardSimilarity([], []);
    expect(score).toBeNull();
  });
});

describe('City Match Score', () => {
  it('returns 100 for exact case-insensitive match', () => {
    expect(computeCityScore('Bengaluru', 'bengaluru')).toBe(100);
    expect(computeCityScore('  Bengaluru  ', 'Bengaluru')).toBe(100);
  });

  it('returns 0 for different cities', () => {
    expect(computeCityScore('Bengaluru', 'Mysuru')).toBe(0);
  });

  it('returns null when either city is missing or empty', () => {
    expect(computeCityScore(undefined, 'Bengaluru')).toBeNull();
    expect(computeCityScore('', 'Bengaluru')).toBeNull();
  });
});

describe('Composite Companion Matching with Weight Renormalization', () => {
  it('scores 100% for identical profiles in the same city', () => {
    const userA = {
      id: 'a',
      city: 'Bengaluru',
      interests: ['Trekking', 'Camping', 'Photography'],
    };
    const userB = {
      id: 'b',
      city: 'Bengaluru',
      interests: ['Trekking', 'Camping', 'Photography'],
    };

    const result = calculateMatchScore(userA, userB);
    expect(result.overallScore).toBe(100);
    expect(result.interestScore).toBe(100);
    expect(result.cityScore).toBe(100);
    expect(result.isAvailable).toBe(true);
    expect(result.sharedInterests).toHaveLength(3);
  });

  it('renormalizes weights correctly when city information is missing', () => {
    const userA = {
      id: 'a',
      city: '',
      interests: ['Trekking', 'Camping'],
    };
    const userB = {
      id: 'b',
      city: '',
      interests: ['Trekking', 'Camping'],
    };

    const result = calculateMatchScore(userA, userB);
    // City is null, available weights = interest (0.60) + category (0.15) = 0.75
    // Interest is 100, category is 100 -> score should be 100
    expect(result.cityScore).toBeNull();
    expect(result.overallScore).toBe(100);
  });

  it('returns isAvailable: false and informative message when no components can be evaluated', () => {
    const userA = { id: 'a', city: '', interests: [] };
    const userB = { id: 'b', city: '', interests: [] };

    const result = calculateMatchScore(userA, userB);
    expect(result.isAvailable).toBe(false);
    expect(result.overallScore).toBe(0);
    expect(result.explanation[0]).toMatch(/Not enough information/);
  });
});
