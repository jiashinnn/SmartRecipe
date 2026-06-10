'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Trash2, Save, ChefHat, AlertCircle } from 'lucide-react';

interface PantryItemInput {
  item_name: string;
  quantity: string;
  unit: 'grams' | 'ml' | 'pieces' | 'tbsp';
}

export default function PantryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();

  const [items, setItems] = useState<PantryItemInput[]>([
    { item_name: '', quantity: '1', unit: 'pieces' }
  ]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
      } else {
        setUserId(user.id);
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleAddItem = () => {
    setItems([...items, { item_name: '', quantity: '1', unit: 'pieces' }]);
    setErrorMessage(null);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index: number, field: keyof PantryItemInput, value: string) => {
    const updatedItems = [...items];
    if (field === 'unit') {
      updatedItems[index].unit = value as any;
    } else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setErrorMessage(null);

    // Validate inputs
    const hasEmptyFields = items.some(item => !item.item_name.trim() || !item.quantity || parseFloat(item.quantity) <= 0);
    if (hasEmptyFields) {
      setErrorMessage(t.pantrySetup.errorEmpty);
      setLoading(false);
      return;
    }

    try {
      // Map items to database structure including the user_id
      const payload = items.map(item => ({
        user_id: userId,
        item_name: item.item_name.trim(),
        quantity: parseFloat(item.quantity),
        unit: item.unit
      }));

      // Insert items into pantry_items table
      const { error } = await supabase.from('pantry_items').insert(payload);

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ChefHat className="h-12 w-12 text-tiffany animate-bounce" />
        <p className="text-gray-500 font-medium">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8">
      {/* Title Header */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">
          {t.pantrySetup.title}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto">
          {t.pantrySetup.description}
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mx-4 mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex gap-3 items-start shadow-xs">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="px-4">
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-150 rounded-2xl shadow-xs transition-all hover:border-tiffany-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                {/* Item Name */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    {t.pantrySetup.itemName}
                  </label>
                  <input
                    type="text"
                    required
                    value={item.item_name}
                    onChange={(e) => handleInputChange(index, 'item_name', e.target.value)}
                    placeholder={t.pantrySetup.placeholderItem}
                    className="w-full text-base py-3 px-4 bg-gray-50 hover:bg-gray-100/50 focus:bg-white rounded-xl border border-gray-200 focus:border-tiffany focus:ring-2 focus:ring-tiffany/20 transition-all outline-none"
                  />
                </div>

                {/* Grid for Quantity and Unit */}
                <div className="grid grid-cols-2 gap-3 md:w-80 shrink-0">
                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      {t.pantrySetup.quantity}
                    </label>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                      className="w-full text-base py-3 px-4 bg-gray-50 hover:bg-gray-100/50 focus:bg-white rounded-xl border border-gray-200 focus:border-tiffany focus:ring-2 focus:ring-tiffany/20 transition-all outline-none"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      {t.pantrySetup.unit}
                    </label>
                    <select
                      value={item.unit}
                      onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                      className="w-full text-base py-3 px-3 bg-gray-50 hover:bg-gray-100/50 focus:bg-white rounded-xl border border-gray-200 focus:border-tiffany focus:ring-2 focus:ring-tiffany/20 transition-all outline-none appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="pieces">{t.pantrySetup.units.pieces}</option>
                      <option value="grams">{t.pantrySetup.units.grams}</option>
                      <option value="ml">{t.pantrySetup.units.ml}</option>
                      <option value="tbsp">{t.pantrySetup.units.tbsp}</option>
                    </select>
                  </div>
                </div>

                {/* Delete button */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="flex items-center justify-center self-end md:self-auto gap-2 py-3 px-4 md:py-3.5 md:px-3.5 rounded-xl border border-red-150 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer w-full md:w-auto"
                    title="Delete item"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="md:hidden font-medium text-sm">Delete Item</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-dashed border-tiffany text-tiffany font-bold hover:bg-tiffany/5 active:scale-98 transition-all cursor-pointer w-full sm:flex-1"
          >
            <Plus className="h-5 w-5" />
            <span>{t.pantrySetup.addMore}</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-tiffany hover:bg-tiffany-600 text-white font-bold disabled:opacity-50 active:scale-98 transition-all cursor-pointer w-full sm:flex-1 shadow-md shadow-tiffany/10"
          >
            {loading ? (
              <span>{t.pantrySetup.saving}</span>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{t.pantrySetup.save}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
