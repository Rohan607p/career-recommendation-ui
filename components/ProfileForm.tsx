'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/useUserProfile';

const EDUCATION_LEVELS = ['High School', 'Associate', 'Bachelor', 'Master', 'PhD'];
const SUGGESTED_SKILLS = [
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'SQL',
  'Java',
  'TypeScript',
  'AWS',
  'Docker',
  'Kubernetes',
  'Data Analysis',
  'Machine Learning',
  'Figma',
  'Communication',
  'Leadership',
];
const SUGGESTED_INTERESTS = [
  'Technology',
  'Data & Analytics',
  'Design',
  'Business',
  'Healthcare',
  'Finance',
  'Education',
  'Environmental',
];

export function ProfileForm() {
  const router = useRouter();
  const { profile, addSkill, removeSkill, addInterest, removeInterest, setEducationLevel, setYearsExperience } = useUserProfile();
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  if (!profile) {
    return <div>Loading...</div>;
  }

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      addSkill(skillInput.trim());
      setSkillInput('');
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim()) {
      addInterest(interestInput.trim());
      setInterestInput('');
    }
  };

  const handleGetRecommendations = () => {
    if (profile.skills.length === 0 && profile.interests.length === 0) {
      alert('Please add at least one skill or interest');
      return;
    }
    router.push('/results');
  };

  return (
    <div className="space-y-8">
      {/* Education Level */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Education Level</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {EDUCATION_LEVELS.map(level => (
            <Button
              key={level}
              variant={profile.educationLevel === level ? 'default' : 'outline'}
              onClick={() => setEducationLevel(level)}
              className="w-full"
            >
              {level}
            </Button>
          ))}
        </div>
      </Card>

      {/* Years of Experience */}
      <Card className="p-6">
        <div className="mb-4">
          <Label htmlFor="experience" className="text-base font-semibold text-foreground">
            Years of Experience: <span className="text-primary">{profile.yearsExperience}</span>
          </Label>
        </div>
        <input
          id="experience"
          type="range"
          min="0"
          max="30"
          value={profile.yearsExperience}
          onChange={e => setYearsExperience(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {profile.yearsExperience === 0
            ? 'Entry level'
            : profile.yearsExperience < 2
              ? 'Junior'
              : profile.yearsExperience < 5
                ? 'Mid-level'
                : profile.yearsExperience < 10
                  ? 'Senior'
                  : 'Expert'}
        </p>
      </Card>

      {/* Skills Section */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Your Skills</h3>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Add a skill (e.g., Python, Leadership)"
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleAddSkill();
              }
            }}
          />
          <Button onClick={handleAddSkill}>Add</Button>
        </div>

        {/* Suggested Skills */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-muted-foreground">Suggested skills:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.filter(skill => !profile.skills.includes(skill)).map(skill => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill)}
                className="text-xs"
              >
                + {skill}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Skills */}
        {profile.skills.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Selected skills:</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <div
                  key={skill}
                  className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 font-bold hover:opacity-80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Interests Section */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Your Interests</h3>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Add an interest (e.g., Data Science)"
            value={interestInput}
            onChange={e => setInterestInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleAddInterest();
              }
            }}
          />
          <Button onClick={handleAddInterest}>Add</Button>
        </div>

        {/* Suggested Interests */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-muted-foreground">Suggested interests:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_INTERESTS.filter(interest => !profile.interests.includes(interest)).map(
              interest => (
                <Button
                  key={interest}
                  variant="outline"
                  size="sm"
                  onClick={() => addInterest(interest)}
                  className="text-xs"
                >
                  + {interest}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Selected Interests */}
        {profile.interests.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Selected interests:</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(interest => (
                <div
                  key={interest}
                  className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-1 font-bold hover:opacity-80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button size="lg" onClick={handleGetRecommendations} className="flex-1">
          Get Recommendations
        </Button>
      </div>
    </div>
  );
}
