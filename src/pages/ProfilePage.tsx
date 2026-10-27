/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User as UserIcon,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Lock,
  Edit3,
  Check,
  RefreshCw,
  Download,
  Trash2,
  Sparkles,
  ShieldAlert,
  Save,
} from 'lucide-react';
import { User, UserPublicProfile } from '../types';
import { ALL_INTERESTS, localAdapter } from '../services/storage/localAdapter';

interface ProfilePageProps {
  currentUser: User;
  viewingUser?: UserPublicProfile | null;
  onUpdateProfile: (data: {
    fullName: string;
    city: string;
    locality?: string;
    bio?: string;
    interests: string[];
  }) => Promise<void>;
  onResetSeeds: () => void;
  onSignOut: () => void;
  onOpenDemoSwitcher: () => void;
  onOpenAcademicModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  viewingUser,
  onUpdateProfile,
  onResetSeeds,
  onSignOut,
  onOpenDemoSwitcher,
  onOpenAcademicModal,
}) => {
  const isOwner = !viewingUser || viewingUser.id === currentUser.id;
  const user = isOwner ? currentUser : viewingUser;

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [city, setCity] = useState(currentUser.city);
  const [locality, setLocality] = useState(currentUser.locality || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUser.interests);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile({
        fullName: fullName.trim(),
        city: city.trim(),
        locality: locality.trim(),
        bio: bio.trim(),
        interests: selectedInterests,
      });
      setIsEditing(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      users: localAdapter.getUsers(),
      activities: localAdapter.getActivities(),
      requests: localAdapter.getRequests(),
      friends: localAdapter.getFriendRequests(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connectsphere_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-body">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-900 p-6 flex items-end">
          <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg translate-y-10">
            <div className="w-full h-full rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold font-display text-2xl">
              {user.fullName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="pt-14 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-stone-900 font-display">
                  {user.fullName}
                </h1>
                {user.isDemoUser && (
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">
                    DEMO PERSONA
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{user.city}</span>
                {user.locality && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{user.locality}</span>
                  </>
                )}
              </p>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Edit Form or Display */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Locality</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Indiranagar"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Your Interests (Selected: {selectedInterests.length})
                </label>
                <div className="max-h-40 overflow-y-auto p-2 bg-stone-50 border border-stone-200 rounded-xl flex flex-wrap gap-1.5">
                  {ALL_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
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

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Bio */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  About
                </span>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl">
                  {user.bio || 'No personal bio added yet.'}
                </p>
              </div>

              {/* Interests */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Interests ({user.interests.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-100"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Owner-Only Private Information Section */}
      {isOwner && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-700" />
              <h3 className="text-base font-bold text-stone-900 font-display">
                Private Account Information
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              OWNER ONLY · NEVER EXPOSED
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            These fields are protected by Row-Level Security in production and never displayed to other users on public cards or companion lists.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
                Email Address
              </span>
              <span className="font-semibold text-stone-800 truncate block">
                {currentUser.email}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
                Date of Birth
              </span>
              <span className="font-semibold text-stone-800 block">
                {currentUser.dateOfBirth} (18+ verified)
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
                Gender Identity
              </span>
              <span className="font-semibold text-stone-800 capitalize block">
                {currentUser.gender.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Settings & Demo Controls (Owner only) */}
      {isOwner && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <h3 className="text-base font-bold text-stone-900 font-display">
            Storage & Settings
          </h3>

          <div className="space-y-3 text-xs">
            {/* Mode status */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-indigo-950 block">Local Demo Storage Active</span>
                <span className="text-stone-600 text-[11px]">
                  All activities, requests, and profiles persist in your browser's local storage.
                </span>
              </div>
              <button
                onClick={onOpenDemoSwitcher}
                className="px-3 py-1.5 font-semibold text-indigo-900 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 cursor-pointer self-start sm:self-auto shrink-0"
              >
                Switch Account
              </button>
            </div>

            {/* Actions list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleExportData}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-indigo-300 hover:bg-stone-50 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-stone-900">Export Application JSON</h4>
                  <p className="text-[11px] text-stone-500">
                    Download complete snapshot of local activities and users
                  </p>
                </div>
                <Download className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  if (
                    confirm('Reset database to clean initial demonstration seed records?')
                  ) {
                    onResetSeeds();
                  }
                }}
                className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-stone-900">Reset Demo Seeds</h4>
                  <p className="text-[11px] text-stone-500">
                    Restore original sample activities, personas, and requests
                  </p>
                </div>
                <RefreshCw className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Sign out */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={onSignOut}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
