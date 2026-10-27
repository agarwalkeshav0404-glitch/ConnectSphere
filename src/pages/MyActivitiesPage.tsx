/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  LogOut,
  Ban,
  UserCheck,
  Send,
  MapPin,
} from 'lucide-react';
import { Activity, ActivityRequest, User } from '../types';

interface MyActivitiesPageProps {
  currentUser: User;
  activities: Activity[];
  activityRequests: ActivityRequest[];
  onNavigate: (tab: string, param?: string) => void;
  onApproveRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  onCancelRequest: (requestId: string) => Promise<void>;
  onLeaveActivity: (activityId: string) => Promise<void>;
  onCancelActivity: (activityId: string) => Promise<void>;
}

export const MyActivitiesPage: React.FC<MyActivitiesPageProps> = ({
  currentUser,
  activities,
  activityRequests,
  onNavigate,
  onApproveRequest,
  onRejectRequest,
  onCancelRequest,
  onLeaveActivity,
  onCancelActivity,
}) => {
  const [activeTab, setActiveTab] = useState<
    'created' | 'incoming' | 'sent' | 'joined' | 'past' | 'cancelled'
  >('created');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Derived datasets
  const createdActivities = useMemo(() => {
    return activities.filter((a) => a.creatorId === currentUser.id && a.status !== 'cancelled');
  }, [activities, currentUser.id]);

  const cancelledActivities = useMemo(() => {
    return activities.filter((a) => a.creatorId === currentUser.id && a.status === 'cancelled');
  }, [activities, currentUser.id]);

  const joinedActivities = useMemo(() => {
    return activities.filter(
      (a) =>
        a.creatorId !== currentUser.id &&
        a.approvedParticipantIds.includes(currentUser.id) &&
        a.status !== 'cancelled'
    );
  }, [activities, currentUser.id]);

  const sentRequests = useMemo(() => {
    return activityRequests.filter((r) => r.requesterId === currentUser.id);
  }, [activityRequests, currentUser.id]);

  const myActivityIds = useMemo(() => {
    return new Set(activities.filter((a) => a.creatorId === currentUser.id).map((a) => a.id));
  }, [activities, currentUser.id]);

  const incomingRequests = useMemo(() => {
    return activityRequests.filter((r) => myActivityIds.has(r.activityId));
  }, [activityRequests, myActivityIds]);

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'pending').length;

  const pastActivities = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return activities.filter((a) => {
      const actDate = new Date(`${a.date}T23:59:59`);
      const isPast = actDate < today;
      const isRelevant =
        a.creatorId === currentUser.id || a.approvedParticipantIds.includes(currentUser.id);
      return isPast && isRelevant;
    });
  }, [activities, currentUser.id]);

  return (
    <div className="space-y-6 pb-16 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">My Activities</h1>
          <p className="text-xs text-stone-500">
            Track activities you are hosting, join requests you’ve received or sent, and confirmed participations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-activity')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Host New Activity</span>
        </button>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-stone-200 flex gap-2 overflow-x-auto text-xs pb-1">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'created'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Created by Me ({createdActivities.length})
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 relative ${
            activeTab === 'incoming'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Incoming Requests
          {pendingIncomingCount > 0 ? (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-violet-600 text-white">
              {pendingIncomingCount}
            </span>
          ) : (
            <span className="ml-1 text-stone-400">({incomingRequests.length})</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'sent'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Requests Sent ({sentRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('joined')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'joined'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Joined Activities ({joinedActivities.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'past'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Past ({pastActivities.length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-3 py-2 font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-1 ${
            activeTab === 'cancelled'
              ? 'border-indigo-700 text-indigo-900'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          Cancelled ({cancelledActivities.length})
        </button>
      </div>

      {/* Tab 1: Created by Me */}
      {activeTab === 'created' && (
        <div className="space-y-4">
          {createdActivities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-900 font-display">No Hosted Activities</h3>
              <p className="text-xs text-stone-500">
                You haven't published any activities yet. Create your first trek, meetup, or game night!
              </p>
              <button
                onClick={() => onNavigate('create-activity')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-colors cursor-pointer"
              >
                Create an Activity
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {createdActivities.map((act) => {
                const spots = act.participantLimit - act.approvedParticipantIds.length;
                const actPending = incomingRequests.filter(
                  (r) => r.activityId === act.id && r.status === 'pending'
                ).length;

                return (
                  <div
                    key={act.id}
                    className="bg-white rounded-2xl border border-stone-200 hover:border-indigo-300 transition-all p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-indigo-900">{act.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{act.date} at {act.startTime}</span>
                        <span aria-hidden="true">·</span>
                        <span>{act.city}</span>
                      </div>
                      <h3
                        onClick={() => onNavigate('activity-detail', act.id)}
                        className="text-base font-bold text-stone-900 hover:text-indigo-900 cursor-pointer font-display"
                      >
                        {act.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-stone-600">
                        <span>
                          {act.approvedParticipantIds.length} of {act.participantLimit} spots filled
                        </span>
                        {actPending > 0 && (
                          <span className="text-violet-700 font-bold bg-violet-50 px-2 py-0.5 rounded">
                            {actPending} pending request{actPending > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('activity-detail', act.id)}
                        className="px-3 py-2 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                      >
                        Manage & Roster
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('Cancel this activity? This will notify participants.')) {
                            await onCancelActivity(act.id);
                          }
                        }}
                        className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer border border-rose-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Requests for My Activities */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto text-xs text-stone-500">
              No join requests received yet for your activities.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => {
                const targetActivity = activities.find((a) => a.id === req.activityId);

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">
                            {req.requesterName}
                          </span>
                          <span className="text-[11px] text-stone-500">from {req.requesterCity}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.status === 'pending'
                                ? 'bg-amber-100 text-amber-900'
                                : req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-900'
                                : req.status === 'rejected'
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-950 font-medium mt-0.5">
                          Requested for: <strong>{targetActivity?.title || 'Activity'}</strong> (
                          {targetActivity?.date})
                        </p>
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              setLoadingId(req.id);
                              try {
                                await onRejectRequest(req.id);
                              } finally {
                                setLoadingId(null);
                              }
                            }}
                            disabled={loadingId === req.id}
                            className="px-3 py-1.5 font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={async () => {
                              setLoadingId(req.id);
                              try {
                                await onApproveRequest(req.id);
                              } finally {
                                setLoadingId(null);
                              }
                            }}
                            disabled={loadingId === req.id}
                            className="px-4 py-1.5 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>

                    {req.message && (
                      <p className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-stone-700 italic">
                        “{req.message}”
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Requests Sent by Me */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Send className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-900 font-display">No Sent Requests</h3>
              <p className="text-xs text-stone-500">
                You haven't requested to join any activities yet. Discover local groups and send requests!
              </p>
              <button
                onClick={() => onNavigate('discover')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-colors cursor-pointer"
              >
                Explore Activities
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sentRequests.map((req) => {
                const targetActivity = activities.find((a) => a.id === req.activityId);

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                            req.status === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-900'
                              : req.status === 'rejected'
                              ? 'bg-rose-100 text-rose-900'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {req.status === 'pending' ? 'Pending Host Review' : req.status.toUpperCase()}
                        </span>
                        <h4
                          onClick={() => targetActivity && onNavigate('activity-detail', targetActivity.id)}
                          className="font-bold text-sm text-stone-900 hover:text-indigo-900 cursor-pointer font-display"
                        >
                          {targetActivity?.title || 'Activity'}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Hosted by {targetActivity?.creatorName} · {targetActivity?.date} in{' '}
                          {targetActivity?.city}
                        </p>
                      </div>

                      {req.status === 'pending' && (
                        <button
                          onClick={async () => {
                            if (confirm('Withdraw this join request?')) {
                              await onCancelRequest(req.id);
                            }
                          }}
                          className="px-3 py-1.5 font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer transition-colors self-start sm:self-auto"
                        >
                          Withdraw Request
                        </button>
                      )}

                      {req.status === 'approved' && (
                        <button
                          onClick={() => targetActivity && onNavigate('activity-detail', targetActivity.id)}
                          className="px-3 py-1.5 font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors self-start sm:self-auto"
                        >
                          View Activity Roster
                        </button>
                      )}
                    </div>

                    {req.message && (
                      <p className="p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-stone-600 text-[11px] italic">
                        Your note: “{req.message}”
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Joined Activities */}
      {activeTab === 'joined' && (
        <div className="space-y-4">
          {joinedActivities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto text-xs text-stone-500">
              You haven't joined any activities yet. Once a host approves your request, it will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {joinedActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-indigo-300 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                      Confirmed Participant
                    </span>
                    <h4
                      onClick={() => onNavigate('activity-detail', act.id)}
                      className="font-bold text-sm text-stone-900 hover:text-indigo-900 cursor-pointer font-display"
                    >
                      {act.title}
                    </h4>
                    <p className="text-stone-500">
                      Host: {act.creatorName} · {act.date} at {act.startTime} · {act.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('activity-detail', act.id)}
                      className="px-3 py-2 font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Leave this activity? Your spot will be made available.')) {
                          await onLeaveActivity(act.id);
                        }
                      }}
                      className="px-3 py-2 font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Past Activities */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastActivities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto text-xs text-stone-500">
              No completed past activities recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {pastActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm text-xs opacity-80 space-y-1"
                >
                  <span className="text-[10px] font-semibold text-stone-500">Completed Activity</span>
                  <h4 className="font-bold text-stone-900 text-sm">{act.title}</h4>
                  <p className="text-stone-500">{act.date} · {act.city}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Cancelled Activities */}
      {activeTab === 'cancelled' && (
        <div className="space-y-4">
          {cancelledActivities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto text-xs text-stone-500">
              No cancelled activities.
            </div>
          ) : (
            <div className="space-y-3">
              {cancelledActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm text-xs space-y-1 bg-stone-50/50"
                >
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Cancelled
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm">{act.title}</h4>
                  <p className="text-stone-500">{act.date} · {act.city}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
