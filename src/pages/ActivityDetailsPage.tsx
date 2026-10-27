/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserCheck,
  Send,
  LogOut,
  Ban,
  Sparkles,
} from 'lucide-react';
import { Activity, ActivityRequest, User, UserPublicProfile } from '../types';
import { CostBreakdown } from '../components/CostBreakdown';
import { getCategoryIcon, getCategoryGradient } from '../components/ActivityCard';
import { JoinRequestModal } from '../components/JoinRequestModal';

interface ActivityDetailsPageProps {
  activity: Activity;
  currentUser: User;
  allUsers: UserPublicProfile[];
  activityRequests: ActivityRequest[];
  onBack: () => void;
  onSendJoinRequest: (activityId: string, message: string) => Promise<void>;
  onCancelJoinRequest: (requestId: string) => Promise<void>;
  onApproveRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  onLeaveActivity: (activityId: string) => Promise<void>;
  onCancelActivity: (activityId: string) => Promise<void>;
  onNavigate: (tab: string, param?: string) => void;
}

export const ActivityDetailsPage: React.FC<ActivityDetailsPageProps> = ({
  activity,
  currentUser,
  allUsers,
  activityRequests,
  onBack,
  onSendJoinRequest,
  onCancelJoinRequest,
  onApproveRequest,
  onRejectRequest,
  onLeaveActivity,
  onCancelActivity,
  onNavigate,
}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const Icon = getCategoryIcon(activity.category);
  const gradient = getCategoryGradient(activity.category);

  // Approved participants user objects
  const approvedUsers = useMemo(() => {
    return allUsers.filter((u) => activity.approvedParticipantIds.includes(u.id));
  }, [allUsers, activity.approvedParticipantIds]);

  // Host info
  const hostUser = useMemo(() => {
    return allUsers.find((u) => u.id === activity.creatorId);
  }, [allUsers, activity.creatorId]);

  // Determine current user's relationship with this activity
  const isHost = activity.creatorId === currentUser.id;
  const isApprovedGuest = activity.approvedParticipantIds.includes(currentUser.id);

  // Find user's request if any
  const userRequest = useMemo(() => {
    return activityRequests.find(
      (r) => r.activityId === activity.id && r.requesterId === currentUser.id
    );
  }, [activityRequests, activity.id, currentUser.id]);

  const isPending = userRequest?.status === 'pending';
  const isRejected = userRequest?.status === 'rejected';

  // Capacity calculations
  const approvedCount = activity.approvedParticipantIds.length;
  const spotsRemaining = Math.max(0, activity.participantLimit - approvedCount);
  const isFull = spotsRemaining === 0;
  const isCancelled = activity.status === 'cancelled';

  // Check if activity date is in past
  const isPast = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const actDate = new Date(`${activity.date}T23:59:59`);
    return actDate < today;
  }, [activity.date]);

  // Incoming requests for host
  const incomingRequests = useMemo(() => {
    return activityRequests.filter((r) => r.activityId === activity.id && r.status === 'pending');
  }, [activityRequests, activity.id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto font-body">
      {/* Top Navigation Back Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Activity'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {/* Visual Banner */}
        <div className={`h-48 sm:h-64 bg-gradient-to-tr ${gradient} p-6 flex flex-col justify-between text-white relative`}>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
              <Icon className="w-4 h-4" />
              <span>{activity.category}</span>
            </div>

            <div className="text-right">
              {activity.status === 'cancelled' ? (
                <span className="text-xs font-bold text-rose-300 bg-rose-950/80 px-3 py-1 rounded-lg border border-rose-500/40">
                  Cancelled
                </span>
              ) : isPast ? (
                <span className="text-xs font-bold text-stone-300 bg-black/50 px-3 py-1 rounded-lg">
                  Activity Completed
                </span>
              ) : isFull ? (
                <span className="text-xs font-bold text-amber-300 bg-black/50 px-3 py-1 rounded-lg">
                  At Full Capacity
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-300 bg-black/40 px-3 py-1 rounded-lg">
                  {spotsRemaining} Spot{spotsRemaining > 1 ? 's' : ''} Open
                </span>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
              {activity.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activity.city} · {activity.location}</span>
            </p>
          </div>
        </div>

        {/* Metadata Details Ribbon */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">
              Date & Time
            </span>
            <span className="font-semibold text-stone-800 text-sm mt-0.5 block">
              {activity.date}
            </span>
            <span className="text-stone-500">{activity.startTime} IST</span>
          </div>

          <div>
            <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">
              Meeting Point
            </span>
            <span className="font-semibold text-stone-800 text-sm mt-0.5 block truncate">
              {activity.location}
            </span>
            <span className="text-stone-500">{activity.city}</span>
          </div>

          <div>
            <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">
              Participant Limit
            </span>
            <span className="font-semibold text-stone-800 text-sm mt-0.5 block">
              {approvedCount} / {activity.participantLimit} members
            </span>
            <span className="text-stone-500">
              {spotsRemaining > 0 ? `${spotsRemaining} open spots` : 'Full'}
            </span>
          </div>

          <div>
            <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">
              Cost Arrangement
            </span>
            <span className="font-semibold text-stone-800 text-sm mt-0.5 block font-mono">
              {activity.costMode === 'free'
                ? 'Free'
                : activity.costMode === 'per_person'
                ? `₹${activity.costAmount} / person`
                : `₹${activity.costAmount} total shared`}
            </span>
            <span className="text-stone-500 capitalize">{activity.costMode.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Action Callout State Bar */}
        <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200">
          <div>
            {isHost ? (
              <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                <UserCheck className="w-4 h-4 text-indigo-700" />
                <span>You are the Host of this activity.</span>
              </div>
            ) : isApprovedGuest ? (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You are an approved participant in this activity!</span>
              </div>
            ) : isPending ? (
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Your request to join is pending review by {activity.creatorName}.</span>
              </div>
            ) : isRejected ? (
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Your join request was declined by the host.</span>
              </div>
            ) : isCancelled ? (
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>This activity has been cancelled by the host.</span>
              </div>
            ) : isPast ? (
              <div className="flex items-center gap-2 text-stone-500 font-semibold text-xs">
                <Calendar className="w-4 h-4 text-stone-400" />
                <span>This activity took place in the past.</span>
              </div>
            ) : isFull ? (
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>This activity has reached full participant capacity.</span>
              </div>
            ) : (
              <div className="text-xs text-stone-600">
                Interested in joining? Send a request to the host with an intro note.
              </div>
            )}
          </div>

          {/* Action Buttons based on state */}
          <div className="flex items-center gap-3">
            {isHost && !isCancelled && !isPast && (
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to cancel this activity?')) {
                    setActionLoading(true);
                    try {
                      await onCancelActivity(activity.id);
                      setStatusMessage({ type: 'success', text: 'Activity cancelled.' });
                    } catch (err: any) {
                      setStatusMessage({ type: 'error', text: err.message });
                    } finally {
                      setActionLoading(false);
                    }
                  }
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200"
              >
                Cancel Activity
              </button>
            )}

            {!isHost && isApprovedGuest && (
              <button
                onClick={async () => {
                  if (confirm('Leave this activity? Your approved spot will be released.')) {
                    setActionLoading(true);
                    try {
                      await onLeaveActivity(activity.id);
                      setStatusMessage({ type: 'success', text: 'You have left the activity.' });
                    } catch (err: any) {
                      setStatusMessage({ type: 'error', text: err.message });
                    } finally {
                      setActionLoading(false);
                    }
                  }
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave Activity</span>
              </button>
            )}

            {!isHost && isPending && userRequest && (
              <button
                onClick={async () => {
                  setActionLoading(true);
                  try {
                    await onCancelJoinRequest(userRequest.id);
                    setStatusMessage({ type: 'success', text: 'Join request withdrawn.' });
                  } catch (err: any) {
                    setStatusMessage({ type: 'error', text: err.message });
                  } finally {
                    setActionLoading(false);
                  }
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Withdraw Request
              </button>
            )}

            {!isHost && !isApprovedGuest && !isPending && !isCancelled && !isPast && !isFull && (
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request to Join</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Split Details Section: Description & Sidecards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Host incoming requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Host Incoming Requests Panel (Shown if Current User is Host) */}
          {isHost && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-700" />
                  <h3 className="text-sm font-bold text-stone-900 font-display">
                    Pending Join Requests ({incomingRequests.length})
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500">
                  {spotsRemaining} spot{spotsRemaining !== 1 ? 's' : ''} left
                </span>
              </div>

              {incomingRequests.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No pending requests at this time.</p>
              ) : (
                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-800 text-white flex items-center justify-center font-bold text-xs">
                            {req.requesterName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900">{req.requesterName}</span>
                            <span className="text-[11px] text-stone-500 block">
                              {req.requesterCity}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              setActionLoading(true);
                              try {
                                await onRejectRequest(req.id);
                                setStatusMessage({ type: 'success', text: 'Request declined.' });
                              } catch (err: any) {
                                setStatusMessage({ type: 'error', text: err.message });
                              } finally {
                                setActionLoading(false);
                              }
                            }}
                            disabled={actionLoading}
                            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-lg cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={async () => {
                              setActionLoading(true);
                              try {
                                await onApproveRequest(req.id);
                                setStatusMessage({
                                  type: 'success',
                                  text: `${req.requesterName} approved!`,
                                });
                              } catch (err: any) {
                                setStatusMessage({ type: 'error', text: err.message });
                              } finally {
                                setActionLoading(false);
                              }
                            }}
                            disabled={actionLoading}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      </div>

                      {req.message && (
                        <p className="text-stone-600 bg-white p-2.5 rounded-lg border border-stone-100 text-[11px] italic">
                          “{req.message}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 font-display">About This Activity</h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {activity.description}
            </p>

            <div className="pt-4 border-t border-stone-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Required / Relevant Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activity.requiredInterests.map((interest) => (
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

          {/* Approved Participants Roster */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Confirmed Group ({approvedCount + 1} members)
                </h3>
                <p className="text-xs text-stone-500">
                  Host and approved participants who will attend
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-stone-600">
                Limit: {activity.participantLimit} guests
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Host Card */}
              <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-xs">
                    {activity.creatorName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900">{activity.creatorName}</h5>
                    <span className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wider">
                      Activity Host
                    </span>
                  </div>
                </div>
              </div>

              {/* Approved Participants */}
              {approvedUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-stone-700 text-white flex items-center justify-center font-bold text-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-900">{user.fullName}</h5>
                      <span className="text-[10px] text-stone-500">{user.city}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Cost Breakdown & Host Card */}
        <div className="space-y-6">
          {/* Dynamic Cost Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-900 font-display">Expense & Cost Sharing</h3>
            <CostBreakdown
              costMode={activity.costMode}
              costAmount={activity.costAmount}
              approvedCount={approvedCount}
              participantLimit={activity.participantLimit}
            />
          </div>

          {/* Host Profile Info Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900 font-display">Hosted by</h3>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-base font-display shrink-0">
                {activity.creatorName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-stone-900 text-sm truncate">
                  {activity.creatorName}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {hostUser?.city || activity.city}
                  {hostUser?.locality ? ` · ${hostUser.locality}` : ''}
                </p>
                {hostUser?.bio && (
                  <p className="text-stone-600 text-[11px] mt-2 line-clamp-3 leading-relaxed">
                    {hostUser.bio}
                  </p>
                )}
              </div>
            </div>

            {hostUser && (
              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => onNavigate('profile', hostUser.id)}
                  className="w-full py-2 text-center text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                >
                  View Host Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        activity={activity}
        currentUser={currentUser}
        onSubmit={async (actId, msg) => {
          await onSendJoinRequest(actId, msg);
          setStatusMessage({
            type: 'success',
            text: 'Your request has been sent to the host for approval!',
          });
        }}
      />
    </div>
  );
};
