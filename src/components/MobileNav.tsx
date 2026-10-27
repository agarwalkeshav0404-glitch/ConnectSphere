/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Users, Calendar, Plus, User as UserIcon } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  pendingRequestsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onNavigate,
  pendingRequestsCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2 px-3 flex items-center justify-around text-[11px] font-medium text-stone-500 shadow-lg">
      <button
        onClick={() => onNavigate('discover')}
        className={`flex flex-col items-center gap-1 cursor-pointer ${
          activeTab === 'discover' ? 'text-indigo-900 font-semibold' : 'hover:text-stone-900'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Discover</span>
      </button>

      <button
        onClick={() => onNavigate('companions')}
        className={`flex flex-col items-center gap-1 cursor-pointer ${
          activeTab === 'companions' ? 'text-indigo-900 font-semibold' : 'hover:text-stone-900'
        }`}
      >
        <Users className="w-5 h-5" />
        <span>Companions</span>
      </button>

      <button
        onClick={() => onNavigate('create-activity')}
        className="flex flex-col items-center gap-1 text-indigo-900 font-semibold cursor-pointer -mt-4"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center shadow-md">
          <Plus className="w-5 h-5" />
        </div>
        <span>Create</span>
      </button>

      <button
        onClick={() => onNavigate('my-activities')}
        className={`relative flex flex-col items-center gap-1 cursor-pointer ${
          activeTab === 'my-activities' ? 'text-indigo-900 font-semibold' : 'hover:text-stone-900'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>Activities</span>
        {pendingRequestsCount > 0 && (
          <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-violet-600" />
        )}
      </button>

      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center gap-1 cursor-pointer ${
          activeTab === 'profile' ? 'text-indigo-900 font-semibold' : 'hover:text-stone-900'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
