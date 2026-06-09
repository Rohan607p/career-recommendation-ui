import { Job } from '@/lib/data/jobDatabase';
import { UserProfile } from './skillMatching';

/**
 * Collaborative filtering - based on similar profiles
 * Simulates recommendations from users with similar backgrounds
 */
export function collaborativeFilteringScore(job: Job, userProfile: UserProfile): number {
  let score = 0;

  // Similar education + Interest in job category = high likelihood
  const educationSimilarityBonus = educationBasedScore(job, userProfile);
  score += educationSimilarityBonus * 0.3;

  // Similar interests = likely to be recommended
  const interestBasedBonus = interestBasedScore(job, userProfile);
  score += interestBasedBonus * 0.4;

  // Skill complementarity (jobs that help develop new skills)
  const skillComplementBonus = skillComplementarityScore(job, userProfile);
  score += skillComplementBonus * 0.3;

  return Math.min(score, 100);
}

/**
 * Education-based collaborative score
 * People with similar education often pursue same roles
 */
function educationBasedScore(job: Job, userProfile: UserProfile): number {
  const educationHierarchy: Record<string, number> = {
    'High School': 1,
    'Associate': 2,
    'Bachelor': 3,
    'Master': 4,
    'PhD': 5,
  };

  const userLevel = educationHierarchy[userProfile.educationLevel] || 0;
  const jobLevel = educationHierarchy[job.educationLevel] || 0;

  // Exact match or user is overqualified slightly
  if (userLevel >= jobLevel) {
    return 100;
  } else {
    return (userLevel / jobLevel) * 80;
  }
}

/**
 * Interest-based collaborative score
 * Users with similar interests tend to pursue same roles
 */
function interestBasedScore(job: Job, userProfile: UserProfile): number {
  if (userProfile.interests.length === 0) return 50;

  const userInterestsLower = userProfile.interests.map(i => i.toLowerCase());
  const jobCategoryLower = job.category.toLowerCase();

  // Direct category match
  if (userInterestsLower.includes(jobCategoryLower)) {
    return 100;
  }

  // Check if job skills align with interests
  let relevantSkillCount = 0;
  const relevantSkills = ['technology', 'data', 'design', 'business', 'analytics'];

  userInterestsLower.forEach(interest => {
    if (relevantSkills.some(skill => skill.includes(interest) || interest.includes(skill))) {
      relevantSkillCount++;
    }
  });

  if (relevantSkillCount > 0) {
    return 70;
  }

  return 30;
}

/**
 * Skill complementarity score
 * Jobs that help develop skills beyond current expertise
 */
function skillComplementarityScore(job: Job, userProfile: UserProfile): number {
  const userSkillsSet = new Set(userProfile.skills.map(s => s.toLowerCase()));
  const requiredSkillsSet = new Set(job.requiredSkills.map(s => s.toLowerCase()));

  // Count skills the user doesn't have but can learn
  let newSkillsToLearn = 0;
  requiredSkillsSet.forEach(skill => {
    if (!userSkillsSet.has(skill)) {
      newSkillsToLearn++;
    }
  });

  // Some new skills = good for growth (0.3-0.7 of required skills are new)
  const totalSkillsNeeded = requiredSkillsSet.size;
  const percentNewSkills = totalSkillsNeeded > 0 ? newSkillsToLearn / totalSkillsNeeded : 0;

  if (percentNewSkills >= 0.3 && percentNewSkills <= 0.7) {
    return 100; // Sweet spot for growth
  } else if (percentNewSkills > 0.7) {
    return 60; // Too many new skills, might be difficult
  } else if (percentNewSkills < 0.3) {
    return 80; // Mostly covered, some growth
  }

  return 50;
}

/**
 * Industry trend score
 * Boosts recommendations for growing industries/roles
 */
export function industryTrendScore(job: Job): number {
  const growingRoles = [
    'machine learning',
    'data scientist',
    'devops',
    'cloud',
    'product manager',
    'full stack',
  ];

  const jobTitleLower = job.title.toLowerCase();

  for (const role of growingRoles) {
    if (jobTitleLower.includes(role)) {
      return 90;
    }
  }

  return 70; // Default good score for other roles
}
