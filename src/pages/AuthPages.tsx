/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Mail,
  Lock,
  User as UserIcon,
  Calendar,
  Phone,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ALL_INTERESTS, SEED_USERS } from '../services/storage/localAdapter';
import { Gender, User } from '../types';
import { authService, userRepository } from '../services/repositories/localRepository';
import { signUpSchema } from '../validation/schemas';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup' | 'forgot';
  onAuthSuccess: (user: User) => void;
  onCancel: () => void;
}

export const AuthPages: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
  onCancel,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'onboarding'>(
    initialMode === 'forgot' ? 'forgot' : initialMode
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('aarav.sharma@demo.connectsphere.internal');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up State - specifically asking: Name, DOB, Gender, Email, Password
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    dateOfBirth: '2004-05-15',
    gender: 'prefer-not-to-say' as Gender,
    email: '',
    password: '',
    phone: '',
    acceptTerms: true,
  });

  // Onboarding State
  const [currentUserSession, setCurrentUserSession] = useState<User | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Trekking',
    'Photography',
    'Cafes',
  ]);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await authService.signIn(signInEmail);
      if (!user.onboardingCompleted) {
        setCurrentUserSession(user);
        setMode('onboarding');
      } else {
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = signUpSchema.safeParse(signUpData);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Please verify form fields');
      return;
    }

    setLoading(true);
    try {
      const newUser = await authService.signUp({
        ...signUpData,
        acceptTerms: true,
      });
      setCurrentUserSession(newUser);
      setMode('onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!currentUserSession) return;
    if (selectedInterests.length === 0) {
      setError('Please select at least 1 interest to discover matched companions');
      return;
    }

    setLoading(true);
    try {
      const updated = await userRepository.updateProfile(currentUserSession.id, {
        fullName: currentUserSession.fullName,
        city: city.trim() || 'Bengaluru',
        locality: locality.trim(),
        bio: bio.trim(),
        interests: selectedInterests,
      });
      onAuthSuccess(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 cursor-pointer group mb-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 to-violet-700 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <span className="text-2xl font-extrabold font-display text-indigo-950 tracking-tight">
            ConnectSphere
          </span>
        </button>
        <p className="text-xs text-stone-500">
          Find Your People. Share Your Experiences.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-stone-200 sm:rounded-3xl sm:px-10">
          {/* Segmented Mode Selector: Log In vs Sign Up */}
          {mode !== 'onboarding' && mode !== 'forgot' && (
            <div className="flex rounded-xl bg-stone-100 p-1 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signin');
                }}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('signup');
                }}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SIGN IN / LOGIN FORM */}
          {mode === 'signin' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">Welcome Back</h3>
                <p className="text-xs text-stone-500">
                  Log in to your ConnectSphere account or pick a demonstration profile.
                </p>
              </div>

              {/* Demo Account Quick Presets */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3.5 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-900 block">
                  1-Click Demo Profiles
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {SEED_USERS.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSignInEmail(u.email);
                        setSignInPassword('password123');
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-semibold bg-white border border-stone-200 hover:border-indigo-400 rounded-lg text-stone-800 truncate transition-colors text-left cursor-pointer"
                    >
                      {u.fullName.split(' ')[0]} ({u.interests[0]})
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav.sharma@demo.connectsphere.internal"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-stone-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-indigo-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-sm transition-all cursor-pointer text-xs"
                >
                  {loading ? 'Authenticating...' : 'Log In'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('signup');
                  }}
                  className="font-semibold text-indigo-700 hover:underline cursor-pointer"
                >
                  Sign Up here
                </button>
              </div>
            </div>
          )}

          {/* SIGN UP FORM (Asks: Name, DOB, Gender, Email, Password) */}
          {mode === 'signup' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">Create Your Account</h3>
                <p className="text-xs text-stone-500">
                  Please provide your personal information to register.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
                {/* 1. Name */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Natarajan"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, fullName: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* 2. Date of Birth (DOB) & 3. Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-stone-700">
                        Date of Birth (DOB) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-indigo-700 font-bold">18+ Only</span>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={signUpData.dateOfBirth}
                        onChange={(e) =>
                          setSignUpData({ ...signUpData, dateOfBirth: e.target.value })
                        }
                        className="w-full pl-9 pr-2 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                      />
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={signUpData.gender}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, gender: e.target.value as Gender })
                      }
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    >
                      <option value="prefer-not-to-say">Prefer not to say</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                    </select>
                  </div>
                </div>

                {/* 4. Email */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* 5. Password */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 8 characters (letters & numbers)"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, password: e.target.value })
                      }
                      className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={signUpData.phone}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, phone: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={signUpData.acceptTerms}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, acceptTerms: e.target.checked })
                    }
                    className="mt-0.5 rounded text-indigo-700 focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="text-[11px] text-stone-600 leading-tight">
                    I confirm I am at least 18 years old and agree to the community guidelines and terms of service.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-sm transition-all cursor-pointer text-xs mt-2"
                >
                  {loading ? 'Creating Account...' : 'Continue to Select Interests'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('signin');
                  }}
                  className="font-semibold text-indigo-700 hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          )}

          {/* ONBOARDING FLOW */}
          {mode === 'onboarding' && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Step {onboardingStep} of 2
                </span>
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  {onboardingStep === 1 ? 'Location & Bio' : 'Select Your Interests'}
                </h3>
                <p className="text-xs text-stone-500">
                  {onboardingStep === 1
                    ? 'Where are you based and what brings you to ConnectSphere?'
                    : 'Pick the activities you love to discover matching companions.'}
                </p>
              </div>

              {onboardingStep === 1 ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Locality / Area (Optional)
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Indiranagar, Koramangala, HSR"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Short Bio (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Weekend trail trekker, photography lover, and badminton player looking for friendly group outings."
                      maxLength={300}
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="w-full py-2.5 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Choose Favorite Interests</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Selected: {selectedInterests.length}</span>
                    <span>Click to toggle interests</span>
                  </div>

                  <div className="max-h-60 overflow-y-auto pr-1 flex flex-wrap gap-1.5">
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
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{interest}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(1)}
                      className="w-1/3 py-2 text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteOnboarding}
                      disabled={loading}
                      className="flex-1 py-2 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      {loading ? 'Finalizing Profile...' : 'Complete & Launch'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">Password Recovery</h3>
                <p className="text-xs text-stone-500">
                  In local demo mode, password recovery is simulated.
                </p>
              </div>

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2 text-emerald-950">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Simulated Reset Instructions</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    A simulated password reset token was generated for <strong>{forgotEmail}</strong>.
                    Since no email server is connected in local demo mode, you can log in directly using any demo account or your password.
                  </p>
                  <button
                    onClick={() => {
                      setResetSent(false);
                      setMode('signin');
                    }}
                    className="w-full mt-2 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                  >
                    Return to Log In
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!forgotEmail) return;
                    setResetSent(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav.sharma@demo.connectsphere.internal"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-all cursor-pointer"
                  >
                    Simulate Password Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="w-full py-1 text-center text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    Back to Log In
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
