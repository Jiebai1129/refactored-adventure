import { create } from 'zustand';
import { User } from '@prisma/client';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // 操作
  setCurrentUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoading: false,
  error: null,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  updateUser: (updatedUser) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updatedUser } : null,
  })),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 