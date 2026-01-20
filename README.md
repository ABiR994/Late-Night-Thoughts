# Late Night Thoughts

An anonymous thought journal web application.

## Core Features
- Anonymous posting (no usernames, no accounts)
- Private or public thoughts
- Mood-based filtering (happy, sad, contemplative, etc.)
- Minimal UI with an almost poetic vibe
- Optional client-side encryption for private thoughts
- Rate limiting to prevent spam and abuse
- Premium dark mode and light mode experiences

## Tech Stack
- Frontend: Next.js (React)
- Backend: Serverless API routes (Next.js API routes)
- Database: Serverless-friendly database (Supabase, Firebase, or MongoDB Atlas)
- Styling: Tailwind CSS or clean custom CSS with soft gradients

## Getting Started

1.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

2.  **Run the development server:**
    \`\`\`bash
    npm run dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
Late Night Thoughts/
components/
- ThoughtCard.tsx        (display a single thought)
- PostForm.tsx           (submit a new thought)
- MoodFilter.tsx         (filter thoughts by mood)
- Layout.tsx             (shared layout wrapper)

pages/
- index.tsx              (main feed, filters, posting)
- api/
  - thoughts.ts          (GET/POST thoughts)
  - rateLimit.ts         (rate limiting logic)
  - encryption.ts        (optional encryption utilities)

styles/
- globals.css             (base styles)
- themes.css              (dark/light mode styling)

utils/
- db.ts                   (database helpers)

.gitignore
package.json
tsconfig.json
tailwind.config.js
README.md
.env (ignored by git)
\`\`\`
