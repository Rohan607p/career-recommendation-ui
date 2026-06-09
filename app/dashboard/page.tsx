'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/ProfileForm';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <div className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80">
              CareerMatch
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Build Your Profile</h1>
          <p className="text-lg text-muted-foreground">
            Tell us about your skills, interests, and experience to get personalized job recommendations.
          </p>
        </div>

        <ProfileForm />
      </main>
    </div>
  );
}
