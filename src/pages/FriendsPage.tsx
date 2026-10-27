/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  ShieldAlert,
  Ban,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FriendRequest, User, UserPublicProfile } from '../types';

interface FriendsPageProps {
  currentUser: User;
  friends: UserPublicProfile[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  blockedUserIds: string[];
  allUsers: UserPublicProfile[];
  onAcceptRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  onCancelRequest: (requestId: string) => Promise<void>;
  onUnblockUser: (userId: string) => Promise<void>;
  onNavigate: (tab: string, param?: string) => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({
  currentUser,
  friends,
  incomingRequests,
  outgoingRequests,
  blockedUserIds,
  allUsers,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
  onUnblockUser,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'incoming' | 'sent' | 'blocked'>('friends');

  const blockedUsers = allUsers.filter((u) => blockedUserIds.includes(u.id));

  return (
    <div className="space-y-6 pb-16 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">Connections & Friends</h1>
          <p className="text-xs text-stone-500">
            Manage your network of verified activity companions and connection requests.
          </p>
        </div>

        <button
          onClick={() => onNavigate('companions')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Find More Companions</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 flex gap-2 overflow-x-auto text-xs pb-1">
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'friends'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          My Friends ({friends.length})
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'incoming'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Incoming Requests
          {incomingRequests.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-violet-600 text-white">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'sent'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Sent Requests ({outgoingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('blocked')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'blocked'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Blocked Users ({blockedUsers.length})
        </button>
      </div>

      {/* Tab 1: Friends */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {friends.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Users className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-900 font-display">No Connections Yet</h3>
              <p className="text-xs text-stone-500">
                You haven't added any companions as friends yet. Explore compatible peers in your city!
              </p>
              <button
                onClick={() => onNavigate('companions')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 rounded-xl hover:bg-indigo-800 transition-colors cursor-pointer"
              >
                Discover Companions
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-sm">
                      {friend.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4
                        onClick={() => onNavigate('profile', friend.id)}
                        className="text-xs font-bold text-stone-900 hover:text-indigo-900 cursor-pointer"
                      >
                        {friend.fullName}
                      </h4>
                      <p className="text-[11px] text-stone-500">{friend.city}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('profile', friend.id)}
                    className="text-xs font-semibold text-indigo-700 hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Requests */}
      {activeTab === 'incoming' && (
        <div className="space-y-3 max-w-2xl">
          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              No pending connection requests.
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between shadow-sm text-xs"
              >
                <div>
                  <h4 className="font-bold text-stone-900">{req.senderName}</h4>
                  <p className="text-stone-500 text-[11px]">{req.senderCity}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRejectRequest(req.id)}
                    className="px-3 py-1.5 font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => onAcceptRequest(req.id)}
                    className="px-4 py-1.5 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm cursor-pointer"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Sent Requests */}
      {activeTab === 'sent' && (
        <div className="space-y-3 max-w-2xl">
          {outgoingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              No outgoing connection requests.
            </div>
          ) : (
            outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between shadow-sm text-xs"
              >
                <div>
                  <h4 className="font-bold text-stone-900">{req.receiverName}</h4>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Pending
                  </span>
                </div>

                <button
                  onClick={() => onCancelRequest(req.id)}
                  className="px-3 py-1.5 font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                >
                  Withdraw
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Blocked Users */}
      {activeTab === 'blocked' && (
        <div className="space-y-3 max-w-2xl">
          {blockedUsers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              You haven't blocked any users.
            </div>
          ) : (
            blockedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between shadow-sm text-xs"
              >
                <div>
                  <h4 className="font-bold text-stone-900">{user.fullName}</h4>
                  <p className="text-stone-500 text-[11px]">{user.city}</p>
                </div>

                <button
                  onClick={() => onUnblockUser(user.id)}
                  className="px-3 py-1.5 font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer"
                >
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
