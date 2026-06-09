import { Job } from '@/lib/data/jobDatabase';

export interface UserProfile {
  skills: string[];
  interests: string[];
  educationLevel: string;
  yearsExperience: number;
}

/**
 * Skill-based matching using cosine similarity
 * Measures how well user skills align with required skills
 */
export function skillMatchingScore(job: Job, userProfile: UserProfile): number {
  if (userProfile.skills.length === 0) return 0;

  // Normalize skills to lowercase for comparison
  const userSkillsLower = userProfile.skills.map(s => s.toLowerCase());
  const requiredSkillsLower = job.requiredSkills.map(s => s.toLowerCase());

  // Count matching skills
  let matchedSkills = 0;
  const userSkillSet = new Set(userSkillsLower);

  requiredSkillsLower.forEach(skill => {
    if (userSkillSet.has(skill)) {
      matchedSkills++;
    }
  });

  // Cosine similarity: matched / sqrt(user skills * required skills)
  const denominator = Math.sqrt(userSkillsLower.length * requiredSkillsLower.length);
  const cosineSimilarity = denominator > 0 ? matchedSkills / denominator : 0;

  // Scale to 0-100
  return cosineSimilarity * 100;
}

/**
 * Education level matching
 * Penalizes if user's education is below minimum required
 */
export function educationMatchScore(job: Job, userProfile: UserProfile): number {
  const educationHierarchy: Record<string, number> = {
    'High School': 1,
    'Associate': 2,
    'Bachelor': 3,
    'Master': 4,
    'PhD': 5,
  };

  const userLevel = educationHierarchy[userProfile.educationLevel] || 0;
  const requiredLevel = educationHierarchy[job.educationLevel] || 0;

  if (userLevel >= requiredLevel) {
    return 100;
  } else {
    // Partial credit for having some education
    return (userLevel / requiredLevel) * 100;
  }
}

/**
 * Experience level matching
 * Rewards having the right amount of experience
 */
export function experienceMatchScore(job: Job, userProfile: UserProfile): number {
  const yearsExperience = userProfile.yearsExperience;

  // Ideal range: 1-7 years for most jobs
  if (yearsExperience >= 1 && yearsExperience <= 7) {
    return 100;
  } else if (yearsExperience === 0) {
    // Entry level
    return 70;
  } else if (yearsExperience > 7) {
    // Overqualified slightly (still good, can mentor)
    return 90;
  }

  return 50;
}
