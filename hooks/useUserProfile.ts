'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/algorithms/skillMatching';
import {
  loadUserProfile,
  saveUserProfile,
  getDefaultUserProfile,
} from '@/lib/utils/storage';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    const stored = loadUserProfile();
    if (stored) {
      setProfile(stored);
    } else {
      setProfile(getDefaultUserProfile());
    }
    setIsLoading(false);
  }, []);

  // Update profile and save to localStorage
  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
  };

  // Add skill
  const addSkill = (skill: string) => {
    if (profile && !profile.skills.includes(skill)) {
      const updated = { ...profile, skills: [...profile.skills, skill] };
      updateProfile(updated);
    }
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    if (profile) {
      const updated = {
        ...profile,
        skills: profile.skills.filter(s => s !== skill),
      };
      updateProfile(updated);
    }
  };

  // Add interest
  const addInterest = (interest: string) => {
    if (profile && !profile.interests.includes(interest)) {
      const updated = { ...profile, interests: [...profile.interests, interest] };
      updateProfile(updated);
    }
  };

  // Remove interest
  const removeInterest = (interest: string) => {
    if (profile) {
      const updated = {
        ...profile,
        interests: profile.interests.filter(i => i !== interest),
      };
      updateProfile(updated);
    }
  };

  // Set education level
  const setEducationLevel = (level: string) => {
    if (profile) {
      const updated = {
        ...profile,
        educationLevel: level as 'High School' | 'Associate' | 'Bachelor' | 'Master' | 'PhD',
      };
      updateProfile(updated);
    }
  };

  // Set years of experience
  const setYearsExperience = (years: number) => {
    if (profile) {
      const updated = { ...profile, yearsExperience: years };
      updateProfile(updated);
    }
  };

  // Reset profile
  const resetProfile = () => {
    const defaultProfile = getDefaultUserProfile();
    updateProfile(defaultProfile);
  };

  return {
    profile,
    isLoading,
    updateProfile,
    addSkill,
    removeSkill,
    addInterest,
    removeInterest,
    setEducationLevel,
    setYearsExperience,
    resetProfile,
  };
}
