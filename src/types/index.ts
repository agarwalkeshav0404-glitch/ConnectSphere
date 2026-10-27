/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface UserPublicProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  city: string;
  locality?: string;
  bio?: string;
  interests: string[];
  createdAt: string;
  isDemoUser?: boolean;
}

export interface UserPrivateInfo {
  userId: string;
  email: string;
  phone?: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
}

export interface User extends UserPublicProfile {
  // Joined representation for authenticated session in local mode
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: Gender;
  onboardingCompleted: boolean;
}

export type ActivityCategory =
  | 'Trekking & Outdoors'
  | 'Travel & Trips'
  | 'Sports & Fitness'
  | 'Movies & Entertainment'
  | 'Food & Cafes'
  | 'Gaming & Esports'
  | 'Music & Concerts'
  | 'Tech & Workshops'
  | 'Arts & Culture'
  | 'Board Games & Social';

export type CostMode = 'free' | 'per_person' | 'total_shared';

export type ActivityStatus = 'active' | 'full' | 'cancelled' | 'completed';

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  city: string;
  location: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  participantLimit: number;
  approvedParticipantIds: string[];
  costMode: CostMode;
  costAmount: number; // 0 for free, per person or total
  requiredInterests: string[];
  status: ActivityStatus;
  createdAt: string;
  bannerColor?: string; // High-aesthetic gradient identifier
  imageUrl?: string;
}

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ActivityRequest {
  id: string;
  activityId: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  requesterCity: string;
  message?: string;
  status: JoinRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderCity: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  status: FriendRequestStatus;
  createdAt: string;
}

export interface UserBlock {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
}

export interface MatchScoreResult {
  userId: string;
  targetUserId: string;
  overallScore: number; // 0 - 100
  interestScore: number; // 0 - 100
  cityScore: number | null; // 0 or 100, null if missing
  categoryScore: number; // 0 - 100
  sharedInterests: string[];
  explanation: string[];
  isAvailable: boolean;
}

export type StorageMode = 'local_demo' | 'supabase_configured';
