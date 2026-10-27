/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Compass,
  Footprints,
  Plane,
  Dumbbell,
  Film,
  Utensils,
  Gamepad2,
  Music,
  Laptop,
  Palette,
  Dice5,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Activity, ActivityCategory } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
  matchScore?: number;
}

export function getCategoryIcon(category: ActivityCategory) {
  switch (category) {
    case 'Trekking & Outdoors':
      return Footprints;
    case 'Travel & Trips':
      return Plane;
    case 'Sports & Fitness':
      return Dumbbell;
    case 'Movies & Entertainment':
      return Film;
    case 'Food & Cafes':
      return Utensils;
    case 'Gaming & Esports':
      return Gamepad2;
    case 'Music & Concerts':
      return Music;
    case 'Tech & Workshops':
      return Laptop;
    case 'Arts & Culture':
      return Palette;
    case 'Board Games & Social':
      return Dice5;
    default:
      return Compass;
  }
}

export function getCategoryGradient(category: ActivityCategory): string {
  switch (category) {
    case 'Trekking & Outdoors':
      return 'from-emerald-900 via-teal-800 to-indigo-900';
    case 'Travel & Trips':
      return 'from-cyan-900 via-blue-800 to-indigo-900';
    case 'Sports & Fitness':
      return 'from-amber-900 via-orange-800 to-indigo-900';
    case 'Movies & Entertainment':
      return 'from-purple-950 via-indigo-900 to-violet-900';
    case 'Food & Cafes':
      return 'from-rose-900 via-pink-800 to-indigo-900';
    case 'Gaming & Esports':
      return 'from-violet-950 via-indigo-900 to-slate-900';
    case 'Music & Concerts':
      return 'from-fuchsia-950 via-purple-900 to-indigo-950';
    case 'Tech & Workshops':
      return 'from-blue-950 via-indigo-900 to-slate-900';
    case 'Arts & Culture':
      return 'from-pink-950 via-rose-900 to-stone-900';
    case 'Board Games & Social':
      return 'from-indigo-950 via-violet-900 to-blue-900';
    default:
      return 'from-indigo-950 to-stone-900';
  }
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick, matchScore }) => {
  const Icon = getCategoryIcon(activity.category);
  const gradient = getCategoryGradient(activity.category);
  const approvedCount = activity.approvedParticipantIds.length;
  const spotsLeft = Math.max(0, activity.participantLimit - approvedCount);
  const isFull = spotsLeft === 0;
  const isCancelled = activity.status === 'cancelled';

  // Format date readable
  const dateFormatted = new Date(`${activity.date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-stone-200 hover:border-indigo-300 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col hover:shadow-md"
    >
      {/* Category Visual Banner */}
      <div className={`h-36 bg-gradient-to-tr ${gradient} p-4 flex flex-col justify-between relative`}>
        <div className="flex items-center justify-between text-white/90">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-md">
            <Icon className="w-3.5 h-3.5" />
            <span>{activity.category}</span>
          </div>

          {matchScore !== undefined && matchScore > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-400/30 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold text-xs">
              {activity.creatorName.charAt(0)}
            </div>
            <div className="text-xs">
              <p className="text-white/70 text-[10px] leading-none">Hosted by</p>
              <p className="font-semibold text-white drop-shadow-sm leading-tight">
                {activity.creatorName}
              </p>
            </div>
          </div>

          <div className="text-right">
            {activity.costMode === 'free' ? (
              <span className="text-xs font-bold text-emerald-300 bg-black/30 px-2 py-0.5 rounded">
                Free
              </span>
            ) : activity.costMode === 'per_person' ? (
              <span className="text-xs font-bold font-mono text-white bg-black/30 px-2 py-0.5 rounded">
                ₹{activity.costAmount}/person
              </span>
            ) : (
              <span className="text-xs font-bold font-mono text-white bg-black/30 px-2 py-0.5 rounded">
                ₹{activity.costAmount} shared
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unboxed Metadata Line */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-medium text-indigo-950">{activity.city}</span>
            <span aria-hidden="true">·</span>
            <span>{dateFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>{activity.startTime}</span>
          </div>

          <h3 className="text-base font-bold text-stone-900 group-hover:text-indigo-900 transition-colors line-clamp-1 font-display">
            {activity.title}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Location & Tags */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 truncate">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>

          {/* Spots Remaining Bar */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1 text-stone-600">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              {isCancelled ? (
                <span className="text-rose-600 font-semibold">Cancelled</span>
              ) : isFull ? (
                <span className="text-amber-700 font-semibold">Activity Full</span>
              ) : (
                <span className="font-medium">
                  <strong className="text-stone-900">{spotsLeft}</strong> spots left ({approvedCount}/{activity.participantLimit})
                </span>
              )}
            </div>

            <span className="text-indigo-700 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
