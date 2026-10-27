/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Users,
  Calendar,
  Plus,
  BookOpen,
  FlaskConical,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Bell,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  onNavigate: (tab: string, param?: string) => void;
  pendingRequestsCount: number;
  onOpenDemoSwitcher: () => void;
  onOpenAcademicModal?: () => void;
  onOpenQueryCompiler: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onNavigate,
  pendingRequestsCount,
  onOpenDemoSwitcher,
  onOpenAcademicModal,
  onOpenQueryCompiler,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Demo Mode Notice Banner */}
      <div className="bg-indigo-950 text-indigo-100 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="font-semibold text-indigo-300">DEMO MODE ACTIVE</span>
        <span aria-hidden="true" className="text-indigo-400">·</span>
        <span>Simulated local storage with realistic Bengaluru community data</span>
        <span aria-hidden="true" className="text-indigo-400">·</span>
        <button
          onClick={onOpenDemoSwitcher}
          className="underline text-amber-300 hover:text-amber-200 font-medium cursor-pointer transition-colors"
        >
          Switch Account ({currentUser?.fullName.split(' ')[0] || 'User'})
        </button>
      </div>

      {/* Main Top Bar adhering to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-indigo-950 font-display block leading-none">
                ConnectSphere
              </span>
              <span className="text-[10px] text-stone-500 font-medium tracking-wide">
                DISCOVER & MATCH
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (1-line whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 shrink-0">
          <button
            onClick={() => onNavigate('discover')}
            className={`cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'discover'
                ? 'text-indigo-900 font-semibold border-b-2 border-indigo-700 pb-1 -mb-1'
                : 'hover:text-stone-900'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => onNavigate('companions')}
            className={`cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'companions'
                ? 'text-indigo-900 font-semibold border-b-2 border-indigo-700 pb-1 -mb-1'
                : 'hover:text-stone-900'
            }`}
          >
            Companions
          </button>
          <button
            onClick={() => onNavigate('my-activities')}
            className={`relative cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'my-activities'
                ? 'text-indigo-900 font-semibold border-b-2 border-indigo-700 pb-1 -mb-1'
                : 'hover:text-stone-900'
            }`}
          >
            My Activities
            {pendingRequestsCount > 0 && (
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-violet-600 text-white">
                {pendingRequestsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate('friends')}
            className={`cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'friends'
                ? 'text-indigo-900 font-semibold border-b-2 border-indigo-700 pb-1 -mb-1'
                : 'hover:text-stone-900'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => onNavigate('auth', 'signin')}
            className={`cursor-pointer transition-colors whitespace-nowrap font-medium ${
              activeTab === 'auth'
                ? 'text-indigo-900 font-semibold border-b-2 border-indigo-700 pb-1 -mb-1'
                : 'hover:text-stone-900 text-stone-600'
            }`}
          >
            Log In / Sign Up
          </button>
          <button
            onClick={() => onNavigate('tests')}
            className="cursor-pointer text-stone-600 hover:text-indigo-900 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Tests</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('create-activity')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Activity</span>
          </button>

          {/* User Account / Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-stone-200 hover:border-indigo-300 bg-stone-50/80 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-700 text-white flex items-center justify-center text-xs font-bold font-display">
                {currentUser?.fullName.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-stone-800 hidden sm:inline max-w-[100px] truncate">
                {currentUser?.fullName.split(' ')[0] || 'User'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-stone-200 shadow-xl py-2 z-50 text-xs"
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="font-semibold text-stone-900">{currentUser?.fullName}</p>
                  <p className="text-stone-500 truncate">{currentUser?.email}</p>
                  <p className="text-[10px] text-indigo-700 font-medium mt-1">
                    {currentUser?.city} · {currentUser?.interests.length || 0} interests
                  </p>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-700 cursor-pointer"
                >
                  View Profile & Settings
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenDemoSwitcher();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-indigo-900 font-medium cursor-pointer"
                >
                  Switch Demo Account
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenQueryCompiler();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-700 cursor-pointer"
                >
                  Compiler Query Parser
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigate('auth', 'signin');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 text-indigo-900 font-medium cursor-pointer"
                >
                  Log In / Create Account
                </button>
                <div className="border-t border-stone-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('auth', 'signin');
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    Sign Out / Switch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
