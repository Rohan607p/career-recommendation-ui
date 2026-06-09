import { UserProfile } from '@/lib/algorithms/skillMatching';

const STORAGE_KEY = 'careerMatch_userProfile';

/**
 * Save user profile to localStorage
 */
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

/**
 * Load user profile from localStorage
 */
export function loadUserProfile(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored profile', e);
        return null;
      }
    }
  }
  return null;
}

/**
 * Clear user profile from localStorage
 */
export function clearUserProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Check if user profile exists in localStorage
 */
export function hasUserProfile(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
  return false;
}

/**
 * Get default user profile
 */
export function getDefaultUserProfile(): UserProfile {
  return {
    skills: [],
    interests: [],
    educationLevel: 'Bachelor',
    yearsExperience: 0,
  };
}
