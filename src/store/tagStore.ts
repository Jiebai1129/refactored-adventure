import { create } from 'zustand';
import { Tag } from '@prisma/client';

interface TagState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  
  // 操作
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  isLoading: false,
  error: null,
  
  setTags: (tags) => set({ tags }),
  
  addTag: (tag) => set((state) => ({
    tags: [...state.tags, tag],
  })),
  
  updateTag: (id, updatedTag) => set((state) => ({
    tags: state.tags.map((tag) => 
      tag.id === id ? { ...tag, ...updatedTag } : tag
    ),
  })),
  
  deleteTag: (id) => set((state) => ({
    tags: state.tags.filter((tag) => tag.id !== id),
  })),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 