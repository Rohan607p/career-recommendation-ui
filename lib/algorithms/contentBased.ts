import { Job } from '@/lib/data/jobDatabase';
import { UserProfile } from './skillMatching';

/**
 * Content-based filtering using semantic similarity
 * Measures how well job category/description aligns with user interests
 */
export function contentBasedScore(job: Job, userProfile: UserProfile): number {
  if (userProfile.interests.length === 0) return 50; // Neutral score

  const jobKeywords = extractKeywords(job);
  const userInterestsLower = userProfile.interests.map(i => i.toLowerCase());

  // Count matching interests
  let interestMatches = 0;
  const jobKeywordSet = new Set(jobKeywords.map(k => k.toLowerCase()));

  userInterestsLower.forEach(interest => {
    if (jobKeywordSet.has(interest)) {
      interestMatches++;
    }
  });

  // Calculate Jaccard similarity
  const unionSize = new Set([...Array.from(jobKeywordSet), ...userInterestsLower]).size;
  const jaccardSimilarity = unionSize > 0 ? interestMatches / unionSize : 0;

  // Scale to 0-100
  return jaccardSimilarity * 100;
}

/**
 * Category match score
 * Checks if the job category matches user interests
 */
export function categoryMatchScore(job: Job, userProfile: UserProfile): number {
  const userInterestsLower = userProfile.interests.map(i => i.toLowerCase());
  const jobCategoryLower = job.category.toLowerCase();

  // Exact match
  if (userInterestsLower.includes(jobCategoryLower)) {
    return 100;
  }

  // Partial match - check if any interest contains the category
  for (const interest of userInterestsLower) {
    if (jobCategoryLower.includes(interest) || interest.includes(jobCategoryLower)) {
      return 75;
    }
  }

  return 0;
}

/**
 * Growth potential score
 * Rewards jobs with high growth potential
 */
export function growthPotentialScore(job: Job): number {
  // Scale 0-10 to 0-100
  return (job.growthPotential / 10) * 100;
}

/**
 * Extract relevant keywords from job data
 */
function extractKeywords(job: Job): string[] {
  const keywords = new Set<string>();

  // Add category
  keywords.add(job.category);

  // Add skills
  job.requiredSkills.forEach(skill => keywords.add(skill));

  // Extract keywords from description
  const descriptionKeywords = job.description
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5);

  descriptionKeywords.forEach(keyword => keywords.add(keyword));

  return Array.from(keywords);
}

/**
 * Salary expectation match
 * Checks if job salary aligns with expectations
 */
export function salaryMatchScore(job: Job, userProfile: UserProfile): number {
  // For now, reward higher salary ranges (more lucrative positions)
  const avgSalary = (job.salaryRange.min + job.salaryRange.max) / 2;
  // Normalize to 0-100 based on industry standards (50k-250k range)
  const normalizedSalary = Math.min((avgSalary / 250000) * 100, 100);
  return normalizedSalary;
}
