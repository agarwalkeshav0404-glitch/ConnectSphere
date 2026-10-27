/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  Sparkles,
  AlertCircle,
  Check,
} from 'lucide-react';
import { ActivityCategory, CostMode, User } from '../types';
import { ALL_INTERESTS } from '../services/storage/localAdapter';
import { activityFormSchema } from '../validation/schemas';
import { CostBreakdown } from '../components/CostBreakdown';

interface CreateActivityPageProps {
  currentUser: User;
  onCancel: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

const CATEGORIES: ActivityCategory[] = [
  'Trekking & Outdoors',
  'Travel & Trips',
  'Sports & Fitness',
  'Movies & Entertainment',
  'Food & Cafes',
  'Gaming & Esports',
  'Music & Concerts',
  'Tech & Workshops',
  'Arts & Culture',
  'Board Games & Social',
];

export const CreateActivityPage: React.FC<CreateActivityPageProps> = ({
  currentUser,
  onCancel,
  onSubmit,
}) => {
  // Helper for tomorrow's date string YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Trekking & Outdoors');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState('06:00');
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [location, setLocation] = useState('');
  const [participantLimit, setParticipantLimit] = useState(6);
  const [costMode, setCostMode] = useState<CostMode>('total_shared');
  const [costAmount, setCostAmount] = useState(1800);
  const [requiredInterests, setRequiredInterests] = useState<string[]>(['Trekking']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    if (requiredInterests.includes(interest)) {
      if (requiredInterests.length > 1) {
        setRequiredInterests(requiredInterests.filter((i) => i !== interest));
      }
    } else {
      setRequiredInterests([...requiredInterests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const rawData = {
      title: title.trim(),
      category,
      description: description.trim(),
      date,
      startTime,
      city: city.trim(),
      location: location.trim(),
      participantLimit: Number(participantLimit),
      costMode,
      costAmount: costMode === 'free' ? 0 : Number(costAmount),
      requiredInterests,
    };

    const parsed = activityFormSchema.safeParse(rawData);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Please review form fields');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(parsed.data);
    } catch (err: any) {
      setError(err.message || 'Failed to create activity');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 font-body">
      {/* Top Back Action */}
      <div>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-700" />
            <h1 className="text-2xl font-bold text-stone-900 font-display">Create an Activity</h1>
          </div>
          <p className="text-xs text-stone-500">
            Host a trek, game session, road trip, or cultural meetup. Set clear group size and shared expense terms.
          </p>
        </div>

        {error && (
          <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Title & Category */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Activity Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunrise Trek to Skandagiri Hills"
                maxLength={100}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900 text-sm font-medium"
              />
              <span className="text-[10px] text-stone-400 block text-right mt-1">
                {title.length} / 100 characters
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Detailed Description & Schedule
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the plan, physical requirements, what to bring, and expectations for participants..."
              maxLength={2000}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900 leading-relaxed"
            />
            <span className="text-[10px] text-stone-400 block text-right mt-1">
              {description.length} / 2000 characters
            </span>
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Start Time (24h)</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Participant Limit (Excluding You)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={participantLimit}
                onChange={(e) => setParticipantLimit(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Meeting Point / Venue Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Cubbon Park Metro Gate 2, or Dialogues Cafe 4th Block Koramangala"
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
            />
          </div>

          {/* Cost Mode & Calculation Section */}
          <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200 space-y-4">
            <h4 className="font-bold text-stone-900 text-sm">Cost & Expense Sharing Model</h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCostMode('free');
                  setCostAmount(0);
                }}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  costMode === 'free'
                    ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Free Activity
              </button>

              <button
                type="button"
                onClick={() => {
                  setCostMode('per_person');
                  if (costAmount <= 0) setCostAmount(300);
                }}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  costMode === 'per_person'
                    ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Fixed Per Person
              </button>

              <button
                type="button"
                onClick={() => {
                  setCostMode('total_shared');
                  if (costAmount <= 0) setCostAmount(1800);
                }}
                className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  costMode === 'total_shared'
                    ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Total Shared Cost
              </button>
            </div>

            {costMode !== 'free' && (
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {costMode === 'per_person'
                    ? 'Fixed Amount Per Participant (INR ₹)'
                    : 'Total Group Shared Amount (INR ₹)'}
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    min={1}
                    required
                    value={costAmount}
                    onChange={(e) => setCostAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-stone-900 font-mono font-bold"
                  />
                  <span className="absolute left-3 top-2 text-stone-400 font-bold">₹</span>
                </div>
              </div>
            )}

            {/* Dynamic Live Cost Preview */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">
                Live Calculation Preview for Guests
              </span>
              <CostBreakdown
                costMode={costMode}
                costAmount={costAmount}
                approvedCount={0}
                participantLimit={participantLimit}
              />
            </div>
          </div>

          {/* Required Interests Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-stone-700">
                Required / Matching Interests (Select at least 1)
              </label>
              <span className="text-[11px] text-stone-500">
                {requiredInterests.length} selected
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto p-2 bg-stone-50 border border-stone-200 rounded-xl flex flex-wrap gap-1.5">
              {ALL_INTERESTS.map((interest) => {
                const isSelected = requiredInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-900 text-white shadow-sm'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Submit & Cancel Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {loading ? 'Creating...' : 'Publish Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
