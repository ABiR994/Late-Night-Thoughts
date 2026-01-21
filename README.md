# Late Night Thoughts 🌙

A beautiful, anonymous, and minimalistic journal for the thoughts that find you after midnight. Built with a focus on typography, privacy, and immersive user experience.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## ✨ Features

-   **Anonymous Identity**: Automatic anonymous authentication via Supabase. No accounts, no passwords, just your thoughts.
-   **Immersive Design**: A premium "Midnight Aurora" dark theme with ambient background effects and glassmorphism.
-   **Privacy Focused**: Choose to share thoughts publicly or keep them strictly private using database-level Row Level Security (RLS).
-   **Personal Feed**: A dedicated "Mine" tab to view all your previous reflections across sessions.
-   **Mood Tagging**: Express your emotional state with curated mood tags and filter the collective feed by emotion.
-   **Performance First**: Built with Next.js ISR (Incremental Static Regeneration) for instant loading and SEO.
-   **Safe Space**: Built-in server-side rate limiting and content moderation filters.
-   **PWA Ready**: Installable on mobile devices for a native journaling experience.

## 🚀 Tech Stack

-   **Frontend**: Next.js (React), TypeScript, Tailwind CSS
-   **Backend**: Next.js API Routes (Serverless)
-   **Database & Auth**: Supabase (PostgreSQL)
-   **Styling**: Modern CSS with CSS Variables and custom animations
-   **Offline Support**: `next-pwa` for service worker integration

## 🛠️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/late-night-thoughts.git
    cd late-night-thoughts
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory based on `.env.example`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**:
    Ensure **Anonymous Sign-ins** are enabled in Supabase Auth settings. Run the following SQL in your Supabase SQL Editor:
    ```sql
    CREATE TABLE public.thoughts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        content TEXT NOT NULL CHECK (char_length(content) <= 1000),
        mood TEXT,
        is_public BOOLEAN DEFAULT false NOT NULL,
        user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL
    );
    ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
    -- (Add RLS Policies as documented in project history)
    ```

5.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🔒 Security

This project implements several "Real World" security practices:
-   **Row Level Security (RLS)**: Users can only retrieve their own private thoughts from the database.
-   **JWT Verification**: API routes verify Supabase tokens before processing sensitive requests.
-   **Rate Limiting**: Prevent bot spam with IP-based request throttling.
-   **Content Sanitization**: Basic filtering for malicious or prohibited content.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Made for the quiet moments.* 🌌
