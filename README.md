# Late Night Thoughts 🌙

<p align="center">
  <img src="public/icons/icon.png" width="160" height="160" alt="Late Night Thoughts Logo">
</p>

<p align="center">
  <strong>A beautiful, anonymous, and minimalistic journal for the thoughts that find you after midnight.</strong>
</p>

<p align="center">
  <a href="https://late-night-thoughts-five.vercel.app/"><strong>Explore the Live Application →</strong></a>
</p>

<p align="center">
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
</p>

---

## ✨ Features

- **Anonymous Identity**: Automatic anonymous authentication via Supabase. No accounts, no passwords—just your thoughts.
- **Immersive Design**: A premium "Midnight Aurora" dark theme with ambient background effects, floating orbs, and glassmorphism.
- **Privacy First**: Choose to share thoughts publicly or keep them strictly private using database-level **Row Level Security (RLS)**.
- **Personal Sanctuary**: A dedicated "Mine" tab to view all your previous reflections across sessions, powered by persistent anonymous IDs.
- **Mood Tagging**: Express your emotional state with curated mood tags and filter the collective feed by emotion.
- **Poetic Reading Mode**: An immersive, full-screen reading experience designed for deep focus and reflection.
- **Performance Optimized**: Built with Next.js **ISR (Incremental Static Regeneration)** for instant loading and SEO-friendly public thoughts.
- **Production Ready**: Integrated server-side rate limiting and content moderation filters to ensure a safe community.
- **PWA Ready**: Installable on mobile devices for a native journaling experience, complete with custom iconography.

## 🚀 Tech Stack

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database & Auth**: Supabase (PostgreSQL) with RLS
- **State Management**: React Hooks & Supabase Auth Listeners
- **Offline Support**: `next-pwa` for service worker integration
- **Deployment**: Vercel

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/late-night-thoughts.git
   cd late-night-thoughts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**:
   Ensure **Anonymous Sign-ins** are enabled in your Supabase Auth settings. Run the provided SQL schema in your Supabase SQL Editor to set up the `thoughts` table and its associated security policies.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🔒 Security

This project implements industry-standard security practices:
- **Row Level Security (RLS)**: Direct database policies ensure users can only access their own private data.
- **JWT Verification**: API routes verify identity tokens server-side before processing any requests.
- **Rate Limiting**: Custom in-memory request throttling to prevent automated spam and abuse.
- **Anonymity by Design**: User identification is handled without storing personally identifiable information (PII).

## 🤖 Built With

This application was architected and developed using **[OpenCode](https://opencode.com)** and **Antigravity**, leveraging advanced agentic coding workflows to ensure clean architecture, minimalistic UI design, and robust functionality.

---

*Made for the quiet moments when the world falls silent.* 🌌
