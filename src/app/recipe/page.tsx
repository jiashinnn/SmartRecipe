'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ChefHat, Trash2, ArrowRight, ClipboardList,
  CheckCircle, ShoppingBag, ListChecks, Sparkles, X
} from 'lucide-react';

interface SavedRecipe {
  id: string;
  recipe_name: string;
  ingredients_to_use: string[];
  ingredients_to_buy: string[];
  prep_steps: string[];
  cooking_steps: string[];
  created_at: string;
}

export default function RecipesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      // 1. Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/login');
        return;
      }

      // 2. Fetch user's saved recipes
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching saved recipes:", error);
      } else if (data) {
        setRecipes(data);
      }
      setLoading(false);
    };

    fetchSavedRecipes();
  }, [supabase, router]);

  const handleDeleteRecipe = async (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening details modal when deleting

    const confirmDelete = window.confirm(t.savedRecipes.deleteConfirm);
    if (!confirmDelete) return;

    setDeletingId(recipeId);
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      // Update state
      setRecipes(recipes.filter(r => r.id !== recipeId));
      alert(t.savedRecipes.deleteSuccess);
    } catch (err: any) {
      alert(err.message || "Failed to delete recipe.");
    } finally {
      setDeletingId(null);
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

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          {t.savedRecipes.title}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          {t.savedRecipes.description}
        </p>
      </div>

      {/* Empty State */}
      {recipes.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
          <span className="inline-flex p-4 rounded-3xl bg-tiffany/10 text-tiffany mb-4">
            <ClipboardList className="h-10 w-10" />
          </span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Saved Recipes</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            {t.savedRecipes.emptyState}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-tiffany hover:bg-tiffany-600 text-white font-extrabold rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-md shadow-tiffany/10"
          >
            <span>{t.savedRecipes.emptyAction}</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      ) : (
        /* Saved Recipes Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white border border-gray-150 hover:border-tiffany hover:shadow-lg rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between group relative"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="font-extrabold text-gray-800 text-lg group-hover:text-tiffany transition-colors leading-tight">
                    {recipe.recipe_name}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                    disabled={deletingId === recipe.id}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer self-start shrink-0"
                    title="Delete recipe"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Subtitles */}
                <p className="text-xs text-gray-400 font-semibold mb-4">
                  Saved: {new Date(recipe.created_at).toLocaleDateString()}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 bg-tiffany-50 text-tiffany rounded-md">
                    {recipe.ingredients_to_use.length} Ingredients
                  </span>
                  {recipe.ingredients_to_buy.length > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md">
                      {recipe.ingredients_to_buy.length} to Buy
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-tiffany mt-2 uppercase tracking-wider group-hover:translate-x-1.5 transition-transform">
                <span>{t.savedRecipes.viewDetails}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW RECIPE DETAILS MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-gray-150 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="inline-flex p-2 rounded-xl bg-tiffany/10 text-tiffany mb-2">
                  <ChefHat className="h-6 w-6" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-tiffany tracking-tight leading-tight">
                  {selectedRecipe.recipe_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-tiffany hover:bg-tiffany-50 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6">
              {/* Ingredients layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Ingredients to Use */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200/50">
                    <CheckCircle className="h-4.5 w-4.5 text-tiffany" />
                    <span>{t.dashboard.ingredientsUse}</span>
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedRecipe.ingredients_to_use.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-100 px-3 py-1.5 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-tiffany rounded-full shrink-0"></span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ingredients to Buy */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200/50">
                    <ShoppingBag className="h-4.5 w-4.5 text-amber-500" />
                    <span>{t.dashboard.ingredientsBuy}</span>
                  </h3>
                  {selectedRecipe.ingredients_to_buy.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <CheckCircle className="h-6 w-6 text-tiffany/80 mb-1" />
                      <p className="text-gray-400 font-semibold text-xs">{t.dashboard.emptyBuy}</p>
                    </div>
                  ) : (
                    <ul className="space-y-1.5">
                      {selectedRecipe.ingredients_to_buy.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Prep Steps */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  <ListChecks className="h-5 w-5 text-tiffany" />
                  <span>{t.dashboard.prepTitle}</span>
                </h3>
                <div className="space-y-3">
                  {selectedRecipe.prep_steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start p-2 rounded-xl hover:bg-gray-50/50 transition-all">
                      <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-tiffany-100 text-tiffany text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Steps */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  <Sparkles className="h-5 w-5 text-tiffany" />
                  <span>{t.dashboard.cookTitle}</span>
                </h3>
                <div className="space-y-4">
                  {selectedRecipe.cooking_steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-tiffany text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm shadow-tiffany/20">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-bold">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
