/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MatchScoreResult, UserPublicProfile } from '../types';

/**
 * Mapping of individual interests to overarching activity categories
 * for calculating category-level synergy.
 */
export const INTEREST_TO_CATEGORY_MAP: Record<string, string> = {
  'Trekking': 'Trekking & Outdoors',
  'Camping': 'Trekking & Outdoors',
  'Travelling': 'Travel & Trips',
  'Road trips': 'Travel & Trips',
  'Movies': 'Movies & Entertainment',
  'Cricket': 'Sports & Fitness',
  'Football': 'Sports & Fitness',
  'Badminton': 'Sports & Fitness',
  'Running': 'Sports & Fitness',
  'Cycling': 'Sports & Fitness',
  'Gym and fitness': 'Sports & Fitness',
  'Gaming': 'Gaming & Esports',
  'Board games': 'Board Games & Social',
  'Photography': 'Arts & Culture',
  'Art and culture': 'Arts & Culture',
  'Music': 'Music & Concerts',
  'Food exploration': 'Food & Cafes',
  'Cafes': 'Food & Cafes',
  'Racing and motorsports': 'Sports & Fitness',
  'Technology events': 'Tech & Workshops',
};

/**
 * Computes Jaccard Similarity between two sets of strings:
 * J(A, B) = |A ∩ B| / |A ∪ B|
 * Returns a value between 0.0 and 1.0, or null if both sets are empty.
 */
export function computeJaccardSimilarity(setA: string[], setB: string[]): number | null {
  const normA = new Set(setA.map((s) => s.trim().toLowerCase()).filter(Boolean));
  const normB = new Set(setB.map((s) => s.trim().toLowerCase()).filter(Boolean));

  if (normA.size === 0 && normB.size === 0) {
    return null; // Both empty -> unavailable per requirements
  }

  const union = new Set([...normA, ...normB]);
  if (union.size === 0) return null;

  let intersectionCount = 0;
  for (const item of normA) {
    if (normB.has(item)) {
      intersectionCount++;
    }
  }

  return intersectionCount / union.size;
}

/**
 * Computes city match score.
 * 100 if same city (case-insensitive), 0 if different, null if missing.
 */
export function computeCityScore(cityA?: string | null, cityB?: string | null): number | null {
  const cA = cityA?.trim().toLowerCase();
  const cB = cityB?.trim().toLowerCase();

  if (!cA || !cB) return null;
  return cA === cB ? 100 : 0;
}

/**
 * Extracts distinct activity categories from a user's interest list.
 */
export function getCategoriesFromInterests(interests: string[]): string[] {
  const categories = new Set<string>();
  for (const interest of interests) {
    const category = INTEREST_TO_CATEGORY_MAP[interest];
    if (category) {
      categories.add(category);
    }
  }
  return Array.from(categories);
}

/**
 * Computes category-level overlap using Jaccard on derived categories.
 */
export function computeCategoryScore(interestsA: string[], interestsB: string[]): number | null {
  const catsA = getCategoriesFromInterests(interestsA);
  const catsB = getCategoriesFromInterests(interestsB);

  const jaccard = computeJaccardSimilarity(catsA, catsB);
  if (jaccard === null) return null;
  return jaccard * 100;
}

/**
 * Standard baseline weights:
 * Interest: 60% (0.60)
 * City: 25% (0.25)
 * Category: 15% (0.15)
 */
export const BASE_WEIGHTS = {
  interest: 0.60,
  city: 0.25,
  category: 0.15,
};

/**
 * Calculates a transparent, rule-based matching score between two users
 * with dynamic weight renormalization for missing fields.
 */
export function calculateMatchScore(
  userA: Pick<UserPublicProfile, 'id' | 'city' | 'interests'>,
  userB: Pick<UserPublicProfile, 'id' | 'city' | 'interests'>
): MatchScoreResult {
  const normInterestsA = new Set((userA.interests || []).map((i) => i.trim()));
  const normInterestsB = new Set((userB.interests || []).map((i) => i.trim()));

  const sharedInterests = (userA.interests || []).filter((i) => normInterestsB.has(i.trim()));

  const jaccard = computeJaccardSimilarity(userA.interests || [], userB.interests || []);
  const interestScore = jaccard !== null ? Math.round(jaccard * 100) : null;

  const cityScore = computeCityScore(userA.city, userB.city);
  const categoryScore = computeCategoryScore(userA.interests || [], userB.interests || []);

  // Weight Renormalization: sum weights of available components
  let totalAvailableWeight = 0;
  let weightedScoreSum = 0;

  if (interestScore !== null) {
    totalAvailableWeight += BASE_WEIGHTS.interest;
    weightedScoreSum += interestScore * BASE_WEIGHTS.interest;
  }
  if (cityScore !== null) {
    totalAvailableWeight += BASE_WEIGHTS.city;
    weightedScoreSum += cityScore * BASE_WEIGHTS.city;
  }
  if (categoryScore !== null) {
    totalAvailableWeight += BASE_WEIGHTS.category;
    weightedScoreSum += categoryScore * BASE_WEIGHTS.category;
  }

  const isAvailable = totalAvailableWeight > 0;
  const overallScore = isAvailable
    ? Math.min(100, Math.max(0, Math.round(weightedScoreSum / totalAvailableWeight)))
    : 0;

  // Generate transparent human explanations
  const explanation: string[] = [];

  if (sharedInterests.length > 0) {
    const preview = sharedInterests.slice(0, 3).join(', ');
    const more = sharedInterests.length > 3 ? ` and ${sharedInterests.length - 3} more` : '';
    explanation.push(
      `You share ${sharedInterests.length} interest${sharedInterests.length > 1 ? 's' : ''} (${preview}${more})`
    );
  } else if (interestScore !== null && interestScore === 0) {
    explanation.push('Different personal interest areas to explore together');
  }

  if (cityScore === 100 && userA.city) {
    explanation.push(`Both based in ${userA.city}`);
  } else if (cityScore === 0 && userA.city && userB.city) {
    explanation.push(`Located in different cities (${userA.city} · ${userB.city})`);
  }

  if (categoryScore !== null && categoryScore > 40) {
    explanation.push('High category overlap in recreation preferences');
  }

  if (!isAvailable) {
    explanation.push('Not enough information to compute compatibility');
  }

  return {
    userId: userA.id,
    targetUserId: userB.id,
    overallScore,
    interestScore: interestScore ?? 0,
    cityScore,
    categoryScore: categoryScore !== null ? Math.round(categoryScore) : 0,
    sharedInterests,
    explanation,
    isAvailable,
  };
}
