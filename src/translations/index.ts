export type Language = 'en' | 'ms' | 'zh';

export const translations = {
    en: {
        nav: {
            dashboard: "Dashboard",
            pantry: "Pantry",
            recipes: "Recipes",
            logout: "Log Out",
            login: "Log In",
        },
        common: {
            loading: "Loading...",
            error: "An error occurred",
        },
        pantrySetup: {
            title: "Setup Your Pantry",
            description: "Add the ingredients and seasonings you currently have at home to generate smart recipes.",
            itemName: "Item Name",
            quantity: "Quantity",
            unit: "Unit",
            addMore: "Add Another Item",
            save: "Save & Continue",
            placeholderItem: "e.g., Garlic, Chicken, Soy Sauce",
            saving: "Saving...",
            success: "Pantry saved successfully!",
            errorEmpty: "Please fill in all item names and quantities.",
            units: {
                grams: "grams",
                ml: "ml",
                pieces: "pieces",
                tbsp: "tbsp"
            }
        },
        dashboard: {
            generateTitle: "Generate Smart Recipe",
            generateDesc: "Choose your generation mode based on what you want to cook today.",
            useExisting: "Use Existing Only",
            useExistingDesc: "Generate recipes using ONLY what you have in your pantry now.",
            mixMode: "Mix (Need to Buy)",
            mixModeDesc: "Generate recipes that use what you have, plus a few things to buy.",
            generating: "Generating your recipe...",
            prepTitle: "Prep Steps",
            cookTitle: "Cooking Steps",
            ingredientsUse: "Ingredients You Have",
            ingredientsBuy: "Ingredients to Buy",
            emptyBuy: "Perfect! No extra ingredients to buy.",
            back: "Back to Pantry",
            regenerate: "Try Another Recipe",
            saveBtn: "Save to My Recipes",
            savedBtn: "Saved!",
            selectAll: "Select All",
            deselectAll: "Deselect All",
            selectIngredients: "Select ingredients to use:",
            edit: "Edit",
            cancel: "Cancel",
            save: "Save",
            invalidQty: "Quantity must be greater than 0",
            generateNew: "Generate New Recipe"
        },
        savedRecipes: {
            title: "My Saved Recipes",
            description: "Access and cook your favorite AI-generated recipes anytime.",
            emptyState: "You haven't saved any recipes yet. Generate some on the Dashboard!",
            emptyAction: "Go to Dashboard",
            deleteConfirm: "Are you sure you want to delete this recipe?",
            deleteSuccess: "Recipe deleted successfully!",
            viewDetails: "View Recipe"
        }
    },
    ms: {
        nav: {
            dashboard: "Utama",
            pantry: "Pantri",
            recipes: "Resipi",
            logout: "Log Keluar",
            login: "Log Masuk",
        },
        common: {
            loading: "Memuatkan...",
            error: "Ralat telah berlaku",
        },
        pantrySetup: {
            title: "Sediakan Pantri Anda",
            description: "Tambah bahan-bahan dan perasa yang anda ada di rumah untuk menjana resipi pintar.",
            itemName: "Nama Bahan",
            quantity: "Kuantiti",
            unit: "Unit",
            addMore: "Tambah Bahan Lain",
            save: "Simpan & Teruskan",
            placeholderItem: "cgt., Bawang Putih, Ayam, Kicap",
            saving: "Menyimpan...",
            success: "Pantri berjaya disimpan!",
            errorEmpty: "Sila isi semua nama bahan dan kuantiti.",
            units: {
                grams: "gram",
                ml: "ml",
                pieces: "keping",
                tbsp: "sudu besar"
            }
        },
        dashboard: {
            generateTitle: "Jana Resipi Pintar",
            generateDesc: "Pilih mod penjanaan berdasarkan apa yang anda ingin masak hari ini.",
            useExisting: "Gunakan Bahan Sedia Ada Sahaja",
            useExistingDesc: "Jana resipi menggunakan HANYA bahan yang ada dalam pantri anda sekarang.",
            mixMode: "Campuran (Perlu Beli)",
            mixModeDesc: "Jana resipi menggunakan bahan sedia ada, ditambah sedikit barang untuk dibeli.",
            generating: "Menjana resipi anda...",
            prepTitle: "Langkah Penyediaan",
            cookTitle: "Langkah Memasak",
            ingredientsUse: "Bahan Yang Anda Ada",
            ingredientsBuy: "Bahan Perlu Dibeli",
            emptyBuy: "Hebat! Tiada bahan tambahan perlu dibeli.",
            back: "Kembali ke Pantri",
            regenerate: "Cuba Resipi Lain",
            saveBtn: "Simpan ke Resipi Saya",
            savedBtn: "Telah Disimpan!",
            selectAll: "Pilih Semua",
            deselectAll: "Nyahpilih Semua",
            selectIngredients: "Pilih bahan untuk digunakan:",
            edit: "Edit",
            cancel: "Batal",
            save: "Simpan",
            invalidQty: "Kuantiti mestilah lebih besar daripada 0",
            generateNew: "Jana Resipi Baru"
        },
        savedRecipes: {
            title: "Resipi Disimpan Saya",
            description: "Akses dan masak resipi kegemaran penjanaan AI anda pada bila-bila masa.",
            emptyState: "Anda belum menyimpan sebarang resipi lagi. Jana sekarang di Papan Pemuka!",
            emptyAction: "Pergi ke Papan Pemuka",
            deleteConfirm: "Adakah anda pasti mahu memadam resipi ini?",
            deleteSuccess: "Resipi berjaya dipadam!",
            viewDetails: "Lihat Resipi"
        }
    },
    zh: {
        nav: {
            dashboard: "主页",
            pantry: "我的储藏室",
            recipes: "智能菜谱",
            logout: "退出登录",
            login: "登录",
        },
        common: {
            loading: "加载中...",
            error: "发生错误",
        },
        pantrySetup: {
            title: "配置您的储藏室",
            description: "添加您目前家里的食材和调味料，以便为您智能生成菜谱。",
            itemName: "食材/调料名称",
            quantity: "数量",
            unit: "单位",
            addMore: "添加其他物品",
            save: "保存并继续",
            placeholderItem: "例如：大蒜、鸡肉、酱油",
            saving: "正在保存...",
            success: "储藏室保存成功！",
            errorEmpty: "请填写所有食材名称和数量。",
            units: {
                grams: "克",
                ml: "毫升",
                pieces: "个/件",
                tbsp: "汤匙"
            }
        },
        dashboard: {
            generateTitle: "智能菜谱生成器",
            generateDesc: "根据您今天想如何烹饪，选择一种生成模式。",
            useExisting: "仅用现有食材",
            useExistingDesc: "完全使用您储藏室现有的食材和调料生成菜谱，零采购。",
            mixMode: "混合模式 (需采购)",
            mixModeDesc: "充分利用现有食材，允许智能搭配少量需要额外购买的食材。",
            generating: "正在为您生成专属菜谱...",
            prepTitle: "第一阶段：准备步骤 (洗/切/腌)",
            cookTitle: "第二阶段：烹饪步骤 (上锅/摆盘)",
            ingredientsUse: "现有食材",
            ingredientsBuy: "需要采购的食材",
            emptyBuy: "太棒了！不需要采购其他食材。",
            back: "返回我的储藏室",
            regenerate: "换一个菜谱",
            saveBtn: "收藏此菜谱",
            savedBtn: "已收藏！",
            selectAll: "全选",
            deselectAll: "取消全选",
            selectIngredients: "选择要使用的食材：",
            edit: "编辑",
            cancel: "取消",
            save: "保存",
            invalidQty: "数量必须大于0",
            generateNew: "生成新菜谱"
        },
        savedRecipes: {
            title: "我收藏的菜谱",
            description: "随时查看您收藏的美味菜谱，并跟着它烹饪美食。",
            emptyState: "您还没有收藏任何菜谱。快去主页智能生成一些吧！",
            emptyAction: "前往智能生成",
            deleteConfirm: "您确定要删除这个收藏的菜谱吗？",
            deleteSuccess: "菜谱删除成功！",
            viewDetails: "查看完整步骤"
        }
    }
};
