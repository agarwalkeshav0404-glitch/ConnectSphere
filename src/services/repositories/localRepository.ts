/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateMatchScore } from '../../matching/matching';
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
import { localAdapter, SEED_USERS } from '../storage/localAdapter';
import {
  IActivityRepository,
  IAuthService,
  IFriendRepository,
  IMatchingService,
  IRequestRepository,
  IUserRepository,
} from './types';

// Ensure seeds are initialized
localAdapter.initSeeds();

export class LocalAuthService implements IAuthService {
  async getCurrentUser(): Promise<User | null> {
    const id = localAdapter.getCurrentUserId();
    const user = localAdapter.getUserById(id);
    return user || localAdapter.getUsers()[0] || null;
  }

  async signIn(email: string): Promise<User> {
    const users = localAdapter.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('No account found with this email in local demo mode');
    }
    localAdapter.setCurrentUserId(found.id);
    return found;
  }

  async signUp(data: SignUpFormData): Promise<User> {
    const users = localAdapter.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      city: 'Bengaluru',
      locality: '',
      bio: '',
      interests: ['Trekking', 'Cafes'], // initial defaults
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
      isDemoUser: false,
    };

    localAdapter.saveUser(newUser);
    localAdapter.setCurrentUserId(newUser.id);
    return newUser;
  }

  async signOut(): Promise<void> {
    // In demo mode, fallback to default seed user or stay available
    const users = localAdapter.getUsers();
    if (users.length > 0) {
      localAdapter.setCurrentUserId(users[0].id);
    }
  }

  async switchDemoUser(userId: string): Promise<User> {
    const user = localAdapter.getUserById(userId);
    if (!user) {
      throw new Error(`Demo user not found: ${userId}`);
    }
    localAdapter.setCurrentUserId(user.id);
    return user;
  }

  async getAllDemoUsers(): Promise<User[]> {
    return localAdapter.getUsers();
  }
}

export class LocalUserRepository implements IUserRepository {
  async getUserProfile(userId: string): Promise<UserPublicProfile | null> {
    const user = localAdapter.getUserById(userId);
    if (!user) return null;
    return {
      id: user.id,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      city: user.city,
      locality: user.locality,
      bio: user.bio,
      interests: user.interests,
      createdAt: user.createdAt,
      isDemoUser: user.isDemoUser,
    };
  }

  async updateProfile(userId: string, data: ProfileUpdateFormData): Promise<User> {
    const user = localAdapter.getUserById(userId);
    if (!user) throw new Error('User not found');

    const updated: User = {
      ...user,
      fullName: data.fullName,
      city: data.city,
      locality: data.locality,
      bio: data.bio,
      interests: data.interests,
      onboardingCompleted: true,
    };

    return localAdapter.saveUser(updated);
  }

  async getAllUsers(): Promise<UserPublicProfile[]> {
    return localAdapter.getUsers().map((u) => ({
      id: u.id,
      fullName: u.fullName,
      avatarUrl: u.avatarUrl,
      city: u.city,
      locality: u.locality,
      bio: u.bio,
      interests: u.interests,
      createdAt: u.createdAt,
      isDemoUser: u.isDemoUser,
    }));
  }

  async resetDatabaseToSeeds(): Promise<void> {
    localAdapter.initSeeds(true);
  }
}

export class LocalActivityRepository implements IActivityRepository {
  async getActivities(): Promise<Activity[]> {
    return localAdapter.getActivities();
  }

  async getActivityById(id: string): Promise<Activity | null> {
    return localAdapter.getActivityById(id) || null;
  }

  async createActivity(data: ActivityFormData, creator: User): Promise<Activity> {
    const newActivity: Activity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title,
      category: data.category,
      description: data.description,
      date: data.date,
      startTime: data.startTime,
      city: data.city,
      location: data.location,
      creatorId: creator.id,
      creatorName: creator.fullName,
      creatorAvatar: creator.avatarUrl,
      participantLimit: data.participantLimit,
      approvedParticipantIds: [],
      costMode: data.costMode,
      costAmount: data.costAmount,
      requiredInterests: data.requiredInterests,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    return localAdapter.saveActivity(newActivity);
  }

  async updateActivity(
    id: string,
    data: Partial<ActivityFormData>,
    userId: string
  ): Promise<Activity> {
    const activity = localAdapter.getActivityById(id);
    if (!activity) throw new Error('Activity not found');
    if (activity.creatorId !== userId) {
      throw new Error('Unauthorized: You can only edit activities you created');
    }

    const updated: Activity = {
      ...activity,
      ...data,
      // Retain system fields
      id: activity.id,
      creatorId: activity.creatorId,
      approvedParticipantIds: activity.approvedParticipantIds,
      createdAt: activity.createdAt,
    };

    return localAdapter.saveActivity(updated);
  }

  async cancelActivity(id: string, userId: string): Promise<Activity> {
    const activity = localAdapter.getActivityById(id);
    if (!activity) throw new Error('Activity not found');
    if (activity.creatorId !== userId) {
      throw new Error('Unauthorized: You can only cancel activities you created');
    }

    const updated: Activity = {
      ...activity,
      status: 'cancelled',
    };

    return localAdapter.saveActivity(updated);
  }
}

export class LocalRequestRepository implements IRequestRepository {
  async createJoinRequest(
    activityId: string,
    requester: User,
    message?: string
  ): Promise<ActivityRequest> {
    const activity = localAdapter.getActivityById(activityId);
    if (!activity) throw new Error('Activity does not exist');

    // Rule: Host cannot join own activity
    if (activity.creatorId === requester.id) {
      throw new Error('Host cannot request to join their own activity');
    }

    // Rule: Cannot request cancelled or completed activity
    if (activity.status === 'cancelled') {
      throw new Error('This activity has been cancelled');
    }

    // Rule: Check block status
    if (localAdapter.isBlocked(activity.creatorId, requester.id)) {
      throw new Error('Unable to send request to this activity due to user blocking settings');
    }

    // Rule: No duplicate pending or approved requests
    const existingRequests = localAdapter
      .getRequests()
      .filter((r) => r.activityId === activityId && r.requesterId === requester.id);

    const hasActive = existingRequests.some((r) => r.status === 'pending' || r.status === 'approved');
    if (hasActive) {
      throw new Error('You already have an active request for this activity');
    }

    // Rule: Capacity check
    if (activity.approvedParticipantIds.length >= activity.participantLimit) {
      throw new Error('This activity is already at full capacity');
    }

    const newReq: ActivityRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      activityId,
      requesterId: requester.id,
      requesterName: requester.fullName,
      requesterAvatar: requester.avatarUrl,
      requesterCity: requester.city,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return localAdapter.saveRequest(newReq);
  }

  async cancelJoinRequest(requestId: string, requesterId: string): Promise<ActivityRequest> {
    const req = localAdapter.getRequests().find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');
    if (req.requesterId !== requesterId) {
      throw new Error('Unauthorized: You can only cancel your own requests');
    }

    if (req.status !== 'pending') {
      throw new Error('Only pending requests can be cancelled');
    }

    const updated: ActivityRequest = {
      ...req,
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    };

    return localAdapter.saveRequest(updated);
  }

  async approveJoinRequest(
    requestId: string,
    hostId: string
  ): Promise<{ request: ActivityRequest; activity: Activity }> {
    const req = localAdapter.getRequests().find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const activity = localAdapter.getActivityById(req.activityId);
    if (!activity) throw new Error('Activity not found');

    if (activity.creatorId !== hostId) {
      throw new Error('Unauthorized: Only the activity host can approve requests');
    }

    if (req.status !== 'pending') {
      throw new Error(`Cannot approve a request with status '${req.status}'`);
    }

    // Capacity constraint enforcement
    if (activity.approvedParticipantIds.length >= activity.participantLimit) {
      throw new Error('Activity has reached maximum participant limit. Cannot approve more participants.');
    }

    // Add to approved participants list if not already present
    const updatedApproved = Array.from(new Set([...activity.approvedParticipantIds, req.requesterId]));

    const updatedActivity: Activity = {
      ...activity,
      approvedParticipantIds: updatedApproved,
      status: updatedApproved.length >= activity.participantLimit ? 'full' : 'active',
    };
    localAdapter.saveActivity(updatedActivity);

    const updatedReq: ActivityRequest = {
      ...req,
      status: 'approved',
      updatedAt: new Date().toISOString(),
    };
    localAdapter.saveRequest(updatedReq);

    return { request: updatedReq, activity: updatedActivity };
  }

  async rejectJoinRequest(requestId: string, hostId: string): Promise<ActivityRequest> {
    const req = localAdapter.getRequests().find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const activity = localAdapter.getActivityById(req.activityId);
    if (!activity) throw new Error('Activity not found');

    if (activity.creatorId !== hostId) {
      throw new Error('Unauthorized: Only the activity host can reject requests');
    }

    const updatedReq: ActivityRequest = {
      ...req,
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    };

    return localAdapter.saveRequest(updatedReq);
  }

  async leaveActivity(activityId: string, userId: string): Promise<Activity> {
    const activity = localAdapter.getActivityById(activityId);
    if (!activity) throw new Error('Activity not found');

    if (activity.creatorId === userId) {
      throw new Error('The host cannot leave their own activity. You can cancel it instead.');
    }

    const updatedParticipants = activity.approvedParticipantIds.filter((id) => id !== userId);
    const updatedActivity: Activity = {
      ...activity,
      approvedParticipantIds: updatedParticipants,
      status: activity.status === 'full' ? 'active' : activity.status,
    };
    localAdapter.saveActivity(updatedActivity);

    // Also update any approved request record to cancelled
    const userReq = localAdapter
      .getRequests()
      .find((r) => r.activityId === activityId && r.requesterId === userId && r.status === 'approved');
    if (userReq) {
      localAdapter.saveRequest({
        ...userReq,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      });
    }

    return updatedActivity;
  }

  async getRequestsForActivity(activityId: string): Promise<ActivityRequest[]> {
    return localAdapter.getRequests().filter((r) => r.activityId === activityId);
  }

  async getRequestsByRequester(requesterId: string): Promise<ActivityRequest[]> {
    return localAdapter.getRequests().filter((r) => r.requesterId === requesterId);
  }

  async getIncomingRequestsForHost(hostId: string): Promise<ActivityRequest[]> {
    const myActivities = localAdapter.getActivities().filter((a) => a.creatorId === hostId);
    const activityIds = new Set(myActivities.map((a) => a.id));
    return localAdapter.getRequests().filter((r) => activityIds.has(r.activityId));
  }
}

export class LocalFriendRepository implements IFriendRepository {
  async sendFriendRequest(sender: User, receiverId: string): Promise<FriendRequest> {
    if (sender.id === receiverId) {
      throw new Error('Cannot send a friend request to yourself');
    }

    if (localAdapter.isBlocked(sender.id, receiverId)) {
      throw new Error('Unable to send friend request due to user blocking settings');
    }

    const receiver = localAdapter.getUserById(receiverId);
    if (!receiver) throw new Error('User not found');

    const existing = localAdapter
      .getFriendRequests()
      .find(
        (fr) =>
          ((fr.senderId === sender.id && fr.receiverId === receiverId) ||
            (fr.senderId === receiverId && fr.receiverId === sender.id)) &&
          (fr.status === 'pending' || fr.status === 'accepted')
      );

    if (existing) {
      if (existing.status === 'accepted') {
        throw new Error('You are already connected as friends');
      }
      throw new Error('A friend request between you is already pending');
    }

    const newFr: FriendRequest = {
      id: `fr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: sender.id,
      senderName: sender.fullName,
      senderAvatar: sender.avatarUrl,
      senderCity: sender.city,
      receiverId: receiver.id,
      receiverName: receiver.fullName,
      receiverAvatar: receiver.avatarUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return localAdapter.saveFriendRequest(newFr);
  }

  async respondToFriendRequest(
    requestId: string,
    userId: string,
    action: 'accept' | 'reject'
  ): Promise<FriendRequest> {
    const fr = localAdapter.getFriendRequests().find((r) => r.id === requestId);
    if (!fr) throw new Error('Friend request not found');

    if (fr.receiverId !== userId) {
      throw new Error('Unauthorized: Only the recipient can accept or reject this friend request');
    }

    const updated: FriendRequest = {
      ...fr,
      status: action === 'accept' ? 'accepted' : 'rejected',
    };

    return localAdapter.saveFriendRequest(updated);
  }

  async cancelFriendRequest(requestId: string, senderId: string): Promise<FriendRequest> {
    const fr = localAdapter.getFriendRequests().find((r) => r.id === requestId);
    if (!fr) throw new Error('Friend request not found');

    if (fr.senderId !== senderId) {
      throw new Error('Unauthorized: You can only cancel your own sent requests');
    }

    const updated: FriendRequest = {
      ...fr,
      status: 'cancelled',
    };

    return localAdapter.saveFriendRequest(updated);
  }

  async getFriends(userId: string): Promise<UserPublicProfile[]> {
    const acceptedRequests = localAdapter
      .getFriendRequests()
      .filter((fr) => fr.status === 'accepted' && (fr.senderId === userId || fr.receiverId === userId));

    const friendIds = acceptedRequests.map((fr) => (fr.senderId === userId ? fr.receiverId : fr.senderId));
    const allUsers = localAdapter.getUsers();

    return allUsers
      .filter((u) => friendIds.includes(u.id))
      .map((u) => ({
        id: u.id,
        fullName: u.fullName,
        avatarUrl: u.avatarUrl,
        city: u.city,
        locality: u.locality,
        bio: u.bio,
        interests: u.interests,
        createdAt: u.createdAt,
        isDemoUser: u.isDemoUser,
      }));
  }

  async getFriendRequests(
    userId: string
  ): Promise<{ incoming: FriendRequest[]; outgoing: FriendRequest[] }> {
    const all = localAdapter.getFriendRequests();
    return {
      incoming: all.filter((fr) => fr.receiverId === userId),
      outgoing: all.filter((fr) => fr.senderId === userId),
    };
  }

  async blockUser(blockerId: string, blockedId: string): Promise<UserBlock> {
    if (blockerId === blockedId) throw new Error('Cannot block yourself');
    return localAdapter.addBlock(blockerId, blockedId);
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    localAdapter.removeBlock(blockerId, blockedId);
  }

  async getBlockedUsers(userId: string): Promise<string[]> {
    return localAdapter
      .getBlocks()
      .filter((b) => b.blockerId === userId)
      .map((b) => b.blockedId);
  }
}

export class LocalMatchingService implements IMatchingService {
  async getCompanionRecommendations(
    currentUser: User
  ): Promise<Array<{ user: UserPublicProfile; match: MatchScoreResult }>> {
    const allUsers = localAdapter.getUsers();
    const otherUsers = allUsers.filter((u) => u.id !== currentUser.id);

    const scored = otherUsers.map((target) => {
      const match = calculateMatchScore(currentUser, target);
      return {
        user: {
          id: target.id,
          fullName: target.fullName,
          avatarUrl: target.avatarUrl,
          city: target.city,
          locality: target.locality,
          bio: target.bio,
          interests: target.interests,
          createdAt: target.createdAt,
          isDemoUser: target.isDemoUser,
        },
        match,
      };
    });

    // Sort descending by overall compatibility score
    return scored.sort((a, b) => b.match.overallScore - a.match.overallScore);
  }

  async getActivityRecommendations(
    currentUser: User,
    activities: Activity[]
  ): Promise<Array<{ activity: Activity; matchScore: number }>> {
    const userInterests = new Set(currentUser.interests.map((i) => i.toLowerCase()));

    return activities.map((activity) => {
      let score = 0;

      // City match
      if (activity.city.toLowerCase() === currentUser.city.toLowerCase()) {
        score += 35;
      }

      // Shared required interests
      const matchedInterests = activity.requiredInterests.filter((i) =>
        userInterests.has(i.toLowerCase())
      );
      if (activity.requiredInterests.length > 0) {
        score += (matchedInterests.length / activity.requiredInterests.length) * 45;
      }

      // Spot availability bonus
      const openSpots = activity.participantLimit - activity.approvedParticipantIds.length;
      if (openSpots > 0) {
        score += 20;
      }

      return {
        activity,
        matchScore: Math.min(100, Math.round(score)),
      };
    });
  }
}

// Singletons
export const authService = new LocalAuthService();
export const userRepository = new LocalUserRepository();
export const activityRepository = new LocalActivityRepository();
export const requestRepository = new LocalRequestRepository();
export const friendRepository = new LocalFriendRepository();
export const matchingService = new LocalMatchingService();
