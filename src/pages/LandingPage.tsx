/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Users,
  Shield,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Lock,
  HeartHandshake,
  MessageSquare,
  BookOpen,
  MapPin,
  ChevronRight,
  Footprints,
  Plane,
  Dumbbell,
  Dice5,
  Utensils,
  Music,
} from 'lucide-react';
import { ActivityCategory } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onExplore: () => void;
  onSignIn?: () => void;
  onOpenAcademicModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExplore,
  onSignIn,
  onOpenAcademicModal,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<
    'about' | 'how-it-works' | 'terms' | 'privacy' | 'contact' | null
  >(null);

  const categories: Array<{ label: ActivityCategory; icon: any; count: string }> = [
    { label: 'Trekking & Outdoors', icon: Footprints, count: '14 Activities' },
    { label: 'Board Games & Social', icon: Dice5, count: '9 Activities' },
    { label: 'Food & Cafes', icon: Utensils, count: '18 Activities' },
    { label: 'Sports & Fitness', icon: Dumbbell, count: '12 Activities' },
    { label: 'Music & Concerts', icon: Music, count: '8 Activities' },
    { label: 'Travel & Trips', icon: Plane, count: '6 Activities' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Verify 18+ age requirement, specify your city and choose your favorite recreational activities.',
    },
    {
      num: '02',
      title: 'Select Shared Interests',
      desc: 'Pick from 20 rich interest categories from trekking and board games to tech meetups and cafes.',
    },
    {
      num: '03',
      title: 'Discover Activities & Companions',
      desc: 'Explore activities or use our transparent Jaccard similarity algorithm to match with peers.',
    },
    {
      num: '04',
      title: 'Request to Join with Confidence',
      desc: 'Hosts review and approve participants ensuring safety, balanced group sizes, and shared expectations.',
    },
    {
      num: '05',
      title: 'Coordinate Plans & Fair Expenses',
      desc: 'Split cabs, permits, rentals, or tickets transparently with dynamic per-person cost calculations.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Finding reliable companions for early sunrise treks near Bengaluru used to be hit-or-miss. With ConnectSphere, I joined the Skandagiri group and met people who match my pace and love for outdoor photography.',
      name: 'Pooja Hegde',
      role: 'Student & Amateur Hiker',
      city: 'Bengaluru',
      activity: 'Sunrise Trek to Skandagiri',
    },
    {
      quote:
        'The shared cost breakdown makes coordinating weekend board game cafe rentals painless. Everyone knows their share beforehand, and host approval keeps game nights comfortable and well-organized.',
      name: 'Karthik Raman',
      role: 'Software Developer',
      city: 'Bengaluru',
      activity: 'Strategy Board Game Evening',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-indigo-950 flex flex-col font-body">
      {/* Top Header */}
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-indigo-950">
              ConnectSphere
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
            <button
              onClick={() => setActiveLegalModal('how-it-works')}
              className="hover:text-indigo-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              How It Works
            </button>
            <button
              onClick={onExplore}
              className="hover:text-indigo-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Activities
            </button>
            <button
              onClick={() => setActiveLegalModal('about')}
              className="hover:text-indigo-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              About
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onExplore}
              className="text-xs font-semibold text-stone-700 hover:text-indigo-900 px-3 py-2 transition-colors cursor-pointer hidden sm:inline"
            >
              Explore Activities
            </button>
            <button
              onClick={onSignIn || onGetStarted}
              className="text-xs font-semibold text-indigo-900 hover:text-indigo-800 bg-indigo-50 border border-indigo-200/80 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-stone-200 bg-gradient-to-b from-white to-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                <span>Find Your People. Share Your Experiences.</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 font-display tracking-tight leading-[1.1] text-balance">
                Discover local activities and compatible companions.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                Whether you want to go trekking in the Western Ghats, play board games on Friday,
                catch a film, or embark on a weekend road trip, ConnectSphere connects you with
                peers sharing your interests, values, and enthusiasm.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3 text-sm font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Sign Up / Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onSignIn || onGetStarted}
                  className="px-5 py-3 text-sm font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={onExplore}
                  className="px-5 py-3 text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-all cursor-pointer"
                >
                  Browse Demo Activities
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-xs text-stone-500">
                <div>
                  <strong className="block text-stone-900 font-display text-base">18+ Only</strong>
                  <span>Age verification verified</span>
                </div>
                <div>
                  <strong className="block text-stone-900 font-display text-base">Host Control</strong>
                  <span>Private approval workflows</span>
                </div>
                <div>
                  <strong className="block text-stone-900 font-display text-base">Transparent</strong>
                  <span>Fair shared cost math</span>
                </div>
              </div>
            </div>

            {/* Right Card Mockup: Western Ghats Trek & Boardgames */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                      <Footprints className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">Sunrise Trek to Skandagiri</h4>
                      <p className="text-[11px] text-stone-500">Bengaluru · Saturday 3:30 AM</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    95% Match
                  </span>
                </div>

                <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-2 border border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Host:</span>
                    <span className="font-semibold text-stone-800">Aarav Sharma</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Capacity:</span>
                    <span className="font-semibold text-stone-800">2 of 6 spots remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Shared Cost:</span>
                    <span className="font-semibold font-mono text-stone-900">₹600 / person (₹2,400 total)</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-indigo-900 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  <span>You share 4 interests: Trekking, Photography, Cafes, Road trips</span>
                </div>

                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-all cursor-pointer"
                >
                  Join Similar Activities
                </button>
              </div>

              {/* Sample Companion Match preview */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-700 text-white flex items-center justify-center font-bold font-display text-sm">
                    D
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Diya Patel</h5>
                    <p className="text-[10px] text-stone-500">Koramangala, Bengaluru · 88% Match</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Shared: Board games, Cafes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Categories Highlights */}
      <section className="py-16 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Recreation Domain
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Explore Popular Activity Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Discover curated activities across sports, adventures, creative arts, and social gatherings.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={onExplore}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-indigo-300 hover:shadow-md transition-all text-center space-y-2 cursor-pointer group bg-stone-50/50"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-100 group-hover:bg-indigo-900 group-hover:text-white text-indigo-900 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-indigo-900 transition-colors">
                    {cat.label}
                  </h4>
                  <p className="text-[10px] text-stone-500">{cat.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 border-b border-stone-200 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Step-by-Step Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              How ConnectSphere Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              From discovering peers to participating in shared adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 relative shadow-sm"
              >
                <span className="text-2xl font-black font-display text-indigo-900/30 block">
                  {step.num}
                </span>
                <h4 className="text-sm font-bold text-stone-900">{step.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Privacy Section */}
      <section className="py-16 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Built-in Safeguards
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                Safety and Privacy by Design
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                ConnectSphere is built for respectful, authentic real-world connections. We keep private
                information safe and give hosts and guests total transparency over who they meet.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Strict Minimum Age (18+)</h5>
                    <p className="text-xs text-stone-500">
                      Enforced both in client schema validation and relational database constraints.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Zero Contact Leakage</h5>
                    <p className="text-xs text-stone-500">
                      Email addresses, phone numbers, and birthdates are never exposed on public profiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900">Host Approval & Blocking</h5>
                    <p className="text-xs text-stone-500">
                      Every participant must be approved by the host. Block any user to immediately prevent interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-stone-900 font-display">
                Community Guidelines Highlights
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 list-disc list-inside">
                <li>Meet in public or designated outdoor group trailheads.</li>
                <li>Communicate shared cost agreements before confirming participation.</li>
                <li>Respect RSVP commitments to ensure accurate group reservations.</li>
                <li>Zero tolerance for harassment, discrimination, or commercial solicitation.</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => setActiveLegalModal('terms')}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                >
                  Review Complete Draft Terms & Community Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Clearly Identified as Sample Demonstration Content) */}
      <section className="py-16 border-b border-stone-200 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Sample Community Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display mt-1">
              Loved by Bengaluru Students & Professionals
            </h2>
            <p className="text-[11px] text-stone-400 mt-1 italic">
              (Sample demonstration testimonials representing realistic user scenarios)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm"
              >
                <p className="text-xs text-stone-600 italic leading-relaxed">“{t.quote}”</p>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-stone-900">{t.name}</h5>
                    <p className="text-stone-500 text-[11px]">
                      {t.role} · {t.city}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded">
                    {t.activity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with Draft Notices */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-stone-800 pb-8">
            <div className="space-y-1">
              <span className="text-lg font-bold text-white font-display">ConnectSphere</span>
              <p className="text-stone-400 max-w-md">
                Activity Discovery & Companion-Matching Application. Built for academic demonstration and local-first community exploration.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-xs text-stone-300">
              <button
                onClick={() => setActiveLegalModal('about')}
                className="hover:text-white cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => setActiveLegalModal('how-it-works')}
                className="hover:text-white cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => setActiveLegalModal('terms')}
                className="hover:text-white cursor-pointer"
              >
                Draft Terms
              </button>
              <button
                onClick={() => setActiveLegalModal('privacy')}
                className="hover:text-white cursor-pointer"
              >
                Draft Privacy
              </button>
              <button
                onClick={() => setActiveLegalModal('contact')}
                className="hover:text-white cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={onSignIn || onGetStarted}
                className="text-indigo-300 hover:text-white cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
            <p>© 2026 ConnectSphere. Find Your People. Share Your Experiences.</p>
            <p className="text-amber-400/80">
              Draft legal texts are sample placeholders for community review only.
            </p>
          </div>
        </div>
      </footer>

      {/* Legal & Informational Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 font-display capitalize">
                {activeLegalModal.replace('-', ' ')} (Draft Document)
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg text-[11px]">
                <strong>Academic Notice:</strong> This text is a draft document created for college project demonstration purposes and must be reviewed by legal counsel before public production deployment.
              </div>

              {activeLegalModal === 'about' && (
                <>
                  <p>
                    <strong>ConnectSphere</strong> is designed to solve social isolation and recreation coordination challenges faced by students and working professionals in metropolitan hubs like Bengaluru.
                  </p>
                  <p>
                    Unlike generic social networks, ConnectSphere prioritizes shared real-world experiences, transparent expense splitting, and rule-based compatibility matching.
                  </p>
                </>
              )}

              {activeLegalModal === 'how-it-works' && (
                <>
                  <p>
                    1. <strong>Create Profile:</strong> Register with basic information. We verify the 18+ requirement to maintain a mature community.
                  </p>
                  <p>
                    2. <strong>Select Interests:</strong> Choose from 20 categories including trekking, cycling, cricket, board games, and cafes.
                  </p>
                  <p>
                    3. <strong>Discover & Match:</strong> Our Jaccard similarity algorithm evaluates interest overlap, city location, and activity preferences.
                  </p>
                  <p>
                    4. <strong>Request & Join:</strong> Submit join requests with custom notes. Hosts maintain control over their group composition.
                  </p>
                  <p>
                    5. <strong>Coordinate & Split:</strong> Automatic calculations ensure transparent per-person shares for vehicle rentals, permits, and food.
                  </p>
                </>
              )}

              {activeLegalModal === 'terms' && (
                <>
                  <p>
                    <strong>1. Eligibility:</strong> You must be at least 18 years of age to access or use ConnectSphere.
                  </p>
                  <p>
                    <strong>2. User Conduct:</strong> Users must treat hosts, companions, and venue staff with respect. Harassment, unauthorized commercial sales, or misrepresentation will result in account suspension.
                  </p>
                  <p>
                    <strong>3. Expense Coordination:</strong> Shared costs indicated on activity cards are estimates calculated among approved participants. ConnectSphere does not process direct payments in this local demonstration mode.
                  </p>
                </>
              )}

              {activeLegalModal === 'privacy' && (
                <>
                  <p>
                    <strong>1. Local Storage:</strong> In demo mode, all data resides inside your browser storage (IndexedDB/localStorage). No data is transmitted to third-party trackers.
                  </p>
                  <p>
                    <strong>2. Private Information:</strong> Date of birth, gender preference, phone numbers, and email addresses are treated as private fields and never exposed on public companion cards.
                  </p>
                </>
              )}

              {activeLegalModal === 'contact' && (
                <>
                  <p>
                    For project feedback, questions regarding the B.Tech academic demonstration, or technical inquiries:
                  </p>
                  <p className="font-mono bg-stone-100 p-2 rounded">
                    Email: project-demo@connectsphere.internal
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Department of Computer Science & Engineering, College Project 2026.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 text-right">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
