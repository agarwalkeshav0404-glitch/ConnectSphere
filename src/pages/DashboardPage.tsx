/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  Compass,
  Users,
  Calendar,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Search,
} from 'lucide-react';
import { Activity, MatchScoreResult, User, UserPublicProfile } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { CompanionCard } from '../components/CompanionCard';

interface DashboardPageProps {
  currentUser: User;
  activities: Activity[];
  companionRecommendations: Array<{ user: UserPublicProfile; match: MatchScoreResult }>;
  onNavigate: (tab: string, param?: string) => void;
  pendingRequestsCount: number;
  onSendFriendRequest: (userId: string) => void;
  onAcceptFriendRequest: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  friendIds: string[];
  pendingSentFriendIds: string[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  activities,
  companionRecommendations,
  onNavigate,
  pendingRequestsCount,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onBlockUser,
  friendIds,
  pendingSentFriendIds,
}) => {
  // Derive Recommended Activities based on shared interests & city
  const recommendedActivities = useMemo(() => {
    const userInterests = new Set(currentUser.interests.map((i) => i.toLowerCase()));

    return activities
      .filter((a) => a.status === 'active')
      .map((activity) => {
        let matchScore = 0;
        if (activity.city.toLowerCase() === currentUser.city.toLowerCase()) {
          matchScore += 35;
        }
        const shared = activity.requiredInterests.filter((i) =>
          userInterests.has(i.toLowerCase())
        );
        if (activity.requiredInterests.length > 0) {
          matchScore += Math.round((shared.length / activity.requiredInterests.length) * 45);
        }
        const spots = activity.participantLimit - activity.approvedParticipantIds.length;
        if (spots > 0) matchScore += 20;

        return { activity, matchScore };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [activities, currentUser]);

  // Upcoming activities (sorted by date soonest)
  const upcomingActivities = useMemo(() => {
    return [...activities]
      .filter((a) => a.status === 'active')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [activities]);

  const topCompanions = useMemo(() => {
    return companionRecommendations.slice(0, 2);
  }, [companionRecommendations]);

  const quickInterests = currentUser.interests.slice(0, 5);

  return (
    <div className="space-y-8 pb-12 font-body">
      {/* Top Welcome Banner */}
      <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>CONNECTSPHERE EXPLORER · {currentUser.city.toUpperCase()}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            Hello, {currentUser.fullName.split(' ')[0]}!
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Ready to find your people? There are active weekend treks, game nights, and food walks happening across {currentUser.city}.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('create-activity')}
              className="px-4 py-2.5 text-xs font-semibold text-indigo-950 bg-white hover:bg-stone-100 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Host an Activity</span>
            </button>
            <button
              onClick={() => onNavigate('discover')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-800/80 hover:bg-indigo-700/80 border border-indigo-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Activities</span>
            </button>
            {pendingRequestsCount > 0 && (
              <button
                onClick={() => onNavigate('my-activities')}
                className="px-4 py-2.5 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
              >
                <span>{pendingRequestsCount} Pending Host Request{pendingRequestsCount > 1 ? 's' : ''}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Filter Search Bar & Interest Shortcuts */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div
            onClick={() => onNavigate('discover')}
            className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-400 text-xs cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <Search className="w-4 h-4 text-stone-400" />
            <span>Search treks, board games, football, cycling, cafes...</span>
          </div>

          <button
            onClick={() => onNavigate('discover')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-900 rounded-xl hover:bg-indigo-800 cursor-pointer shrink-0"
          >
            Search Activities
          </button>
        </div>

        {/* Shortcuts for user's interests */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0">
            Your Interests:
          </span>
          {quickInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => onNavigate('discover', interest)}
              className="px-3 py-1 bg-stone-100 hover:bg-indigo-50 hover:text-indigo-900 text-stone-700 font-medium rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer"
            >
              {interest}
            </button>
          ))}
          <button
            onClick={() => onNavigate('profile')}
            className="text-[11px] text-indigo-700 hover:underline shrink-0"
          >
            + Edit Interests
          </button>
        </div>
      </div>

      {/* Section 1: Recommended Activities for You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Matched according to your city ({currentUser.city}) and preferred interests
            </p>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
          >
            View all ({activities.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedActivities.map(({ activity, matchScore }) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              matchScore={matchScore}
              onClick={() => onNavigate('activity-detail', activity.id)}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Recommended Companions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-700" />
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Compatible Companions
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Evaluated via Jaccard similarity and geographical proximity
            </p>
          </div>
          <button
            onClick={() => onNavigate('companions')}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
          >
            Find more companions <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topCompanions.map(({ user, match }) => {
            const isFriend = friendIds.includes(user.id);
            const isPendingSent = pendingSentFriendIds.includes(user.id);

            return (
              <CompanionCard
                key={user.id}
                user={user}
                match={match}
                friendshipStatus={
                  isFriend ? 'friends' : isPendingSent ? 'pending_sent' : 'none'
                }
                onSendFriendRequest={onSendFriendRequest}
                onAcceptFriendRequest={onAcceptFriendRequest}
                onBlockUser={onBlockUser}
                onViewProfile={(id) => onNavigate('profile', id)}
              />
            );
          })}
        </div>
      </section>

      {/* Section 3: Upcoming Activities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-700" />
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Happening Soon
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Activities scheduled over the coming days with open spots
            </p>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
          >
            Browse schedule <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => onNavigate('activity-detail', activity.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
