/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check, RefreshCw, UserCheck, Sparkles, MapPin } from 'lucide-react';
import { User } from '../types';
import { SEED_USERS } from '../services/storage/localAdapter';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  onResetSeeds: () => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onSelectUser,
  onResetSeeds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-indigo-700" />
          <h3 className="text-lg font-bold text-stone-900 font-display">Switch Active Demo Account</h3>
        </div>
        <p className="text-xs text-stone-500 mb-5">
          Select any pre-seeded persona to simulate multi-user collaboration, test host approvals, and view personalized matching calculations.
        </p>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {SEED_USERS.map((user) => {
            const isSelected = user.id === currentUserId;
            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-stone-200 hover:border-indigo-300 hover:bg-stone-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-800 to-violet-600 text-white flex items-center justify-center font-bold font-display text-sm shrink-0">
                  {user.fullName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-900 truncate">{user.fullName}</h4>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{user.city}</span>
                    <span aria-hidden="true">·</span>
                    <span>{user.locality}</span>
                  </p>

                  <p className="text-xs text-stone-600 mt-1.5 line-clamp-2">{user.bio}</p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.interests.slice(0, 4).map((i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded"
                      >
                        {i}
                      </span>
                    ))}
                    {user.interests.length > 4 && (
                      <span className="text-[10px] text-stone-400">
                        +{user.interests.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset all demo activities, requests, and seed records to original state?')) {
                onResetSeeds();
                onClose();
              }
            }}
            className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
