/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Code,
  Sparkles,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { Activity, ActivityCategory, User } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { compileQueryFilter } from '../academic/compilerParser';

interface DiscoverPageProps {
  activities: Activity[];
  currentUser: User;
  onNavigate: (tab: string, param?: string) => void;
  onOpenCompiler: () => void;
  initialFilterInterest?: string;
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

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  activities,
  currentUser,
  onNavigate,
  onOpenCompiler,
  initialFilterInterest,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilterInterest || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [costFilter, setCostFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [spotsFilter, setSpotsFilter] = useState<'all' | 'open_only'>('all');
  const [sharedInterestsOnly, setSharedInterestsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'soonest' | 'newest' | 'best_match'>('soonest');
  const [compilerExpr, setCompilerExpr] = useState<string>('');
  const [displayCount, setDisplayCount] = useState(9);

  // Distinct cities from seeded activities
  const cities = useMemo(() => {
    const set = new Set(activities.map((a) => a.city));
    return Array.from(set);
  }, [activities]);

  const userInterestsSet = useMemo(() => {
    return new Set(currentUser.interests.map((i) => i.toLowerCase()));
  }, [currentUser]);

  // Compute matched activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Exclude cancelled activities from discoverable listings per requirements
    result = result.filter((a) => a.status !== 'cancelled');

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.requiredInterests.some((i) => i.toLowerCase().includes(q))
      );
    }

    // 2. Category
    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // 3. City
    if (selectedCity !== 'all') {
      result = result.filter((a) => a.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // 4. Cost Filter
    if (costFilter === 'free') {
      result = result.filter((a) => a.costMode === 'free');
    } else if (costFilter === 'paid') {
      result = result.filter((a) => a.costMode !== 'free');
    }

    // 5. Open Spots Only
    if (spotsFilter === 'open_only') {
      result = result.filter((a) => a.approvedParticipantIds.length < a.participantLimit);
    }

    // 6. Shared Interests
    if (sharedInterestsOnly) {
      result = result.filter((a) =>
        a.requiredInterests.some((i) => userInterestsSet.has(i.toLowerCase()))
      );
    }

    // 7. Compiler Query Expression (if typed by user)
    if (compilerExpr.trim()) {
      const compiled = compileQueryFilter(compilerExpr);
      if (compiled.filterFn) {
        result = result.filter(compiled.filterFn);
      }
    }

    // 8. Sorting
    if (sortBy === 'soonest') {
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === 'best_match') {
      // Calculate dynamic match score
      result.sort((a, b) => {
        const scoreA =
          (a.city.toLowerCase() === currentUser.city.toLowerCase() ? 35 : 0) +
          (a.requiredInterests.some((i) => userInterestsSet.has(i.toLowerCase())) ? 45 : 0);
        const scoreB =
          (b.city.toLowerCase() === currentUser.city.toLowerCase() ? 35 : 0) +
          (b.requiredInterests.some((i) => userInterestsSet.has(i.toLowerCase())) ? 45 : 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [
    activities,
    searchQuery,
    selectedCategory,
    selectedCity,
    costFilter,
    spotsFilter,
    sharedInterestsOnly,
    compilerExpr,
    sortBy,
    currentUser,
    userInterestsSet,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setCostFilter('all');
    setSpotsFilter('all');
    setSharedInterestsOnly(false);
    setCompilerExpr('');
    setSortBy('soonest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    costFilter !== 'all' ||
    spotsFilter !== 'all' ||
    sharedInterestsOnly ||
    compilerExpr !== '';

  return (
    <div className="space-y-6 pb-12 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">Discover Activities</h1>
          <p className="text-xs text-stone-500">
            Browse upcoming treks, sports, games, and cultural gatherings near you.
          </p>
        </div>

        <button
          onClick={onOpenCompiler}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Code className="w-3.5 h-3.5 text-indigo-700" />
          <span>Compiler Query Tool</span>
        </button>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by keyword, category, city, or interest tag..."
            className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 p-0.5 rounded text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Mode */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Cost
            </label>
            <select
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value as any)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Any Cost</option>
              <option value="free">Free Only</option>
              <option value="paid">Paid / Shared</option>
            </select>
          </div>

          {/* Spot Availability */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Capacity
            </label>
            <select
              value={spotsFilter}
              onChange={(e) => setSpotsFilter(e.target.value as any)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="open_only">Has Open Spots</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="soonest">Soonest Date</option>
              <option value="newest">Recently Added</option>
              <option value="best_match">Best Match</option>
            </select>
          </div>

          {/* Shared Interests Toggle */}
          <div className="flex flex-col justify-end">
            <button
              onClick={() => setSharedInterestsOnly(!sharedInterestsOnly)}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer text-center ${
                sharedInterestsOnly
                  ? 'bg-indigo-900 text-white border-indigo-900'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              Shared Interests {sharedInterestsOnly ? '✓' : ''}
            </button>
          </div>
        </div>

        {/* Active Filters Pill Bar & Results Count */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
          <div>
            Showing <strong className="text-stone-900">{filteredActivities.length}</strong> of{' '}
            {activities.length} activities
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Activity Cards Grid */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-3">
          <Compass className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-900 font-display">No Activities Found</h3>
          <p className="text-xs text-stone-500">
            No active activities match your search or filter combination. Try adjusting or resetting your filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 rounded-xl hover:bg-indigo-800 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredActivities.slice(0, displayCount).map((activity) => {
              // Calculate match score
              const isSameCity = activity.city.toLowerCase() === currentUser.city.toLowerCase();
              const hasSharedInterest = activity.requiredInterests.some((i) =>
                userInterestsSet.has(i.toLowerCase())
              );
              let score = 0;
              if (isSameCity) score += 40;
              if (hasSharedInterest) score += 50;

              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  matchScore={score > 0 ? score : undefined}
                  onClick={() => onNavigate('activity-detail', activity.id)}
                />
              );
            })}
          </div>

          {/* Load More Interaction */}
          {filteredActivities.length > displayCount && (
            <div className="text-center pt-4">
              <button
                onClick={() => setDisplayCount((prev) => prev + 6)}
                className="px-6 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Load More Activities ({filteredActivities.length - displayCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
