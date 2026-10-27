/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Activity,
  ActivityRequest,
  FriendRequest,
  MatchScoreResult,
  User,
  UserBlock,
  UserPublicProfile,
} from '../../types';
import { ActivityFormData, ProfileUpdateFormData, SignUpFormData } from '../../validation/schemas';

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  signIn(email: string): Promise<User>;
  signUp(data: SignUpFormData): Promise<User>;
  signOut(): Promise<void>;
  switchDemoUser(userId: string): Promise<User>;
  getAllDemoUsers(): Promise<User[]>;
}

export interface IUserRepository {
  getUserProfile(userId: string): Promise<UserPublicProfile | null>;
  updateProfile(userId: string, data: ProfileUpdateFormData): Promise<User>;
  getAllUsers(): Promise<UserPublicProfile[]>;
  resetDatabaseToSeeds(): Promise<void>;
}

export interface IActivityRepository {
  getActivities(): Promise<Activity[]>;
  getActivityById(id: string): Promise<Activity | null>;
  createActivity(data: ActivityFormData, creator: User): Promise<Activity>;
  updateActivity(id: string, data: Partial<ActivityFormData>, userId: string): Promise<Activity>;
  cancelActivity(id: string, userId: string): Promise<Activity>;
}

export interface IRequestRepository {
  createJoinRequest(activityId: string, requester: User, message?: string): Promise<ActivityRequest>;
  cancelJoinRequest(requestId: string, requesterId: string): Promise<ActivityRequest>;
  approveJoinRequest(requestId: string, hostId: string): Promise<{ request: ActivityRequest; activity: Activity }>;
  rejectJoinRequest(requestId: string, hostId: string): Promise<ActivityRequest>;
  leaveActivity(activityId: string, userId: string): Promise<Activity>;
  getRequestsForActivity(activityId: string): Promise<ActivityRequest[]>;
  getRequestsByRequester(requesterId: string): Promise<ActivityRequest[]>;
  getIncomingRequestsForHost(hostId: string): Promise<ActivityRequest[]>;
}

export interface IFriendRepository {
  sendFriendRequest(sender: User, receiverId: string): Promise<FriendRequest>;
  respondToFriendRequest(requestId: string, userId: string, action: 'accept' | 'reject'): Promise<FriendRequest>;
  cancelFriendRequest(requestId: string, senderId: string): Promise<FriendRequest>;
  getFriends(userId: string): Promise<UserPublicProfile[]>;
  getFriendRequests(userId: string): Promise<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }>;
  blockUser(blockerId: string, blockedId: string): Promise<UserBlock>;
  unblockUser(blockerId: string, blockedId: string): Promise<void>;
  getBlockedUsers(userId: string): Promise<string[]>;
}

export interface IMatchingService {
  getCompanionRecommendations(currentUser: User): Promise<Array<{ user: UserPublicProfile; match: MatchScoreResult }>>;
  getActivityRecommendations(currentUser: User, activities: Activity[]): Promise<Array<{ activity: Activity; matchScore: number }>>;
}
