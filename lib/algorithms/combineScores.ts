import { Job } from '@/lib/data/jobDatabase';
import { UserProfile, skillMatchingScore, educationMatchScore, experienceMatchScore } from './skillMatching';
import { contentBasedScore, categoryMatchScore, growthPotentialScore } from './contentBased';
import { collaborativeFilteringScore } from './collaborativeFiltering';

export interface ScoredJob extends Job {
  totalScore: number;
  skillScore: number;
  contentScore: number;
  collaborativeScore: number;
  matchPercentage: number;
  skillsGap: string[];
  reasoning: string;
}

/**
 * Combines all three algorithms with weighted scoring
 * Weights: Skill-based (40%), Content-based (30%), Collaborative (30%)
 */
export function combineScoresAndRank(
  jobs: Job[],
  userProfile: UserProfile
): ScoredJob[] {
  const scoredJobs = jobs.map(job => {
    // Algorithm 1: Skill-based matching (40%)
    const skillScore =
      skillMatchingScore(job, userProfile) * 0.5 +
      educationMatchScore(job, userProfile) * 0.3 +
      experienceMatchScore(job, userProfile) * 0.2;

    // Algorithm 2: Content-based filtering (30%)
    const contentScore =
      contentBasedScore(job, userProfile) * 0.5 +
      categoryMatchScore(job, userProfile) * 0.3 +
      growthPotentialScore(job) * 0.2;

    // Algorithm 3: Collaborative filtering (30%)
    const collaborativeScore = collaborativeFilteringScore(job, userProfile);

    // Weighted combination
    const totalScore =
      skillScore * 0.4 + contentScore * 0.3 + collaborativeScore * 0.3;

    // Calculate skills gap
    const userSkillsSet = new Set(userProfile.skills.map(s => s.toLowerCase()));
    const skillsGap = job.requiredSkills.filter(
      skill => !userSkillsSet.has(skill.toLowerCase())
    );

    // Generate reasoning
    const reasoning = generateReasoning(job, userProfile, skillScore, contentScore);

    return {
      ...job,
      totalScore: Math.round(totalScore),
      skillScore: Math.round(skillScore),
      contentScore: Math.round(contentScore),
      collaborativeScore: Math.round(collaborativeScore),
      matchPercentage: Math.round(totalScore),
      skillsGap,
      reasoning,
    };
  });

  // Sort by total score descending
  return scoredJobs.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Generates human-readable reasoning for recommendations
 */
function generateReasoning(
  job: Job,
  userProfile: UserProfile,
  skillScore: number,
  contentScore: number
): string {
  const reasons: string[] = [];

  // Check skill alignment
  if (skillScore >= 80) {
    reasons.push('Strong skill alignment');
  } else if (skillScore >= 60) {
    reasons.push('Good skill foundation');
  } else {
    reasons.push('Some skill gaps to bridge');
  }

  // Check interest alignment
  if (contentScore >= 80) {
    reasons.push('Perfect interest match');
  } else if (contentScore >= 60) {
    reasons.push('Aligned with your interests');
  }

  // Check experience level
  const yearsExp = userProfile.yearsExperience;
  if (yearsExp === 0) {
    reasons.push('Good entry-level opportunity');
  } else if (yearsExp > 5) {
    reasons.push('Senior-level role fit');
  }

  // Check education
  const userEducation = userProfile.educationLevel;
  if (userEducation === job.educationLevel) {
    reasons.push('Education requirements met');
  }

  return reasons.join('. ');
}

/**
 * Calculate detailed insights for a job match
 */
export function getJobInsights(scoredJob: ScoredJob, userProfile: UserProfile) {
  return {
    matchPercentage: scoredJob.matchPercentage,
    strengths: getStrengths(scoredJob, userProfile),
    gaps: getGaps(scoredJob, userProfile),
    growth: getGrowthOpportunities(scoredJob, userProfile),
  };
}

function getStrengths(scoredJob: ScoredJob, userProfile: UserProfile): string[] {
  const strengths: string[] = [];

  if (scoredJob.skillScore >= 70) {
    strengths.push('Strong technical skill match');
  }

  const userInterestsLower = userProfile.interests.map(i => i.toLowerCase());
  if (userInterestsLower.includes(scoredJob.category.toLowerCase())) {
    strengths.push(`Matches your interest in ${scoredJob.category}`);
  }

  if (scoredJob.growthPotential >= 8) {
    strengths.push('High growth potential in this field');
  }

  if (scoredJob.salaryRange.max >= 150000) {
    strengths.push('Competitive compensation package');
  }

  return strengths.length > 0 ? strengths : ['Solid overall match'];
}

function getGaps(scoredJob: ScoredJob, userProfile: UserProfile): string[] {
  const gaps: string[] = [];

  if (scoredJob.skillsGap.length > 0) {
    const topGaps = scoredJob.skillsGap.slice(0, 2);
    gaps.push(`Learn ${topGaps.join(' and ')}`);
  }

  const userLevel =
    {
      'High School': 1,
      'Associate': 2,
      'Bachelor': 3,
      'Master': 4,
      'PhD': 5,
    }[userProfile.educationLevel] || 0;

  const jobLevel =
    {
      'High School': 1,
      'Associate': 2,
      'Bachelor': 3,
      'Master': 4,
      'PhD': 5,
    }[scoredJob.educationLevel] || 0;

  if (userLevel < jobLevel) {
    gaps.push(`Consider ${scoredJob.educationLevel} degree`);
  }

  return gaps;
}

function getGrowthOpportunities(scoredJob: ScoredJob, userProfile: UserProfile): string[] {
  const opportunities: string[] = [];

  if (scoredJob.growthPotential >= 9) {
    opportunities.push('Rapidly growing field with high demand');
  }

  if (scoredJob.skillsGap.length > 0) {
    opportunities.push(`Opportunity to develop ${scoredJob.skillsGap.length} new skills`);
  }

  if (scoredJob.salaryRange.max - scoredJob.salaryRange.min >= 80000) {
    opportunities.push('Clear path for salary progression');
  }

  return opportunities;
}
