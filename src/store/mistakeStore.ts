import { create } from 'zustand';
import { Mistake, Tag } from '@prisma/client';

export type MistakeWithTags = Mistake & {
  tags: Tag[];
};

interface MistakeState {
  mistakes: MistakeWithTags[];
  filteredMistakes: MistakeWithTags[];
  selectedTags: string[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  // 操作
  setMistakes: (mistakes: MistakeWithTags[]) => void;
  addMistake: (mistake: MistakeWithTags) => void;
  updateMistake: (id: string, mistake: Partial<MistakeWithTags>) => void;
  deleteMistake: (id: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  filterMistakes: () => void;
}

export const useMistakeStore = create<MistakeState>((set, get) => ({
  mistakes: [],
  filteredMistakes: [],
  selectedTags: [],
  searchQuery: '',
  isLoading: false,
  error: null,
  
  setMistakes: (mistakes) => set({ mistakes, filteredMistakes: mistakes }),
  
  addMistake: (mistake) => {
    set((state) => ({
      mistakes: [...state.mistakes, mistake],
    }));
    get().filterMistakes();
  },
  
  updateMistake: (id, updatedMistake) => {
    set((state) => ({
      mistakes: state.mistakes.map((mistake) => 
        mistake.id === id ? { ...mistake, ...updatedMistake } : mistake
      ),
    }));
    get().filterMistakes();
  },
  
  deleteMistake: (id) => {
    set((state) => ({
      mistakes: state.mistakes.filter((mistake) => mistake.id !== id),
    }));
    get().filterMistakes();
  },
  
  setSelectedTags: (tags) => {
    set({ selectedTags: tags });
    get().filterMistakes();
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterMistakes();
  },
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  filterMistakes: () => {
    const { mistakes, selectedTags, searchQuery } = get();
    
    let filtered = mistakes;
    
    // 按标签筛选
    if (selectedTags.length > 0) {
      filtered = filtered.filter((mistake) => 
        mistake.tags.some((tag) => selectedTags.includes(tag.id))
      );
    }
    
    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mistake) =>
          mistake.content.toLowerCase().includes(query) ||
          mistake.correctAnswer.toLowerCase().includes(query) ||
          (mistake.errorReason && mistake.errorReason.toLowerCase().includes(query)) ||
          (mistake.explanation && mistake.explanation.toLowerCase().includes(query)) ||
          mistake.tags.some((tag) => tag.name.toLowerCase().includes(query))
      );
    }
    
    set({ filteredMistakes: filtered });
  },
})); 