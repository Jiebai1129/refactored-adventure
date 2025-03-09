'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';
import ReviewCard from '@/components/review/ReviewCard';
import { useReviewStore } from '@/store/reviewStore';
import { useMistakeStore } from '@/store/mistakeStore';
import { useUserStore } from '@/store/userStore';
import { MistakeWithTags } from '@/store/mistakeStore';
import { FaArrowLeft, FaArrowRight, FaSpinner, FaTimes } from 'react-icons/fa';

export default function ReviewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser } = useUserStore();
  const { mistakes, setMistakes } = useMistakeStore();
  const {
    isReviewing,
    startReview,
    endReview,
    nextMistake,
    prevMistake,
    updateMistakeMastery,
    getCurrentMistake,
    getProgress,
  } = useReviewStore();
  
  // 加载错题
  useEffect(() => {
    const fetchMistakes = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/mistakes?userId=${currentUser.id}`);
        setMistakes(response.data);
      } catch (err) {
        console.error('获取错题失败:', err);
        setError('获取错题失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMistakes();
  }, [currentUser, setMistakes]);
  
  // 开始复习
  const handleStartReview = async () => {
    if (mistakes.length === 0) {
      setError('没有可复习的错题');
      return;
    }
    
    setIsStarting(true);
    
    try {
      // 创建复习会话
      const response = await axios.post('/api/review');
      const sessionId = response.data.id;
      
      // 按掌握程度排序，优先复习掌握程度低的
      const sortedMistakes = [...mistakes].sort(
        (a, b) => a.masteryLevel - b.masteryLevel
      );
      
      startReview(sortedMistakes, sessionId);
    } catch (err) {
      console.error('开始复习失败:', err);
      setError('开始复习失败，请重试');
    } finally {
      setIsStarting(false);
    }
  };
  
  // 结束复习
  const handleEndReview = async () => {
    if (!confirm('确定要结束复习吗？')) return;
    
    try {
      const { sessionId } = useReviewStore.getState();
      if (sessionId) {
        await axios.post(`/api/review/${sessionId}/end`);
      }
      endReview();
    } catch (err) {
      console.error('结束复习失败:', err);
    }
  };
  
  // 更新掌握程度
  const handleMasteryChange = async (mistakeId: string, newLevel: number) => {
    const currentMistake = getCurrentMistake();
    if (!currentMistake) return;
    
    const { sessionId } = useReviewStore.getState();
    if (!sessionId) return;
    
    try {
      // 记录复习条目
      await axios.post('/api/review/entries', {
        mistakeId,
        oldMasteryLevel: currentMistake.masteryLevel,
        newMasteryLevel: newLevel,
        sessionId,
      });
      
      // 更新本地状态
      updateMistakeMastery(mistakeId, newLevel);
      
      // 自动进入下一题
      setTimeout(() => {
        nextMistake();
      }, 500);
    } catch (err) {
      console.error('更新掌握程度失败:', err);
    }
  };
  
  // 获取当前进度
  const progress = getProgress();
  const currentMistake = getCurrentMistake();
  
  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin w-8 h-8 text-blue-500" />
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      </MainLayout>
    );
  }
  
  // 如果没有在复习，显示开始复习界面
  if (!isReviewing) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto text-center py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">复习错题</h1>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
              <p>{error}</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              准备好开始复习了吗？
            </h2>
            
            <p className="text-gray-600 mb-6">
              {mistakes.length > 0
                ? `你有 ${mistakes.length} 道错题可以复习`
                : '你还没有添加任何错题'}
            </p>
            
            <button
              onClick={handleStartReview}
              disabled={isStarting || mistakes.length === 0}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isStarting ? '准备中...' : '开始复习'}
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // 如果已经复习完所有题目
  if (progress.current > progress.total) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto text-center py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">复习完成</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              恭喜你完成了所有错题的复习！
            </h2>
            
            <p className="text-gray-600 mb-6">
              你已经复习了 {progress.total} 道错题
            </p>
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              返回首页
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleEndReview}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">复习错题</h1>
          </div>
          
          <div className="text-gray-600">
            {progress.current} / {progress.total}
          </div>
        </div>
        
        {currentMistake && (
          <ReviewCard
            mistake={currentMistake}
            onMasteryChange={handleMasteryChange}
          />
        )}
        
        <div className="flex justify-between mt-6">
          <button
            onClick={prevMistake}
            disabled={progress.current <= 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            上一题
          </button>
          
          <button
            onClick={nextMistake}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            下一题
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </MainLayout>
  );
} 