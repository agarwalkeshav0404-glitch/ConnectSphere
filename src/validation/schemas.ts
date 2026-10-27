/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import { ActivityCategory, CostMode } from '../types';

/**
 * Validates that a date of birth represents someone who is at least 18 years old today.
 */
export function isAtLeast18YearsOld(dateString: string): boolean {
  if (!dateString) return false;
  const dob = new Date(dateString);
  if (isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 18;
}

/**
 * Validates that a date string is today or in the future.
 */
export function isFutureOrToday(dateString: string): boolean {
  if (!dateString) return false;
  const target = new Date(`${dateString}T23:59:59`);
  if (isNaN(target.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target >= today;
}

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(60, 'Full name cannot exceed 60 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Za-z]/, 'Password must include at least one letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter date of birth as YYYY-MM-DD')
    .refine(isAtLeast18YearsOld, {
      message: 'You must be at least 18 years old to join ConnectSphere',
    }),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[+]?[\d\s-]{10,15}$/.test(val), {
      message: 'Please enter a valid phone number (10-15 digits)',
    }),
  acceptTerms: z.literal(true, {
    message: 'You must accept the terms of service and community guidelines',
  }),
});

export const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const activityFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    category: z.enum([
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
    ]),
    description: z
      .string()
      .trim()
      .min(15, 'Please provide a clear description (at least 15 characters)')
      .max(2000, 'Description cannot exceed 2000 characters'),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please provide a valid date (YYYY-MM-DD)')
      .refine(isFutureOrToday, {
        message: 'Activity date cannot be in the past',
      }),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please specify a valid start time (HH:mm)'),
    city: z
      .string()
      .trim()
      .min(2, 'City is required')
      .max(50, 'City name is too long'),
    location: z
      .string()
      .trim()
      .min(3, 'Meeting point or venue is required')
      .max(120, 'Location is too long'),
    participantLimit: z
      .number()
      .int('Participant capacity must be an integer')
      .min(1, 'Participant limit must be at least 1 person')
      .max(100, 'Participant limit cannot exceed 100 people'),
    costMode: z.enum(['free', 'per_person', 'total_shared']),
    costAmount: z
      .number()
      .min(0, 'Cost amount cannot be negative'),
    requiredInterests: z
      .array(z.string())
      .min(1, 'Please select at least 1 related interest tag'),
  })
  .superRefine((data, ctx) => {
    if (data.costMode === 'free' && data.costAmount !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['costAmount'],
        message: 'Amount must be 0 for Free activities',
      });
    }
    if ((data.costMode === 'per_person' || data.costMode === 'total_shared') && data.costAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['costAmount'],
        message: 'Please specify a valid cost amount greater than 0',
      });
    }
  });

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  city: z.string().trim().min(2, 'City is required').max(50),
  locality: z.string().trim().max(50).optional(),
  bio: z.string().trim().max(300, 'Bio cannot exceed 300 characters').optional(),
  interests: z.array(z.string()).min(1, 'Please select at least 1 interest'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ActivityFormData = z.infer<typeof activityFormSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
