# CareerMatch - Smart Job Recommendation System

A modern, intelligent career recommendation platform powered by three advanced machine learning algorithms. This application helps job seekers discover their ideal career paths by analyzing skills, interests, education, and experience.

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Three Recommendation Algorithms](#three-recommendation-algorithms)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [How to Use](#how-to-use)
- [Algorithm Details](#algorithm-details)

## Overview

CareerMatch uses three complementary machine learning algorithms to provide highly personalized job recommendations:
1. **Skill-Based Matching** - Compares user skills directly with job requirements
2. **Content-Based Filtering** - Matches interests and categories with job descriptions
3. **Collaborative Filtering** - Recommends jobs based on similar user profiles

Each algorithm produces a score (0-100), and the final recommendation is a weighted combination of all three, ensuring diverse and accurate results.

## System Architecture

### Technology Stack
- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Data Storage**: Browser localStorage (no external database)
- **State Management**: React Context API + Custom Hooks
- **Validation**: React Hook Form + Zod schema validation

### No External Database
This application stores all data locally:
- **Job Database**: In-memory TypeScript objects loaded directly in the browser
- **User Profiles**: Persisted in browser localStorage
- **Zero Server Dependencies**: All computation happens client-side
- **Complete Privacy**: User data never leaves the browser

## Three Recommendation Algorithms

### 1. Skill-Based Matching Algorithm
**File**: `/lib/algorithms/skillMatching.ts`

**Purpose**: Directly compares user technical/professional skills with job requirements.

**How It Works**:
- Calculates cosine similarity between user skills vector and each job's required skills vector
- Computes overlap percentage: how many of job's required skills the user already has
- Generates a skills gap: missing skills needed for the role
- Score calculation:
  - Base score from cosine similarity (0-100)
  - Bonus points for matching skill levels
  - Penalty for missing critical skills

**Formula**:
```
Skill Match Score = (Overlap % × 70) + (Skill Level Match × 30)
```

**Example**:
- User has: [JavaScript, React, Node.js, MongoDB]
- Job requires: [JavaScript, React, TypeScript, Node.js]
- Overlap: 3/4 = 75%
- Missing: TypeScript (critical skill)
- Final Score: ~65-75 out of 100

### 2. Content-Based Filtering Algorithm
**File**: `/lib/algorithms/contentBased.ts`

**Purpose**: Matches user interests and preferences with job descriptions and categories.

**How It Works**:
- Analyzes user interests and education level
- Uses semantic similarity to match job categories and descriptions
- Considers salary range preferences and career growth potential
- Scores based on:
  - Interest alignment with job category
  - Education level appropriateness (not overqualified/underqualified)
  - Job growth potential match with user goals
  - Salary range satisfaction

**Formula**:
```
Content Score = (Interest Match × 40) + (Education Fit × 30) + (Growth Potential × 30)
```

**Example**:
- User interested in: AI/ML, Data Science, Technology
- Job: Data Scientist (AI/ML category)
- Education: User has relevant degree
- Growth: High growth industry
- Final Score: ~85-90 out of 100

### 3. Collaborative Filtering Algorithm
**File**: `/lib/algorithms/collaborativeFiltering.ts`

**Purpose**: Recommends jobs based on similar user profiles and industry trends.

**How It Works**:
- Creates a user profile embedding based on skills, interests, experience
- Finds similar user profiles (hypothetically from patterns)
- Identifies popular jobs among similar users
- Scores based on:
  - Profile similarity to successful candidates
  - Job popularity among similar experience levels
  - Industry demand for the role
  - Career transition compatibility

**Formula**:
```
Collaborative Score = (Similar Profile Match × 35) + (Industry Demand × 35) + (Transition Ease × 30)
```

**Example**:
- User profile: Full-stack developer, 3 years experience, interested in tech
- Similar profiles: Other full-stack devs who transitioned to Product Management, DevOps, Tech Lead
- Jobs popular with similar users: High demand for these transition roles
- Final Score: ~70-80 out of 100

## Data Flow

### 1. User Lands on Application

```
User → Landing Page
         ↓
    Explains 3 Algorithms
         ↓
    "Get Started" Button
```

### 2. Dashboard - Profile Collection

```
User fills form with:
├── Skills (Array) - e.g., [JavaScript, React, Node.js]
├── Interests (Array) - e.g., [AI/ML, Web Development]
├── Education Level - Bachelor's, Master's, etc.
├── Years of Experience - 0-20+ years
├── Salary Expectations - $50k-$150k+
└── Career Goals - Job title preferences

User Profile stored in:
├── React Context (current session)
└── localStorage (persistent across sessions)
```

### 3. Recommendation Engine - Algorithm Execution

```
User Profile + Job Database
         ↓
┌────────┴────────┬────────────────┬────────────────┐
│                 │                │                │
v                 v                v                v
Skill Matching  Content-Based   Collaborative
Algorithm       Filtering       Filtering
│                 │                │
├─ Cosine         ├─ Interest      ├─ Profile
│  Similarity       Matching        Similarity
├─ Skill Overlap   ├─ Education    ├─ Industry
│  Analysis        Fit              Demand
└─ Score: 0-100   └─ Score: 0-100 └─ Score: 0-100

         ↓
    Weighted Combination
    (40% + 35% + 25%)
         ↓
    Final Score: 0-100
```

### 4. Score Combination Engine
**File**: `/lib/algorithms/combineScores.ts`

```
Final Score = (Skill Score × 0.40) + 
              (Content Score × 0.35) + 
              (Collab Score × 0.25)

Weights:
- Skill-Based: 40% (most important - hard requirements)
- Content-Based: 35% (interest/education alignment)
- Collaborative: 25% (market trends & similar profiles)

Result: Top 3 Jobs with highest final scores
```

### 5. Results Page - Recommendations Display

```
Top 3 Job Recommendations
│
├── Recommendation #1 (Highest Match %)
│   ├── Job Title, Description, Salary
│   ├── Algorithm Breakdown
│   │   ├── Skill Match: 85% (missing: TypeScript)
│   │   ├── Content Match: 78% (good interest fit)
│   │   └── Collab Match: 72% (industry demand)
│   ├── Skills Gap Analysis
│   │   ├── Missing Skills: [TypeScript, AWS]
│   │   └── Learning Resources: Recommended courses
│   └── Career Growth Potential
│
├── Recommendation #2 (Second Match)
│   └── [Same structure...]
│
└── Recommendation #3 (Third Match)
    └── [Same structure...]

User Actions:
├── View detailed breakdown
├── See learning paths for missing skills
├── Save profile for future reference
└── Start over with new profile
```

## Project Structure

```
CareerMatch/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── globals.css             # Light theme color system
│   ├── page.tsx                # Landing page (hero + explanations)
│   ├── dashboard/
│   │   └── page.tsx            # Profile input form
│   └── results/
│       └── page.tsx            # Recommendations display
│
├── components/
│   ├── ProfileForm.tsx         # User input form with validation
│   └── JobRecommendationCard.tsx # Recommendation card component
│
├── lib/
│   ├── data/
│   │   └── jobDatabase.ts      # In-memory job data (15 curated jobs)
│   ├── algorithms/
│   │   ├── skillMatching.ts    # Algorithm #1: Skill-based
│   │   ├── contentBased.ts     # Algorithm #2: Content-based
│   │   ├── collaborativeFiltering.ts # Algorithm #3: Collaborative
│   │   └── combineScores.ts    # Weighted score combination
│   └── utils/
│       └── storage.ts          # localStorage utilities
│
├── hooks/
│   └── useUserProfile.ts       # Custom hook for profile management
│
└── README.md                   # This file
```

## How to Use

### 1. Clone and Install
```bash
git clone <repository>
cd CareerMatch
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

### 3. User Journey

**Step 1: Landing Page**
- Read about the three algorithms
- Click "Get Started" button

**Step 2: Dashboard - Build Your Profile**
- Enter your technical skills (comma-separated or click to add)
- Select your interests from dropdown (AI/ML, Web Dev, Data Science, etc.)
- Choose education level
- Enter years of experience
- Set salary expectations
- Click "Get Recommendations"

**Step 3: Results Page**
- View top 3 job recommendations
- Expand each card to see:
  - Detailed algorithm breakdown (all three scores)
  - Skills gap analysis with missing skills
  - Learning paths for skill development
  - Salary information and growth potential

**Step 4: Save & Track**
- Your profile is automatically saved to localStorage
- Return anytime to see your history
- Modify and re-run recommendations

## Algorithm Details

### Input Data Types

```typescript
// User Profile
{
  skills: string[];              // User's technical/professional skills
  interests: string[];           // Career interests & specializations
  educationLevel: string;        // Education qualification
  yearsOfExperience: number;     // Work experience in years
  salaryExpectations: number;    // Desired salary range
  careerGoals: string;           // Long-term goals
}

// Job
{
  id: string;
  title: string;
  description: string;
  category: string;              // AI/ML, Web Dev, Data Science, etc.
  requiredSkills: string[];      // Must-have skills
  educationLevel: string;        // Minimum education
  salaryRange: { min, max };     // Salary information
  growthPotential: 'high' | 'medium' | 'low';
  keyCompetencies: string[];     // Soft skills needed
}
```

### Similarity Metrics

**Cosine Similarity (Skill Matching)**:
- Converts arrays into vectors
- Measures angle between vectors (0° = perfect match, 90° = no match)
- Formula: `A·B / (||A|| × ||B||)`
- Result: 0 to 1 (scaled to 0-100)

**String Similarity (Content-Based)**:
- Uses Levenshtein distance algorithm
- Measures character-level similarity between interests and job categories
- Accounts for exact matches and partial matches

**Profile Similarity (Collaborative)**:
- Creates weighted profile vectors
- Compares: skills distribution, interests overlap, experience level
- Factors in industry trends and demand signals

### Handling Edge Cases

1. **No Skills Match**: If user has no matching skills, algorithm still considers education and interests
2. **Career Transition**: Collaborative filtering recognizes and scores career changes positively
3. **Early Career**: Special weighting for entry-level positions
4. **Over-qualification**: Penalizes jobs below user's education/experience level
5. **Salary Mismatch**: Flags when job salary doesn't match expectations

## Performance Considerations

- **Client-Side Computation**: All algorithms run in browser (~50-100ms for 15 jobs)
- **Storage**: localStorage usage ~50KB for typical user profile + history
- **No API Calls**: Zero latency, no network dependencies
- **Scalability**: Current design handles 100-200 jobs efficiently

## Future Enhancements

- [ ] Add resume upload and parsing (extract skills automatically)
- [ ] Expand job database to 500+ curated positions
- [ ] Add skill development roadmaps with learning resources
- [ ] Implement user feedback loop (rate recommendations)
- [ ] Add industry trend data for better collaborative filtering
- [ ] Export recommendations as PDF report
- [ ] Share profile with mentors/career coaches

## Data Sources

Job data is curated from public sources:
- Bureau of Labor Statistics (bls.gov) - Job descriptions, salary data
- LinkedIn - Skills requirements, industry trends
- Glassdoor - Salary ranges, company insights
- GitHub - Tech job descriptions from trending repos

## License

MIT License - Feel free to use and modify for personal or commercial projects.

## Support

For issues, questions, or recommendations about the algorithms:
1. Check the algorithm files in `/lib/algorithms/`
2. Review the inline code comments
3. Refer to the Data Flow section above
4. Examine the example outputs in recommendation cards
