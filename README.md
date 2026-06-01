# SmartRecipe 🍳 - AI-Powered Multilingual Recipe Generator

SmartRecipe is a modern, premium, and fully mobile-responsive web application designed to help users minimize food waste, save money, and cook delicious meals using ingredients they already have in their kitchen. 

The application utilizes state-of-the-art AI technology to scan the user's pantry inventory and instantly generate step-by-step authentic Malaysian recipes (Malay, Chinese, and Indian cuisine styles) in their preferred language.

---

## ✨ Features

- **🔑 Secure Authentication & Session Handling**: Protected via Supabase Auth (Email & Password logins) with dynamic Server-Side Rendering (SSR) cookie handlers and `/auth/callback` redirection route safeguards.
- **🌐 1-Click Multilingual UI**: Implements a highly performant client-side translation provider. Toggle the interface and recipe instructions dynamically between **English, Bahasa Melayu, and Simplified Chinese (简体中文)**.
- **📱 Mobile-First Pantry Manager**: A highly usable, tap-responsive interactive builder where users can dynamically add multiple ingredients, select quantities, choose standard units (grams, ml, pieces, tbsp), and sync their inventory with Supabase.
- **🔄 Auto-Setup Shield**: A built-in redirection logic on the dashboard that automatically checks if a user has configured their pantry, guiding new accounts straight to the setup flow.
- **🤖 Dual-Mode AI Generation**: Powered by the lightning-fast **Meta Llama 3.3 70B (via Groq)**:
  - *Use Existing Only*: Zero-cost cooking utilizing only the ingredients currently sitting in your pantry.
  - *Mix Mode*: Leverages what you already have, plus recommendations for a few essential items to purchase.
- **💾 Recipe Collector Manager**: Bookmark your favorite AI-generated recipes directly to your PostgreSQL database. View complete cooking outlines inside structured modals or delete them dynamically.
- **🛡️ Row Level Security (RLS)**: State-of-the-art database-level security policy checks ensuring users can *only* view, add, or delete their own inventory and saved recipes.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) *(Integrated directly in CSS `@theme` variables)*
- **Database & Auth**: [Supabase (PostgreSQL & Supabase SSR)](https://supabase.com/)
- **AI Core**: [Groq Developer API](https://console.groq.com/) *(Utilizing `llama-3.3-70b-versatile` with guaranteed JSON Structured Output mode)*
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js 20+](https://nodejs.org/) installed on your local computer.

### 2. Installation
Clone the repository and install the project dependencies:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/SmartRecipe.git
cd SmartRecipe
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory of your project and populate it with your Supabase and Groq keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
GROQ_API_KEY=gsk_your-groq-api-key
```

### 4. Database Schema Setup
Execute the following SQL commands in your **Supabase Dashboard SQL Editor** to create the required tables and security (RLS) policies:

```sql
-- 1. Pantry items table
CREATE TABLE pantry_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
  unit VARCHAR(50) NOT NULL CHECK (unit IN ('grams', 'ml', 'pieces', 'tbsp')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own pantry items" 
ON pantry_items FOR ALL USING (auth.uid() = user_id);

-- 2. Saved recipes table
CREATE TABLE saved_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_name VARCHAR(255) NOT NULL,
  ingredients_to_use TEXT[] NOT NULL,
  ingredients_to_buy TEXT[] NOT NULL,
  prep_steps TEXT[] NOT NULL,
  cooking_steps TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved recipes" 
ON saved_recipes FOR ALL USING (auth.uid() = user_id);
```

### 5. Running the Application
Spin up the Turbopack local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience the application.

---

## 📈 Continuous Integration & Deployment

### ⚙️ GitHub Actions CI
The project includes a robust Continuous Integration (CI) configuration at `.github/workflows/ci.yml`. On every Push or Pull Request to `main`, GitHub Actions will spin up a clean environment, install dependencies, run lints (`npm run lint`), and build tests (`npm run build`) to ensure the codebase remains 100% production-ready.

### ☁️ Vercel Deployment
Connecting your GitHub repository to Vercel will trigger automatic production deployments on every push to the `main` branch. Ensure you add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GROQ_API_KEY` to your Vercel Project Environment Variables.

---

*SmartRecipe 🍳 - Helping you cook smarter, reduce waste, and eat better, one ingredient at a time.*
