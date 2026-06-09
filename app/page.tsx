'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">CareerMatch</div>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground sm:text-6xl">
              Discover Your{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Use AI-powered algorithms to find job recommendations tailored to your skills,
              interests, and education. Get personalized career insights in seconds.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Matching Now
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
            How CareerMatch Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Algorithm 1 */}
            <Card className="p-6">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Skill Matching</h3>
              <p className="text-muted-foreground">
                Our algorithm analyzes your skills and compares them with job requirements
                using cosine similarity. Find roles that match your technical abilities.
              </p>
            </Card>

            {/* Algorithm 2 */}
            <Card className="p-6">
              <div className="mb-4 text-4xl">💡</div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Content-Based Filtering
              </h3>
              <p className="text-muted-foreground">
                Discover opportunities aligned with your interests and passions. Our semantic
                analysis finds careers that match what you care about.
              </p>
            </Card>

            {/* Algorithm 3 */}
            <Card className="p-6">
              <div className="mb-4 text-4xl">👥</div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Collaborative Filtering
              </h3>
              <p className="text-muted-foreground">
                Benefit from patterns of similar professionals. Get recommendations based on
                what people with your background have found successful.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
            Why Choose CareerMatch?
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Powered by Advanced Algorithms
                </h3>
                <p className="text-muted-foreground">
                  Three complementary recommendation systems work together for accurate matches.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Personalized Insights</h3>
                <p className="text-muted-foreground">
                  Get detailed gap analysis, growth opportunities, and learning paths for each
                  recommendation.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Completely Private</h3>
                <p className="text-muted-foreground">
                  All your data is stored locally in your browser. No external database or
                  cloud storage required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">Ready to Find Your Next Career?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Take the first step towards your ideal career. Get personalized recommendations
            powered by AI.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">
            © 2024 CareerMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
