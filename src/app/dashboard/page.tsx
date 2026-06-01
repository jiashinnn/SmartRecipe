'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ChefHat, Plus, ClipboardList, Trash2, 
  Sparkles, ShoppingBag, CheckCircle, 
  ListChecks, ArrowLeft, RefreshCw, AlertCircle, Bookmark, BookmarkCheck 
} from 'lucide-react';

interface PantryItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
}

interface GeneratedRecipe {
  recipeName: string;
  ingredientsToUse: string[];
  ingredientsToBuy: string[];
  prepSteps: string[];
  cookingSteps: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<PantryItem[]>([]);
  
  // AI generation states
  const [generating, setGenerating] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Saving recipe states
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);

  useEffect(() => {
    const initDashboard = async () => {
      // 1. Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // 2. Fetch user's pantry items
      const { data, error } = await supabase
        .from('pantry_items')
        .select('id, item_name, quantity, unit')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching pantry items:", error);
      } else if (!data || data.length === 0) {
        // Redirection rule: If no pantry items exist, redirect user to pantry setup page!
        router.push('/setup-pantry');
        return;
      } else {
        setItems(data);
      }
      setLoading(false);
    };

    initDashboard();
  }, [supabase, router]);

  const handleDeleteItem = async (itemId: string) => {
    const { error } = await supabase.from('pantry_items').delete().eq('id', itemId);
    if (!error) {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      // If deleted last item, redirect to setup
      if (updatedItems.length === 0) {
        router.push('/setup-pantry');
      }
    }
  };

  const handleGenerateRecipe = async (mode: 'existing' | 'mix') => {
    setGenerating(true);
    setErrorMsg(null);
    setRecipe(null);
    setRecipeSaved(false);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: items,
          mode,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setRecipe(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during recipe generation.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe || !user) return;
    setSavingRecipe(true);
    try {
      const { error } = await supabase.from('saved_recipes').insert({
        user_id: user.id,
        recipe_name: recipe.recipeName,
        ingredients_to_use: recipe.ingredientsToUse,
        ingredients_to_buy: recipe.ingredientsToBuy,
        prep_steps: recipe.prepSteps,
        cooking_steps: recipe.cookingSteps
      });

      if (error) throw error;
      setRecipeSaved(true);
    } catch (err: any) {
      console.error("Error saving recipe:", err);
      alert(err.message || "Failed to save recipe.");
    } finally {
      setSavingRecipe(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ChefHat className="h-12 w-12 text-tiffany animate-spin" />
        <p className="text-gray-500 font-medium">{t.common.loading}</p>
      </div>
    );
  }

  // DISPLAY GENERATED RECIPE STATE
  if (recipe) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4">
        {/* Header navigation */}
        <button
          onClick={() => setRecipe(null)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-tiffany font-bold text-sm mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>{t.dashboard.back}</span>
        </button>

        {/* Recipe Title Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow mb-6 text-center flex flex-col items-center">
          <span className="inline-flex p-3 rounded-2xl bg-tiffany/10 text-tiffany mb-4">
            <ChefHat className="h-8 w-8" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-tiffany mb-2 tracking-tight">
            {recipe.recipeName}
          </h1>
          <div className="w-12 h-1 bg-tiffany/20 rounded-full my-4"></div>
          
          {/* Save Recipe Button */}
          <button
            onClick={handleSaveRecipe}
            disabled={savingRecipe || recipeSaved}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border active:scale-95 cursor-pointer ${
              recipeSaved 
                ? 'bg-green-550 border-green-200 text-green-600 bg-green-50' 
                : 'bg-tiffany hover:bg-tiffany-600 text-white border-tiffany shadow-md shadow-tiffany/10'
            }`}
          >
            {recipeSaved ? (
              <>
                <BookmarkCheck className="h-4.5 w-4.5 text-green-600" />
                <span>{t.dashboard.savedBtn}</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4.5 w-4.5" />
                <span>{savingRecipe ? t.pantrySetup.saving : t.dashboard.saveBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Ingredients grids (stacks on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Ingredients to Use */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
              <CheckCircle className="h-5 w-5 text-tiffany" />
              <span>{t.dashboard.ingredientsUse}</span>
            </h2>
            <ul className="space-y-2">
              {recipe.ingredientsToUse.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-tiffany-50/30 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 bg-tiffany rounded-full shrink-0"></span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ingredients to Buy */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              <span>{t.dashboard.ingredientsBuy}</span>
            </h2>
            {recipe.ingredientsToBuy.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle className="h-8 w-8 text-tiffany/80 mb-2 animate-bounce" />
                <p className="text-gray-500 font-semibold text-sm">{t.dashboard.emptyBuy}</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {recipe.ingredientsToBuy.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Dynamic Prep Steps UI */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
            <ListChecks className="h-5 w-5 text-tiffany" />
            <span>{t.dashboard.prepTitle}</span>
          </h2>
          <div className="space-y-4">
            {recipe.prepSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start p-3 hover:bg-gray-50/50 rounded-2xl transition-all">
                <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-tiffany-100 text-tiffany text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Cooking Steps UI */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
            <Sparkles className="h-5 w-5 text-tiffany" />
            <span>{t.dashboard.cookTitle}</span>
          </h2>
          <div className="space-y-5">
            {recipe.cookingSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-tiffany text-white text-sm font-extrabold shrink-0 mt-0.5 shadow-sm shadow-tiffany/20">
                  {idx + 1}
                </span>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => setRecipe(null)}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-tiffany hover:bg-tiffany-600 text-white font-extrabold text-base transition-all active:scale-98 cursor-pointer shadow-lg shadow-tiffany/10"
        >
          <RefreshCw className="h-5 w-5" />
          <span>{t.dashboard.regenerate}</span>
        </button>
      </div>
    );
  }

  // ACTIVE GENERATION LOADING STATE
  if (generating) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-full border-4 border-tiffany/10 border-t-tiffany animate-spin"></div>
          <ChefHat className="h-8 w-8 text-tiffany absolute top-6 left-6 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{t.dashboard.generating}</h2>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
          Groq AI is analyzing your pantry items to create an authentic Malaysian recipe customized for you.
        </p>
      </div>
    );
  }

  // MAIN DASHBOARD VIEW
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          {t.dashboard.generateTitle}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          {t.dashboard.generateDesc}
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex gap-3 items-start shadow-xs">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Two Large Mode Buttons (highly optimized for mobile touch inputs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Mode 1: Use Existing Only */}
        <button
          onClick={() => handleGenerateRecipe('existing')}
          className="flex flex-col text-left p-6 sm:p-8 bg-white border-2 border-gray-150 hover:border-tiffany rounded-3xl transition-all hover:shadow-xl active:scale-98 cursor-pointer group"
        >
          <span className="p-3 rounded-2xl bg-tiffany/10 text-tiffany mb-6 group-hover:bg-tiffany group-hover:text-white transition-colors duration-300">
            <CheckCircle className="h-7 w-7" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{t.dashboard.useExisting}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{t.dashboard.useExistingDesc}</p>
        </button>

        {/* Mode 2: Mix Mode */}
        <button
          onClick={() => handleGenerateRecipe('mix')}
          className="flex flex-col text-left p-6 sm:p-8 bg-white border-2 border-gray-150 hover:border-tiffany rounded-3xl transition-all hover:shadow-xl active:scale-98 cursor-pointer group"
        >
          <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{t.dashboard.mixMode}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{t.dashboard.mixModeDesc}</p>
        </button>
      </div>

      {/* Pantry Inventory List card at the bottom */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-tiffany/10 text-tiffany">
              <ClipboardList className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-gray-900">Your Current Pantry Inventory ({items.length})</h2>
          </div>
          <button
            onClick={() => router.push('/pantry')}
            className="flex items-center gap-1.5 px-4 py-2 border border-tiffany/20 text-tiffany hover:bg-tiffany-50 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add More</span>
          </button>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-gray-50 border border-gray-150 hover:border-tiffany-100 hover:bg-tiffany-50/20 rounded-2xl transition-all"
            >
              <div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">{item.item_name}</h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">
                  {item.quantity} {t.pantrySetup.units[item.unit as keyof typeof t.pantrySetup.units] || item.unit}
                </p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-white hover:border-red-150 transition-all cursor-pointer"
                title="Delete item"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
