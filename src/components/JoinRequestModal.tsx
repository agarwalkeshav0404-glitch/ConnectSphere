/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { Activity, User } from '../types';

interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  currentUser: User | null;
  onSubmit: (activityId: string, message: string) => Promise<void>;
}

export const JoinRequestModal: React.FC<JoinRequestModalProps> = ({
  isOpen,
  onClose,
  activity,
  currentUser,
  onSubmit,
}) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !activity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(activity.id, message.trim());
      setMessage('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send join request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-indigo-700" />
          <h3 className="text-lg font-bold text-stone-900 font-display">Request to Join Activity</h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          Send a request to <strong>{activity.creatorName}</strong> to join this activity.
        </p>

        {/* Activity Summary Card */}
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-4 text-xs space-y-1">
          <p className="font-bold text-stone-900">{activity.title}</p>
          <p className="text-stone-500">
            {activity.category} · {activity.city} · {activity.date} at {activity.startTime}
          </p>
          <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
            <span className="text-stone-600">
              Spots remaining: {activity.participantLimit - activity.approvedParticipantIds.length}
            </span>
            <span className="font-bold text-indigo-950">
              {activity.costMode === 'free' ? 'Free' : `₹${activity.costAmount} (${activity.costMode})`}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Intro Note to Host (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hi! I love trekking and have all the required gear. Looking forward to joining!"
              rows={3}
              maxLength={300}
              className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
            />
            <span className="text-[10px] text-stone-400 block text-right mt-1">
              {message.length} / 300 characters
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
