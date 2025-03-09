import { create } from 'zustand';
import { MistakeWithTags } from './mistakeStore';

interface ReviewState {
  isReviewing: boolean;
  reviewMistakes: MistakeWithTags[];
  currentIndex: number;
  sessionId: string | null;
  
  // 操作
  startReview: (mistakes: MistakeWithTags[], sessionId: string) => void;
  endReview: () => void;
  nextMistake: () => void;
  prevMistake: () => void;
  updateMistakeMastery: (mistakeId: string, newMasteryLevel: number) => void;
  getCurrentMistake: () => MistakeWithTags | null;
  getProgress: () => { current: number; total: number };
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  isReviewing: false,
  reviewMistakes: [],
  currentIndex: 0,
  sessionId: null,
  
  startReview: (mistakes, sessionId) => set({
    isReviewing: true,
    reviewMistakes: mistakes,
    currentIndex: 0,
    sessionId,
  }),
  
  endReview: () => set({
    isReviewing: false,
    reviewMistakes: [],
    currentIndex: 0,
    sessionId: null,
  }),
  
  nextMistake: () => set((state) => ({
    currentIndex: Math.min(state.currentIndex + 1, state.reviewMistakes.length - 1),
  })),
  
  prevMistake: () => set((state) => ({
    currentIndex: Math.max(state.currentIndex - 1, 0),
  })),
  
  updateMistakeMastery: (mistakeId, newMasteryLevel) => set((state) => ({
    reviewMistakes: state.reviewMistakes.map((mistake) =>
      mistake.id === mistakeId
        ? { ...mistake, masteryLevel: newMasteryLevel }
        : mistake
    ),
  })),
  
  getCurrentMistake: () => {
    const { reviewMistakes, currentIndex } = get();
    return reviewMistakes.length > 0 ? reviewMistakes[currentIndex] : null;
  },
  
  getProgress: () => {
    const { reviewMistakes, currentIndex } = get();
    return {
      current: currentIndex + 1,
      total: reviewMistakes.length,
    };
  },
})); 