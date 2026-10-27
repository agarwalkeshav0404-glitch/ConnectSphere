/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Activity,
  ActivityRequest,
  FriendRequest,
  User,
  UserBlock,
  UserPrivateInfo,
} from '../../types';

export const ALL_INTERESTS: string[] = [
  'Trekking',
  'Travelling',
  'Movies',
  'Cricket',
  'Football',
  'Badminton',
  'Running',
  'Cycling',
  'Gym and fitness',
  'Gaming',
  'Photography',
  'Music',
  'Food exploration',
  'Cafes',
  'Road trips',
  'Camping',
  'Racing and motorsports',
  'Art and culture',
  'Technology events',
  'Board games',
];

// Seed Users
export const SEED_USERS: User[] = [
  {
    id: 'user_aarav',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@demo.connectsphere.internal',
    phone: '+91 98765 43210',
    dateOfBirth: '2004-03-15',
    gender: 'male',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    bio: 'B.Tech CS 3rd year. Weekend trail hiker, amateur landscape photographer, and coffee explorer. Always seeking fellow adventurers!',
    interests: ['Trekking', 'Photography', 'Road trips', 'Cafes', 'Badminton'],
    createdAt: '2026-09-01T10:00:00.000Z',
    onboardingCompleted: true,
    isDemoUser: true,
  },
  {
    id: 'user_diya',
    fullName: 'Diya Patel',
    email: 'diya.patel@demo.connectsphere.internal',
    phone: '+91 98450 12345',
    dateOfBirth: '2003-08-22',
    gender: 'female',
    city: 'Bengaluru',
    locality: 'Koramangala',
    bio: 'Product designer. Big fan of Catan, Wingspan, specialty pour-overs, and weekend city rides.',
    interests: ['Board games', 'Cafes', 'Cycling', 'Food exploration', 'Travelling'],
    createdAt: '2026-09-05T14:30:00.000Z',
    onboardingCompleted: true,
    isDemoUser: true,
  },
  {
    id: 'user_rohan',
    fullName: 'Rohan Iyer',
    email: 'rohan.iyer@demo.connectsphere.internal',
    phone: '+91 99001 88776',
    dateOfBirth: '2004-11-10',
    gender: 'male',
    city: 'Bengaluru',
    locality: 'HSR Layout',
    bio: 'Full-stack builder. Weekend cricketer, avid runner training for Bangalore 10K, and FIFA enthusiast.',
    interests: ['Cricket', 'Football', 'Running', 'Technology events', 'Gaming'],
    createdAt: '2026-09-10T09:15:00.000Z',
    onboardingCompleted: true,
    isDemoUser: true,
  },
  {
    id: 'user_sneha',
    fullName: 'Sneha Rao',
    email: 'sneha.rao@demo.connectsphere.internal',
    phone: '+91 98220 54321',
    dateOfBirth: '2003-05-18',
    gender: 'female',
    city: 'Bengaluru',
    locality: 'Malleshwaram',
    bio: 'Literature graduate and indie musician. Love acoustic open mics, modern art galleries, and starry night camping.',
    interests: ['Music', 'Art and culture', 'Camping', 'Movies', 'Trekking'],
    createdAt: '2026-09-12T16:45:00.000Z',
    onboardingCompleted: true,
    isDemoUser: true,
  },
  {
    id: 'user_vikram',
    fullName: 'Vikram Menon',
    email: 'vikram.menon@demo.connectsphere.internal',
    phone: '+91 94440 99887',
    dateOfBirth: '2002-12-04',
    gender: 'male',
    city: 'Mysuru',
    locality: 'Gokulam',
    bio: 'Heritage enthusiast and road tripper. Always up for coastal drives and vintage motorcycle rallies.',
    interests: ['Travelling', 'Racing and motorsports', 'Photography', 'Road trips'],
    createdAt: '2026-09-15T11:20:00.000Z',
    onboardingCompleted: true,
    isDemoUser: true,
  },
];

// Helper to calculate future date string YYYY-MM-DD
function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

// Seed Activities
export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'act_skandagiri_trek',
    title: 'Sunrise Trek to Skandagiri Hills',
    category: 'Trekking & Outdoors',
    description:
      'Early morning trek to witness the sea of clouds from Skandagiri peak (Kalavara Durga). We start at 3:30 AM from the base. Suitable for moderate fitness. Cab and forest entry permit costs will be shared equally.',
    date: getFutureDate(3),
    startTime: '03:30',
    city: 'Bengaluru',
    location: 'Kalavara Village Base Camp, Chikkaballapur Road',
    creatorId: 'user_aarav',
    creatorName: 'Aarav Sharma',
    participantLimit: 6,
    approvedParticipantIds: ['user_diya', 'user_sneha'],
    costMode: 'total_shared',
    costAmount: 2400,
    requiredInterests: ['Trekking', 'Photography'],
    status: 'active',
    createdAt: '2026-10-20T08:00:00.000Z',
  },
  {
    id: 'act_boardgames_night',
    title: 'Friday Strategy Board Game Evening',
    category: 'Board Games & Social',
    description:
      'Friendly evening playing Settlers of Catan, Ticket to Ride, and Cascadia. Beginners are warmly welcomed! We have booked the semi-private room at Dialogues Cafe.',
    date: getFutureDate(4),
    startTime: '18:30',
    city: 'Bengaluru',
    location: 'Dialogues Cafe, 4th Block, Koramangala',
    creatorId: 'user_diya',
    creatorName: 'Diya Patel',
    participantLimit: 8,
    approvedParticipantIds: ['user_aarav', 'user_rohan'],
    costMode: 'per_person',
    costAmount: 300,
    requiredInterests: ['Board games', 'Cafes'],
    status: 'active',
    createdAt: '2026-10-21T11:00:00.000Z',
  },
  {
    id: 'act_cubbon_cycling',
    title: 'Cubbon Park Morning Cycling Loop & Breakfast',
    category: 'Sports & Fitness',
    description:
      'Casual 15km morning ride inside traffic-free Cubbon Park followed by filter coffee and dosas at Airlines Hotel. Bring your own cycle or rent a SmartBike near the metro.',
    date: getFutureDate(5),
    startTime: '06:15',
    city: 'Bengaluru',
    location: 'Cubbon Park Metro Station (Gate 2)',
    creatorId: 'user_rohan',
    creatorName: 'Rohan Iyer',
    participantLimit: 10,
    approvedParticipantIds: ['user_diya'],
    costMode: 'free',
    costAmount: 0,
    requiredInterests: ['Cycling', 'Running'],
    status: 'active',
    createdAt: '2026-10-22T07:30:00.000Z',
  },
  {
    id: 'act_acoustic_jam',
    title: 'Indie Acoustic Jam & Live Gigs',
    category: 'Music & Concerts',
    description:
      'Intimate acoustic jam session featuring local indie songwriters and open-mic opportunities. Listeners and acoustic instrument players both welcome.',
    date: getFutureDate(6),
    startTime: '19:00',
    city: 'Bengaluru',
    location: 'The Humming Tree Pop-up, Indiranagar 100ft Rd',
    creatorId: 'user_sneha',
    creatorName: 'Sneha Rao',
    participantLimit: 6,
    approvedParticipantIds: [],
    costMode: 'per_person',
    costAmount: 500,
    requiredInterests: ['Music', 'Art and culture'],
    status: 'active',
    createdAt: '2026-10-23T15:00:00.000Z',
  },
  {
    id: 'act_gandhi_bazaar_food',
    title: 'Gandhi Bazaar Street Food & Heritage Walk',
    category: 'Food & Cafes',
    description:
      'Exploring iconic South Bangalore delicacies: Vidyarthi Bhavan benne masala dosa, filter coffee, Davangere benne dosa, and roasted spiced corn.',
    date: getFutureDate(7),
    startTime: '16:00',
    city: 'Bengaluru',
    location: 'Gandhi Bazaar Circle, Basavanagudi',
    creatorId: 'user_sneha',
    creatorName: 'Sneha Rao',
    participantLimit: 5,
    approvedParticipantIds: ['user_aarav'],
    costMode: 'per_person',
    costAmount: 400,
    requiredInterests: ['Food exploration', 'Cafes'],
    status: 'active',
    createdAt: '2026-10-24T12:00:00.000Z',
  },
  {
    id: 'act_coorg_camping',
    title: 'Coorg Coffee Estate Camping & Waterfall Trail',
    category: 'Travel & Trips',
    description:
      'Weekend getaway to Madikeri. Pitch tents beside an organic coffee plantation, campfire storytelling, and a 4km hike to Chelavara Falls. Van rental and campsite split evenly.',
    date: getFutureDate(12),
    startTime: '05:00',
    city: 'Bengaluru',
    location: 'Pick up: Silk Board Junction / Electronic City Toll',
    creatorId: 'user_aarav',
    creatorName: 'Aarav Sharma',
    participantLimit: 8,
    approvedParticipantIds: ['user_rohan', 'user_sneha'],
    costMode: 'total_shared',
    costAmount: 14000,
    requiredInterests: ['Camping', 'Road trips', 'Travelling'],
    status: 'active',
    createdAt: '2026-10-25T09:00:00.000Z',
  },
];

// Seed Activity Requests
export const SEED_ACTIVITY_REQUESTS: ActivityRequest[] = [
  {
    id: 'req_rohan_skandagiri',
    activityId: 'act_skandagiri_trek',
    requesterId: 'user_rohan',
    requesterName: 'Rohan Iyer',
    requesterCity: 'Bengaluru',
    message: 'Hey Aarav! I have trekking shoes and headlamp ready. Would love to join the group!',
    status: 'pending',
    createdAt: '2026-10-25T14:00:00.000Z',
    updatedAt: '2026-10-25T14:00:00.000Z',
  },
  {
    id: 'req_sneha_skandagiri',
    activityId: 'act_skandagiri_trek',
    requesterId: 'user_sneha',
    requesterName: 'Sneha Rao',
    requesterCity: 'Bengaluru',
    message: 'Excited for the sunrise! Joining with my camera.',
    status: 'approved',
    createdAt: '2026-10-24T18:00:00.000Z',
    updatedAt: '2026-10-24T19:30:00.000Z',
  },
  {
    id: 'req_aarav_boardgames',
    activityId: 'act_boardgames_night',
    requesterId: 'user_aarav',
    requesterName: 'Aarav Sharma',
    requesterCity: 'Bengaluru',
    message: 'Huge Catan fan, count me in for the evening!',
    status: 'approved',
    createdAt: '2026-10-22T14:00:00.000Z',
    updatedAt: '2026-10-22T15:00:00.000Z',
  },
];

// Seed Friend Requests
export const SEED_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'fr_aarav_diya',
    senderId: 'user_aarav',
    senderName: 'Aarav Sharma',
    senderCity: 'Bengaluru',
    receiverId: 'user_diya',
    receiverName: 'Diya Patel',
    status: 'accepted',
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'fr_sneha_aarav',
    senderId: 'user_sneha',
    senderName: 'Sneha Rao',
    senderCity: 'Bengaluru',
    receiverId: 'user_aarav',
    receiverName: 'Aarav Sharma',
    status: 'accepted',
    createdAt: '2026-09-22T11:00:00.000Z',
  },
  {
    id: 'fr_rohan_aarav',
    senderId: 'user_rohan',
    senderName: 'Rohan Iyer',
    senderCity: 'Bengaluru',
    receiverId: 'user_aarav',
    receiverName: 'Aarav Sharma',
    status: 'pending',
    createdAt: '2026-10-24T16:00:00.000Z',
  },
];

const STORAGE_KEYS = {
  USERS: 'connectsphere_users_v2',
  ACTIVITIES: 'connectsphere_activities_v2',
  REQUESTS: 'connectsphere_requests_v2',
  FRIENDS: 'connectsphere_friends_v2',
  BLOCKS: 'connectsphere_blocks_v2',
  CURRENT_USER_ID: 'connectsphere_active_user_id_v2',
};

class LocalStorageAdapter {
  private notifyListeners() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('connectsphere_storage_sync'));
    }
  }

  initSeeds(forceReset = false) {
    if (typeof window === 'undefined') return;

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SEED_ACTIVITY_REQUESTS));
      localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(SEED_FRIEND_REQUESTS));
      localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_aarav');
      this.notifyListeners();
    }
  }

  // Active Session User
  getCurrentUserId(): string {
    if (typeof window === 'undefined') return 'user_aarav';
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_aarav';
  }

  setCurrentUserId(userId: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    this.notifyListeners();
  }

  // Users CRUD
  getUsers(): User[] {
    if (typeof window === 'undefined') return SEED_USERS;
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      this.initSeeds();
      return SEED_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USERS;
    }
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  saveUser(user: User): User {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notifyListeners();
    return user;
  }

  // Activities CRUD
  getActivities(): Activity[] {
    if (typeof window === 'undefined') return SEED_ACTIVITIES;
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      this.initSeeds();
      return SEED_ACTIVITIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_ACTIVITIES;
    }
  }

  getActivityById(id: string): Activity | undefined {
    return this.getActivities().find((a) => a.id === id);
  }

  saveActivity(activity: Activity): Activity {
    const list = this.getActivities();
    const idx = list.findIndex((a) => a.id === activity.id);
    if (idx >= 0) {
      list[idx] = activity;
    } else {
      list.unshift(activity);
    }
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(list));
    this.notifyListeners();
    return activity;
  }

  // Activity Requests CRUD
  getRequests(): ActivityRequest[] {
    if (typeof window === 'undefined') return SEED_ACTIVITY_REQUESTS;
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      this.initSeeds();
      return SEED_ACTIVITY_REQUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_ACTIVITY_REQUESTS;
    }
  }

  saveRequest(req: ActivityRequest): ActivityRequest {
    const list = this.getRequests();
    const idx = list.findIndex((r) => r.id === req.id);
    if (idx >= 0) {
      list[idx] = req;
    } else {
      list.unshift(req);
    }
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(list));
    this.notifyListeners();
    return req;
  }

  // Friend Requests & Connections CRUD
  getFriendRequests(): FriendRequest[] {
    if (typeof window === 'undefined') return SEED_FRIEND_REQUESTS;
    const raw = localStorage.getItem(STORAGE_KEYS.FRIENDS);
    if (!raw) {
      this.initSeeds();
      return SEED_FRIEND_REQUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_FRIEND_REQUESTS;
    }
  }

  saveFriendRequest(fr: FriendRequest): FriendRequest {
    const list = this.getFriendRequests();
    const idx = list.findIndex((r) => r.id === fr.id);
    if (idx >= 0) {
      list[idx] = fr;
    } else {
      list.unshift(fr);
    }
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(list));
    this.notifyListeners();
    return fr;
  }

  // Blocks CRUD
  getBlocks(): UserBlock[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCKS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addBlock(blockerId: string, blockedId: string): UserBlock {
    const blocks = this.getBlocks();
    const existing = blocks.find((b) => b.blockerId === blockerId && b.blockedId === blockedId);
    if (existing) return existing;

    const newBlock: UserBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      blockerId,
      blockedId,
      createdAt: new Date().toISOString(),
    };
    blocks.push(newBlock);
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
    this.notifyListeners();
    return newBlock;
  }

  removeBlock(blockerId: string, blockedId: string) {
    const blocks = this.getBlocks().filter(
      (b) => !(b.blockerId === blockerId && b.blockedId === blockedId)
    );
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
    this.notifyListeners();
  }

  isBlocked(userAId: string, userBId: string): boolean {
    const blocks = this.getBlocks();
    return blocks.some(
      (b) =>
        (b.blockerId === userAId && b.blockedId === userBId) ||
        (b.blockerId === userBId && b.blockedId === userAId)
    );
  }
}

export const localAdapter = new LocalStorageAdapter();
