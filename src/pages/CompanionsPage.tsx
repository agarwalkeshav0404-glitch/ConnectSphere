/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Users, Search, MapPin, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { MatchScoreResult, User, UserPublicProfile } from '../types';
import { CompanionCard } from '../components/CompanionCard';

interface CompanionsPageProps {
  currentUser: User;
  companionRecommendations: Array<{ user: UserPublicProfile; match: MatchScoreResult }>;
  friendIds: string[];
  pendingSentFriendIds: string[];
  pendingReceivedFriendIds: string[];
  blockedUserIds: string[];
  onSendFriendRequest: (userId: string) => Promise<void>;
  onAcceptFriendRequest: (userId: string) => Promise<void>;
  onBlockUser: (userId: string) => Promise<void>;
  onNavigate: (tab: string, param?: string) => void;
}

export const CompanionsPage: React.FC<CompanionsPageProps> = ({
  currentUser,
  companionRecommendations,
  friendIds,
  pendingSentFriendIds,
  pendingReceivedFriendIds,
  blockedUserIds,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onBlockUser,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);

  // Filter out blocked users
  const unblockedCandidates = useMemo(() => {
    return companionRecommendations.filter((c) => !blockedUserIds.includes(c.user.id));
  }, [companionRecommendations, blockedUserIds]);

  const cities = useMemo(() => {
    const set = new Set(unblockedCandidates.map((c) => c.user.city));
    return Array.from(set);
  }, [unblockedCandidates]);

  const filteredCompanions = useMemo(() => {
    let result = [...unblockedCandidates];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.user.fullName.toLowerCase().includes(q) ||
          c.user.city.toLowerCase().includes(q) ||
          c.user.interests.some((i) => i.toLowerCase().includes(q)) ||
          (c.user.bio && c.user.bio.toLowerCase().includes(q))
      );
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter((c) => c.user.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Min match score filter
    if (minMatchScore > 0) {
      result = result.filter((c) => c.match.overallScore >= minMatchScore);
    }

    return result;
  }, [unblockedCandidates, searchQuery, selectedCity, minMatchScore]);

  return (
    <div className="space-y-6 pb-16 font-body">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-display">Find Companions</h1>
        <p className="text-xs text-stone-500">
          Ranked using Jaccard interest similarity (60%), city match (25%), and recreation category overlap (15%).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companions by name, city, or interests (e.g. Trekking, Photography)..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(parseInt(e.target.value) || 0)}
              className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            >
              <option value="0">All Match Scores</option>
              <option value="50">&gt; 50% Match</option>
              <option value="75">&gt; 75% High Match</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>
            Found <strong className="text-stone-900">{filteredCompanions.length}</strong> matching
            companions
          </span>

          {(searchQuery || selectedCity !== 'all' || minMatchScore > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('all');
                setMinMatchScore(0);
              }}
              className="text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Companion Cards Grid */}
      {filteredCompanions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Users className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-900 font-display">No Companions Found</h3>
          <p className="text-xs text-stone-500">
            No companions match your current search criteria. Try relaxing your city or match score filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanions.map(({ user, match }) => {
            const isFriend = friendIds.includes(user.id);
            const isPendingSent = pendingSentFriendIds.includes(user.id);
            const isPendingReceived = pendingReceivedFriendIds.includes(user.id);

            let friendshipStatus: 'none' | 'pending_sent' | 'pending_received' | 'friends' = 'none';
            if (isFriend) friendshipStatus = 'friends';
            else if (isPendingSent) friendshipStatus = 'pending_sent';
            else if (isPendingReceived) friendshipStatus = 'pending_received';

            return (
              <CompanionCard
                key={user.id}
                user={user}
                match={match}
                friendshipStatus={friendshipStatus}
                onSendFriendRequest={onSendFriendRequest}
                onAcceptFriendRequest={onAcceptFriendRequest}
                onBlockUser={onBlockUser}
                onViewProfile={(id) => onNavigate('profile', id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
