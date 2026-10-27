/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserPlus, UserCheck, Clock, MapPin, Sparkles, Shield, Ban } from 'lucide-react';
import { MatchScoreResult, UserPublicProfile } from '../types';

interface CompanionCardProps {
  user: UserPublicProfile;
  match?: MatchScoreResult;
  friendshipStatus: 'none' | 'pending_sent' | 'pending_received' | 'friends' | 'blocked';
  onSendFriendRequest: (userId: string) => void;
  onAcceptFriendRequest: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({
  user,
  match,
  friendshipStatus,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onBlockUser,
  onViewProfile,
}) => {
  const score = match?.overallScore ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 hover:border-indigo-300 transition-all p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md">
      {/* Top Header: Avatar & Compatibility Score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-violet-600 text-white flex items-center justify-center font-bold text-lg font-display shrink-0">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h4
              onClick={() => onViewProfile(user.id)}
              className="text-base font-bold text-stone-900 hover:text-indigo-900 transition-colors cursor-pointer font-display leading-tight"
            >
              {user.fullName}
            </h4>
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{user.city}</span>
              {user.locality && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{user.locality}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {match && match.isAvailable ? (
          <div className="text-right shrink-0">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/60 text-indigo-950 font-bold text-xs">
              <Sparkles className="w-3 h-3 text-indigo-700" />
              <span>{score}% Match</span>
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-stone-400">New explorer</span>
        )}
      </div>

      {/* Bio */}
      {user.bio ? (
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{user.bio}</p>
      ) : (
        <p className="text-xs text-stone-400 italic">No bio provided yet.</p>
      )}

      {/* Match Explanations */}
      {match && match.explanation.length > 0 && (
        <div className="bg-stone-50 rounded-xl p-2.5 space-y-1 text-[11px] text-stone-700 border border-stone-100">
          {match.explanation.slice(0, 2).map((exp, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
              <span className="truncate">{exp}</span>
            </div>
          ))}
        </div>
      )}

      {/* Interests list */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1.5">
          Interests
        </span>
        <div className="flex flex-wrap gap-1.5">
          {user.interests.slice(0, 5).map((interest) => {
            const isShared = match?.sharedInterests.includes(interest);
            return (
              <span
                key={interest}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  isShared
                    ? 'bg-indigo-100 text-indigo-900 font-semibold'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {interest}
              </span>
            );
          })}
          {user.interests.length > 5 && (
            <span className="text-[11px] text-stone-400 self-center">
              +{user.interests.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewProfile(user.id)}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          View Profile
        </button>

        <div className="flex items-center gap-2">
          {friendshipStatus === 'none' && (
            <button
              onClick={() => onSendFriendRequest(user.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
          )}

          {friendshipStatus === 'pending_sent' && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" /> Request Sent
            </span>
          )}

          {friendshipStatus === 'pending_received' && (
            <button
              onClick={() => onAcceptFriendRequest(user.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Accept Request</span>
            </button>
          )}

          {friendshipStatus === 'friends' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
              <UserCheck className="w-3.5 h-3.5" /> Friends
            </span>
          )}

          {friendshipStatus === 'blocked' && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-1 rounded-lg">
              <Ban className="w-3.5 h-3.5" /> Blocked
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
