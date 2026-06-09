'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { JobRecommendationCard } from '@/components/JobRecommendationCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { jobDatabase } from '@/lib/data/jobDatabase';
import { combineScoresAndRank, ScoredJob } from '@/lib/algorithms/combineScores';

export default function ResultsPage() {
  const router = useRouter();
  const { profile, isLoading } = useUserProfile();
  const [recommendations, setRecommendations] = useState<ScoredJob[]>([]);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    if (!isLoading && profile) {
      // Validate that user has input
      if (profile.skills.length === 0 && profile.interests.length === 0) {
        router.push('/dashboard');
        return;
      }

      // Calculate recommendations
      const scored = combineScoresAndRank(jobDatabase, profile);
      setRecommendations(scored);
      setIsCalculating(false);
    }
  }, [isLoading, profile, router]);

  if (isLoading || isCalculating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <div className="animate-spin mb-4">
            <div className="h-12 w-12 rounded-full border-4 border-border border-t-primary mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Analyzing Your Profile...</h2>
          <p className="mt-2 text-muted-foreground">Calculating personalized recommendations</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80">
                CareerMatch
              </div>
            </Link>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Refine Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Career Matches</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Your Skills</p>
              <p className="text-2xl font-bold text-primary">{profile?.skills.length || 0}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Your Interests</p>
              <p className="text-2xl font-bold text-accent">{profile?.interests.length || 0}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Jobs Analyzed</p>
              <p className="text-2xl font-bold text-foreground">{recommendations.length}</p>
            </Card>
          </div>
        </div>

        {/* Top 3 Recommendations */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Top 3 Recommendations</h2>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((job, index) => (
              <JobRecommendationCard key={job.id} job={job} index={index} />
            ))}
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <Card className="p-8 mb-12">
            <h3 className="mb-6 text-2xl font-bold text-foreground">Your Profile Summary</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-foreground">Education Level</h4>
                <p className="text-muted-foreground">{profile.educationLevel}</p>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-foreground">Years of Experience</h4>
                <p className="text-muted-foreground">
                  {profile.yearsExperience === 0
                    ? 'Entry level'
                    : profile.yearsExperience < 2
                      ? 'Junior'
                      : profile.yearsExperience < 5
                        ? 'Mid-level'
                        : profile.yearsExperience < 10
                          ? 'Senior'
                          : 'Expert'}{' '}
                  ({profile.yearsExperience} years)
                </p>
              </div>

              {profile.skills.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-foreground">Your Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span
                        key={skill}
                        className="rounded-full bg-primary text-primary-foreground px-3 py-1 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.interests.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-foreground">Your Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map(interest => (
                      <span
                        key={interest}
                        className="rounded-full bg-accent text-accent-foreground px-3 py-1 text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* All Jobs Table */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-foreground">All Job Matches</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Job Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Match %</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map(job => (
                  <tr key={job.id} className="border-b border-border hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">{job.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{job.category}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
                        {job.matchPercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button size="lg" onClick={() => router.push('/dashboard')}>
            Update Your Profile
          </Button>
        </div>
      </main>
    </div>
  );
}
