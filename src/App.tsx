/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  ActivityRequest,
  FriendRequest,
  MatchScoreResult,
  User,
  UserPublicProfile,
} from './types';
import {
  activityRepository,
  authService,
  friendRepository,
  matchingService,
  requestRepository,
  userRepository,
} from './services/repositories/localRepository';
import { localAdapter } from './services/storage/localAdapter';

// Components
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { DemoSwitcherModal } from './components/DemoSwitcherModal';
import { CompilerParserModal } from './components/CompilerParserModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ActivityDetailsPage } from './pages/ActivityDetailsPage';
import { CreateActivityPage } from './pages/CreateActivityPage';
import { MyActivitiesPage } from './pages/MyActivitiesPage';
import { CompanionsPage } from './pages/CompanionsPage';
import { FriendsPage } from './pages/FriendsPage';
import { ProfilePage } from './pages/ProfilePage';
import { TestsRunnerPage } from './pages/TestsRunnerPage';
import { AuthPages } from './pages/AuthPages';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityRequests, setActivityRequests] = useState<ActivityRequest[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserPublicProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserPublicProfile[]>([]);
  const [companionRecommendations, setCompanionRecommendations] = useState<
    Array<{ user: UserPublicProfile; match: MatchScoreResult }>
  >([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);
  const [filterInterestPreset, setFilterInterestPreset] = useState<string | undefined>(undefined);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  // Modals
  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);
  const [isCompilerModalOpen, setIsCompilerModalOpen] = useState(false);

  // Load and synchronize application state
  const refreshState = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);

      const allActs = await activityRepository.getActivities();
      setActivities(allActs);

      const allReqs = localAdapter.getRequests();
      setActivityRequests(allReqs);

      const allFrs = localAdapter.getFriendRequests();
      setFriendRequests(allFrs);

      const usersList = await userRepository.getAllUsers();
      setAllUsers(usersList);

      if (user) {
        const userFriends = await friendRepository.getFriends(user.id);
        setFriends(userFriends);

        const recs = await matchingService.getCompanionRecommendations(user);
        setCompanionRecommendations(recs);

        const blocks = await friendRepository.getBlockedUsers(user.id);
        setBlockedUserIds(blocks);
      }
    } catch (err) {
      console.error('Failed to synchronize application state:', err);
    }
  }, []);

  useEffect(() => {
    refreshState();

    const handleSync = () => {
      refreshState();
    };

    window.addEventListener('connectsphere_storage_sync', handleSync);
    return () => {
      window.removeEventListener('connectsphere_storage_sync', handleSync);
    };
  }, [refreshState]);

  // Compute pending incoming requests for active user
  const pendingRequestsCount = React.useMemo(() => {
    if (!currentUser) return 0;
    const myActivityIds = new Set(
      activities.filter((a) => a.creatorId === currentUser.id).map((a) => a.id)
    );
    return activityRequests.filter(
      (r) => myActivityIds.has(r.activityId) && r.status === 'pending'
    ).length;
  }, [currentUser, activities, activityRequests]);

  // Navigation router
  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'auth') {
      setAuthInitialMode(param === 'signup' ? 'signup' : 'signin');
      setActiveTab('auth');
      window.scrollTo(0, 0);
      return;
    }

    if (tab === 'activity-detail' && param) {
      setSelectedActivityId(param);
      setActiveTab('activity-detail');
      window.scrollTo(0, 0);
      return;
    }

    if (tab === 'profile' && param) {
      setSelectedProfileUserId(param);
      setActiveTab('profile');
      window.scrollTo(0, 0);
      return;
    }

    if (tab === 'discover' && param) {
      setFilterInterestPreset(param);
      setActiveTab('discover');
      window.scrollTo(0, 0);
      return;
    }

    setSelectedProfileUserId(null);
    setFilterInterestPreset(undefined);
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  // Actions
  const handleSendJoinRequest = async (activityId: string, message: string) => {
    if (!currentUser) return;
    await requestRepository.createJoinRequest(activityId, currentUser, message);
    refreshState();
  };

  const handleCancelJoinRequest = async (requestId: string) => {
    if (!currentUser) return;
    await requestRepository.cancelJoinRequest(requestId, currentUser.id);
    refreshState();
  };

  const handleApproveJoinRequest = async (requestId: string) => {
    if (!currentUser) return;
    await requestRepository.approveJoinRequest(requestId, currentUser.id);
    refreshState();
  };

  const handleRejectJoinRequest = async (requestId: string) => {
    if (!currentUser) return;
    await requestRepository.rejectJoinRequest(requestId, currentUser.id);
    refreshState();
  };

  const handleLeaveActivity = async (activityId: string) => {
    if (!currentUser) return;
    await requestRepository.leaveActivity(activityId, currentUser.id);
    refreshState();
  };

  const handleCancelActivity = async (activityId: string) => {
    if (!currentUser) return;
    await activityRepository.cancelActivity(activityId, currentUser.id);
    refreshState();
  };

  const handleCreateActivity = async (formData: any) => {
    if (!currentUser) return;
    const created = await activityRepository.createActivity(formData, currentUser);
    refreshState();
    setSelectedActivityId(created.id);
    setActiveTab('activity-detail');
  };

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!currentUser) return;
    await friendRepository.sendFriendRequest(currentUser, targetUserId);
    refreshState();
  };

  const handleAcceptFriendRequest = async (requestId: string) => {
    if (!currentUser) return;
    await friendRepository.respondToFriendRequest(requestId, currentUser.id, 'accept');
    refreshState();
  };

  const handleRejectFriendRequest = async (requestId: string) => {
    if (!currentUser) return;
    await friendRepository.respondToFriendRequest(requestId, currentUser.id, 'reject');
    refreshState();
  };

  const handleCancelFriendRequest = async (requestId: string) => {
    if (!currentUser) return;
    await friendRepository.cancelFriendRequest(requestId, currentUser.id);
    refreshState();
  };

  const handleBlockUser = async (targetUserId: string) => {
    if (!currentUser) return;
    if (confirm('Block this user? They will not be able to interact or send requests.')) {
      await friendRepository.blockUser(currentUser.id, targetUserId);
      refreshState();
    }
  };

  const handleUnblockUser = async (targetUserId: string) => {
    if (!currentUser) return;
    await friendRepository.unblockUser(currentUser.id, targetUserId);
    refreshState();
  };

  const handleUpdateProfile = async (data: any) => {
    if (!currentUser) return;
    const updated = await userRepository.updateProfile(currentUser.id, data);
    setCurrentUser(updated);
    refreshState();
  };

  const handleResetSeeds = () => {
    localAdapter.initSeeds(true);
    refreshState();
  };

  const handleSelectDemoUser = (userId: string) => {
    authService.switchDemoUser(userId);
    refreshState();
  };

  // Friend status calculations
  const friendIds = friends.map((f) => f.id);
  const pendingSentFriendIds = friendRequests
    .filter((fr) => fr.senderId === currentUser?.id && fr.status === 'pending')
    .map((fr) => fr.receiverId);
  const pendingReceivedFriendIds = friendRequests
    .filter((fr) => fr.receiverId === currentUser?.id && fr.status === 'pending')
    .map((fr) => fr.senderId);

  // If user is on landing page:
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => {
            setAuthInitialMode('signup');
            setActiveTab('auth');
          }}
          onSignIn={() => {
            setAuthInitialMode('signin');
            setActiveTab('auth');
          }}
          onExplore={() => setActiveTab('discover')}
        />
        <CompilerParserModal
          isOpen={isCompilerModalOpen}
          onClose={() => setIsCompilerModalOpen(false)}
          activities={activities}
        />
      </>
    );
  }

  // Auth pages view (Login / Sign Up)
  if (activeTab === 'auth') {
    return (
      <AuthPages
        initialMode={authInitialMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('dashboard');
          refreshState();
        }}
        onCancel={() => setActiveTab('landing')}
      />
    );
  }

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);
  const viewingProfileUser = selectedProfileUserId
    ? allUsers.find((u) => u.id === selectedProfileUserId)
    : null;

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col font-body">
      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        pendingRequestsCount={pendingRequestsCount}
        onOpenDemoSwitcher={() => setIsDemoSwitcherOpen(true)}
        onOpenQueryCompiler={() => setIsCompilerModalOpen(true)}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && currentUser && (
          <DashboardPage
            currentUser={currentUser}
            activities={activities}
            companionRecommendations={companionRecommendations}
            onNavigate={handleNavigate}
            pendingRequestsCount={pendingRequestsCount}
            onSendFriendRequest={handleSendFriendRequest}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onBlockUser={handleBlockUser}
            friendIds={friendIds}
            pendingSentFriendIds={pendingSentFriendIds}
          />
        )}

        {activeTab === 'discover' && currentUser && (
          <DiscoverPage
            activities={activities}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenCompiler={() => setIsCompilerModalOpen(true)}
            initialFilterInterest={filterInterestPreset}
          />
        )}

        {activeTab === 'activity-detail' && selectedActivity && currentUser && (
          <ActivityDetailsPage
            activity={selectedActivity}
            currentUser={currentUser}
            allUsers={allUsers}
            activityRequests={activityRequests}
            onBack={() => setActiveTab('discover')}
            onSendJoinRequest={handleSendJoinRequest}
            onCancelJoinRequest={handleCancelJoinRequest}
            onApproveRequest={handleApproveJoinRequest}
            onRejectRequest={handleRejectJoinRequest}
            onLeaveActivity={handleLeaveActivity}
            onCancelActivity={handleCancelActivity}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'create-activity' && currentUser && (
          <CreateActivityPage
            currentUser={currentUser}
            onCancel={() => setActiveTab('discover')}
            onSubmit={handleCreateActivity}
          />
        )}

        {activeTab === 'my-activities' && currentUser && (
          <MyActivitiesPage
            currentUser={currentUser}
            activities={activities}
            activityRequests={activityRequests}
            onNavigate={handleNavigate}
            onApproveRequest={handleApproveJoinRequest}
            onRejectRequest={handleRejectJoinRequest}
            onCancelRequest={handleCancelJoinRequest}
            onLeaveActivity={handleLeaveActivity}
            onCancelActivity={handleCancelActivity}
          />
        )}

        {activeTab === 'companions' && currentUser && (
          <CompanionsPage
            currentUser={currentUser}
            companionRecommendations={companionRecommendations}
            friendIds={friendIds}
            pendingSentFriendIds={pendingSentFriendIds}
            pendingReceivedFriendIds={pendingReceivedFriendIds}
            blockedUserIds={blockedUserIds}
            onSendFriendRequest={handleSendFriendRequest}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onBlockUser={handleBlockUser}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'friends' && currentUser && (
          <FriendsPage
            currentUser={currentUser}
            friends={friends}
            incomingRequests={friendRequests.filter(
              (fr) => fr.receiverId === currentUser.id && fr.status === 'pending'
            )}
            outgoingRequests={friendRequests.filter(
              (fr) => fr.senderId === currentUser.id && fr.status === 'pending'
            )}
            blockedUserIds={blockedUserIds}
            allUsers={allUsers}
            onAcceptRequest={handleAcceptFriendRequest}
            onRejectRequest={handleRejectFriendRequest}
            onCancelRequest={handleCancelFriendRequest}
            onUnblockUser={handleUnblockUser}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            viewingUser={viewingProfileUser}
            onUpdateProfile={handleUpdateProfile}
            onResetSeeds={handleResetSeeds}
            onSignOut={() => {
              authService.signOut();
              setActiveTab('landing');
            }}
            onOpenDemoSwitcher={() => setIsDemoSwitcherOpen(true)}
            onOpenAcademicModal={() => setIsAcademicModalOpen(true)}
          />
        )}

        {activeTab === 'tests' && <TestsRunnerPage />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Modals */}
      <DemoSwitcherModal
        isOpen={isDemoSwitcherOpen}
        onClose={() => setIsDemoSwitcherOpen(false)}
        currentUserId={currentUser?.id || 'user_aarav'}
        onSelectUser={handleSelectDemoUser}
        onResetSeeds={handleResetSeeds}
      />

      <CompilerParserModal
        isOpen={isCompilerModalOpen}
        onClose={() => setIsCompilerModalOpen(false)}
        activities={activities}
      />
    </div>
  );
}
