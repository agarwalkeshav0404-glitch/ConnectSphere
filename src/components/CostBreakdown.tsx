/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IndianRupee, Users, Info } from 'lucide-react';
import { CostMode } from '../types';

interface CostBreakdownProps {
  costMode: CostMode;
  costAmount: number;
  approvedCount: number;
  participantLimit: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  costMode,
  costAmount,
  approvedCount,
  participantLimit,
}) => {
  if (costMode === 'free') {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            ₹0
          </div>
          <div>
            <p className="font-semibold text-emerald-950">Free Activity</p>
            <p className="text-emerald-700 text-[11px]">No ticket, venue, or shared expense required.</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Free</span>
      </div>
    );
  }

  if (costMode === 'per_person') {
    return (
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold font-mono">
            ₹{costAmount}
          </div>
          <div>
            <p className="font-semibold text-indigo-950">Fixed Cost Per Person</p>
            <p className="text-stone-600 text-[11px]">Individual entry fee, ticket, or fixed personal share.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold font-mono text-indigo-950">₹{costAmount}</span>
          <span className="block text-[10px] text-stone-500">per participant</span>
        </div>
      </div>
    );
  }

  // total_shared mode: dynamic calculation
  // Total participants = approved participants + 1 host
  const currentTotalGroup = approvedCount + 1;
  const currentPerPersonShare = Math.round(costAmount / currentTotalGroup);

  // Maximum group share (if filled to capacity)
  const maxGroup = participantLimit + 1;
  const minPerPersonShare = Math.round(costAmount / maxGroup);

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-700" />
          <span className="font-semibold text-stone-900">Total Shared Group Cost</span>
        </div>
        <span className="font-mono font-bold text-sm text-stone-900">₹{costAmount.toLocaleString()} total</span>
      </div>

      <p className="text-stone-600 text-[11px] leading-relaxed">
        Total expense (e.g. cab, guide, private rental) is split equally among all confirmed members including the host.
      </p>

      {/* Dynamic calculation box */}
      <div className="bg-white border border-stone-200 rounded-lg p-3 grid grid-cols-2 gap-4 text-center">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">
            Current Share ({currentTotalGroup} people)
          </span>
          <span className="text-base font-bold font-mono text-indigo-900">
            ₹{currentPerPersonShare}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">₹{costAmount} ÷ {currentTotalGroup}</span>
        </div>

        <div className="border-l border-stone-100 pl-2">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-medium">
            At Max Capacity ({maxGroup} people)
          </span>
          <span className="text-base font-bold font-mono text-stone-800">
            ₹{minPerPersonShare}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">₹{costAmount} ÷ {maxGroup}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
        <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span>Your estimated share decreases as more companions join and get approved.</span>
      </div>
    </div>
  );
};
