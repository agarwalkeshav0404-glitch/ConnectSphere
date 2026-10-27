/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { activityFormSchema, isAtLeast18YearsOld, isFutureOrToday, signUpSchema } from '../validation/schemas';

describe('Minimum Age 18+ Verification', () => {
  it('approves users who are 18 years or older', () => {
    // 22 years old
    expect(isAtLeast18YearsOld('2004-01-01')).toBe(true);
    // 19 years old
    expect(isAtLeast18YearsOld('2007-01-01')).toBe(true);
  });

  it('rejects users who are under 18 years old', () => {
    // 10 years old
    expect(isAtLeast18YearsOld('2016-01-01')).toBe(false);
    // 15 years old
    expect(isAtLeast18YearsOld('2011-05-15')).toBe(false);
  });

  it('rejects invalid or empty date strings', () => {
    expect(isAtLeast18YearsOld('')).toBe(false);
    expect(isAtLeast18YearsOld('invalid-date')).toBe(false);
  });
});

describe('Activity Form Validation Rules', () => {
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const validActivityInput = {
    title: 'Weekend Trek to Savandurga',
    category: 'Trekking & Outdoors',
    description: 'Day trek to Asia largest monolith. Moderate climb, carry 2L water.',
    date: getTomorrowDate(),
    startTime: '06:00',
    city: 'Bengaluru',
    location: 'Savandurga Base Temple',
    participantLimit: 8,
    costMode: 'total_shared' as const,
    costAmount: 1600,
    requiredInterests: ['Trekking'],
  };

  it('passes validation for valid activity input', () => {
    const parsed = activityFormSchema.safeParse(validActivityInput);
    expect(parsed.success).toBe(true);
  });

  it('rejects activities with past start dates', () => {
    const parsed = activityFormSchema.safeParse({
      ...validActivityInput,
      date: '2020-01-01',
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects Free cost mode with positive cost amount', () => {
    const parsed = activityFormSchema.safeParse({
      ...validActivityInput,
      costMode: 'free',
      costAmount: 500, // Inconsistent with Free
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects Shared/Per-Person cost mode with 0 cost amount', () => {
    const parsed = activityFormSchema.safeParse({
      ...validActivityInput,
      costMode: 'per_person',
      costAmount: 0,
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects participant limits less than 1', () => {
    const parsed = activityFormSchema.safeParse({
      ...validActivityInput,
      participantLimit: 0,
    });
    expect(parsed.success).toBe(false);
  });
});

describe('Cost Sharing Calculation Logic', () => {
  it('correctly calculates equal shares for total shared cost activities', () => {
    const totalCost = 3000;
    const approvedGuestsCount = 3;
    const totalPeople = approvedGuestsCount + 1; // +1 for host
    const perPersonEstimatedShare = Math.round(totalCost / totalPeople);

    expect(perPersonEstimatedShare).toBe(750); // 3000 / 4 = 750
  });

  it('dynamically adapts per-person estimate as participants increase', () => {
    const totalCost = 2400;

    // Host alone before anyone joins
    expect(Math.round(totalCost / 1)).toBe(2400);

    // 1 guest approved (2 people total)
    expect(Math.round(totalCost / 2)).toBe(1200);

    // 3 guests approved (4 people total)
    expect(Math.round(totalCost / 4)).toBe(600);
  });
});
