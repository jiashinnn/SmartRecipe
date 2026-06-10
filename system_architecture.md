# SmartRecipe - System Architecture Documentation

This document provides a comprehensive architectural breakdown of the **SmartRecipe** web application. It guides you from the high-level system overview down to specific file-level responsibilities and user interaction flows.

---

## 1. High-Level Overview

**SmartRecipe** is a full-stack, AI-powered kitchen pantry and recipe planner web application. Its core purpose is to help users manage the ingredients in their home pantries and leverage artificial intelligence (via Groq and Llama 3.3) to generate authentic Malaysian recipes.

### Tech Stack Summary
- **Frontend Framework**: Next.js (App Router, React 19)
- **Styling**: Vanilla CSS, Tailwind CSS v4
- **Database & Authentication**: Supabase (PostgreSQL, Client-side & Server-side cookies)
- **AI Engine**: Groq API (Running `llama-3.3-70b-versatile` with guaranteed JSON format responses)
- **Localization**: Custom Context-based translation engine supporting English (`en`), Bahasa Melayu (`ms`), and Simplified Chinese (`zh`).

---

## 2. System Architecture & Flow

The application is structured around a typical serverless Next.js architecture, utilizing client-side states for reactivity and server-side routes for security (like invoking the AI model credentials).

### System Diagram

```mermaid
graph TD
    User([User's Browser]) -->|1. Web Interface| FE[Next.js Client Components]
    
    subgraph Frontend (React / Next.js)
        FE -->|Read/Write Translations| TC[Language Context / Dict]
        FE -->|Session Management| SBA[Supabase Auth Client]
    end

    subgraph Backend / API
        FE -->|2. Database Operations| SBD[Supabase PostgreSQL DB]
        FE -->|3. POST /api/generate-recipe| API[Next.js API Route]
    end

    subgraph External Services
        API -->|4. Request with Groq Key| Groq[Groq AI Llama 3.3 Model]
        SBD -->|OAuth / Session Check| SupaAuth[Supabase Auth Server]
    end

    Groq -->|5. Guaranteed JSON Recipe| API
    API -->|6. Return Recipe JSON| FE
```

### End-to-End User Flow
1. **User Authentication**: The user logs in via [login/page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/login/page.tsx). Session cookies are set via `@supabase/ssr` to keep the user logged in across pages.
2. **Pantry Initialization**: If the database returns no items, the user is redirected to the Setup Pantry page ([setup-pantry/page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/setup-pantry/page.tsx)) to insert their initial ingredients.
3. **Pantry Selection & Management**: In the Dashboard ([dashboard/page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/dashboard/page.tsx)), users manage their items (add, delete, inline edit names/quantities/units). They select (via highlight borders) which subset of ingredients they wish to cook with.
4. **AI Generation**: Clicking a recipe mode button triggers a POST request to `/api/generate-recipe` carrying only the *selected* ingredients. The endpoint calls Groq's Llama 3.3 model. The AI returns exactly one cohesive Malaysian dish matching the JSON schema.
5. **Saved Recipes**: Users can click "Save" to record generated recipes into Supabase, which can then be viewed offline or later inside the Recipes module ([recipe/page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/recipe/page.tsx)).

---

## 3. Database Schema

The PostgreSQL database hosted on Supabase comprises two primary custom tables (excluding auth schemas):

### 1. `pantry_items`
Tracks individual ingredients owned by users.
- `id` (UUID, Primary Key): Unique identifier for the item.
- `user_id` (UUID, Foreign Key): Links to Supabase `auth.users.id`.
- `item_name` (Text): Name of the ingredient (e.g., "Chicken").
- `quantity` (Numeric/Float): Decimal values representing amount.
- `unit` (Text): Restricted units (`grams`, `ml`, `pieces`, `tbsp`).
- `created_at` (Timestamp).

### 2. `saved_recipes`
Stores AI-generated recipes favorited by users.
- `id` (UUID, Primary Key): Unique identifier for the recipe.
- `user_id` (UUID, Foreign Key): Links to Supabase `auth.users.id`.
- `recipe_name` (Text): Name of the dish.
- `ingredients_to_use` (Text[]): Array of selected pantry ingredients used.
- `ingredients_to_buy` (Text[]): Array of items required but missing.
- `prep_steps` (Text[]): List of preparatory instruction strings.
- `cooking_steps` (Text[]): List of step-by-step cooking instruction strings.
- `created_at` (Timestamp).

---

## 4. File Directory Map & Responsibilities

Below is a complete description of the project directories and files:

### Root Project Configuration Files
| File Name | Purpose |
| :--- | :--- |
| [package.json](file:///c:/Documents/Github/SmartRecipe/package.json) | Lists scripts (`dev`, `build`, `start`), project metadata, dependencies (Next.js, React, Supabase, Lucide icons), and devDependencies (Tailwind, ESLint, TypeScript). |
| [tsconfig.json](file:///c:/Documents/Github/SmartRecipe/tsconfig.json) | TypeScript compiler options, path mappings (e.g., `@/*` maps to `./src/*`), and module resolution targets. |
| [next.config.ts](file:///c:/Documents/Github/SmartRecipe/next.config.ts) | Next.js configuration. Bypasses TypeScript and ESLint build errors in production to allow quick deployment and integration. |
| [postcss.config.mjs](file:///c:/Documents/Github/SmartRecipe/postcss.config.mjs) | PostCSS setup, loading Tailwind CSS v4 processor plugins. |
| [eslint.config.mjs](file:///c:/Documents/Github/SmartRecipe/eslint.config.mjs) | Configures code-linting configurations utilizing Next.js configurations. |
| [.env.local](file:///c:/Documents/Github/SmartRecipe/.env.local) | Holds local development keys (Supabase Project URL, Supabase Public Anon Key, and `GROQ_API_KEY`). **Not committed to git.** |

---

### Source Code (`src/`)

#### 📂 `src/contexts/`
- **[LanguageContext.tsx](file:///c:/Documents/Github/SmartRecipe/src/contexts/LanguageContext.tsx)**: React context that initializes state for the active language (`en`, `ms`, or `zh`). Detects browser locales, serves translations dynamically using a custom key lookup function `t`, and wraps the main HTML layout to render the selected translations globally.

#### 📂 `src/translations/`
- **[index.ts](file:///c:/Documents/Github/SmartRecipe/src/translations/index.ts)**: Acts as the localized translation dictionary. Houses strings for English, Malay, and Chinese, containing corresponding labels for navigation, pantry setup, error dialogs, dashboard generate menus, and saved recipe grids.

#### 📂 `src/utils/supabase/`
- **[client.ts](file:///c:/Documents/Github/SmartRecipe/src/utils/supabase/client.ts)**: Configures the Supabase browser client utility (`createBrowserClient`) to request database calls directly from the user's browser.
- **[server.ts](file:///c:/Documents/Github/SmartRecipe/src/utils/supabase/server.ts)**: Configures the Supabase server-side client utility (`createServerClient`) which reads and sets server-side HTTP cookies (crucial for Auth middleware, layouts, and route callbacks).

#### 📂 `src/components/`
- **[Navbar.tsx](file:///c:/Documents/Github/SmartRecipe/src/components/Navbar.tsx)**: Global header layout. Restricts navigation if a user is not signed in. Includes navigation buttons to modules, displaying language toggle controls, and handling Supabase `auth.signOut()` commands.

---

#### 📂 `src/app/` (Next.js App Router Routes)

- **[layout.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/layout.tsx)**: The root wrapper for all pages. Injects Google Fonts (Inter), sets up the Language Context Provider, renders the global `Navbar`, and imports the base styles.
- **[page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/page.tsx)**: The main entry path `/`. Inspects session credentials. Authenticated users are navigated to the `/dashboard`, while anonymous traffic is directed to `/login`.
- **[globals.css](file:///c:/Documents/Github/SmartRecipe/src/app/globals.css)**: Holds the project CSS rules. Loads Tailwind core styles and defines theme variables (such as the base teal shade `"tiffany"`).

##### 📂 `src/app/login/`
- **[page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/login/page.tsx)**: Sign In / Sign Up portal `/login`. Interacts with Supabase Auth to verify emails and passwords.

##### 📂 `src/app/auth/`
- **[callback/route.ts](file:///c:/Documents/Github/SmartRecipe/src/app/auth/callback/route.ts)**: Serves `/auth/callback`. Captures temporary query verification codes (`?code=...`) sent from email signup links or OAuth callbacks and exchanges them for long-lived browser session cookies.

##### 📂 `src/app/setup-pantry/`
- **[page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/setup-pantry/page.tsx)**: Path `/setup-pantry`. Used for first-time onboarding. Renders multiple rows of ingredient item inputs (Name, Quantity, Unit). Saves items in a batch SQL query to Supabase.

##### 📂 `src/app/pantry/`
- **[page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/pantry/page.tsx)**: Path `/pantry`. Accessible via dashboard links. Uses the same batch insert input components as the setup page, redirecting users to the main dashboard upon saving new items.

##### 📂 `src/app/dashboard/`
- **[page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/dashboard/page.tsx)**: The dashboard hub `/dashboard`. 
  - **Pantry Display**: Lists user's items in card forms.
  - **Selection Controls**: Toggles checking states on cards (`selectedItemIds`), adding border highlights. Has Select/Deselect All buttons.
  - **Inline Editing**: Double-switches static cards into editable text inputs (Name, Quantity, Unit select dropdown) and commits updates directly via Supabase.
  - **Recipe Request**: Generates recipes based on unchecked/checked items using API endpoints. Displays result steps.
  - **Direct Regeneration**: Triggers immediate recipe generations under the same chosen mode (`existing` or `mix`) without leaving the current recipe card.
  - **Save Recipes**: Saves recipes directly from the generated card to the `saved_recipes` database table.

##### 📂 `src/app/recipe/`
- **[page.tsx](file:///c:/Documents/Github/SmartRecipe/src/app/recipe/page.tsx)**: Path `/recipe`. Fetches user's saved recipes from Supabase. Renders card grids displaying cooking history, which open modal panels detailing step-by-step prep/cooking guides.

##### 📂 `src/app/api/generate-recipe/`
- **[route.ts](file:///c:/Documents/Github/SmartRecipe/src/app/api/generate-recipe/route.ts)**: The POST `/api/generate-recipe` backend handler. Receives the filtered ingredient arrays, chosen mode, and language. Formulates a system message instructing the Llama 3.3 model on Groq's API. Emphasizes that it must generate exactly **one cohesive, culinary-sound Malaysian recipe (合理)** and does not need to force-use mismatching ingredients. Returns the structured JSON schema securely.
