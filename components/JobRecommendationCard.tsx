'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoredJob } from '@/lib/algorithms/combineScores';

interface JobRecommendationCardProps {
  job: ScoredJob;
  index: number;
}

export function JobRecommendationCard({ job, index }: JobRecommendationCardProps) {
  const [expanded, setExpanded] = useState(index === 0); // First card expanded by default

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div
        className="cursor-pointer bg-gradient-to-r from-primary/5 to-accent/5 p-6"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className="text-3xl font-bold text-primary">#{index + 1}</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.category}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Match Score</div>
            <div className="text-4xl font-bold text-primary">{job.matchPercentage}%</div>
          </div>
        </div>

        {/* Match Score Bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${job.matchPercentage}%` }}
          />
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="border-t border-border p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="mb-2 font-semibold text-foreground">About This Role</h4>
            <p className="text-muted-foreground">{job.description}</p>
          </div>

          {/* Score Breakdown */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Score Breakdown</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Skill Matching</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${job.skillScore}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-medium text-foreground">
                    {job.skillScore}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Interest Alignment</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${job.contentScore}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-medium text-foreground">
                    {job.contentScore}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Collaborative Score</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${job.collaborativeScore}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-medium text-foreground">
                    {job.collaborativeScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(skill => (
                <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Gap */}
          {job.skillsGap.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-foreground">
                Skills to Develop ({job.skillsGap.length})
              </h4>
              <div className="rounded-lg bg-accent/10 p-4">
                <ul className="space-y-2">
                  {job.skillsGap.map(skill => (
                    <li key={skill} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Salary Info */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Compensation</h4>
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-lg font-bold text-foreground">
                ${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-muted-foreground">
                Average: ${(((job.salaryRange.min + job.salaryRange.max) / 2) / 1000).toFixed(0)}k
              </p>
            </div>
          </div>

          {/* Growth Potential */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Growth Potential</h4>
            <div className="flex items-center gap-3">
              <div className="h-2 w-48 rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(job.growthPotential / 10) * 100}%` }}
                />
              </div>
              <span className="font-bold text-foreground">{job.growthPotential}/10</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {job.growthPotential >= 9
                ? 'Excellent growth prospects'
                : job.growthPotential >= 7
                  ? 'Good growth opportunities'
                  : 'Moderate growth potential'}
            </p>
          </div>

          {/* Reasoning */}
          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-sm text-foreground italic">{job.reasoning}</p>
          </div>

          {/* Education Level */}
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Minimum Education</h4>
            <p className="text-muted-foreground">{job.educationLevel}</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="border-t border-border bg-card px-6 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-primary hover:underline"
        >
          {expanded ? 'Show Less' : 'Show More Details'}
        </button>
      </div>
    </Card>
  );
}
