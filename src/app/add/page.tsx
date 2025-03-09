'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';
import MistakeForm from '@/components/mistake/MistakeForm';
import { useTagStore } from '@/store/tagStore';
import { useUserStore } from '@/store/userStore';
import { useMistakeStore } from '@/store/mistakeStore';
import { Tag } from '@prisma/client';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

export default function AddMistakePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { tags, setTags } = useTagStore();
  const { currentUser, setCurrentUser } = useUserStore();
  const { addMistake } = useMistakeStore();
  
  // 模拟用户登录（实际应用中应该有登录系统）
  useEffect(() => {
    const setupUser = async () => {
      try {
        // 创建或获取默认用户
        const response = await axios.post('/api/users', {
          name: '默认用户',
          email: 'default@example.com',
        });
        
        setCurrentUser(response.data);
      } catch (err) {
        console.error('设置用户失败:', err);
        setError('无法设置用户');
      }
    };
    
    if (!currentUser) {
      setupUser();
    }
  }, [currentUser, setCurrentUser]);
  
  // 加载标签
  useEffect(() => {
    const fetchTags = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/tags?userId=${currentUser.id}`);
        setTags(response.data);
      } catch (err) {
        console.error('获取标签失败:', err);
        setError('获取标签失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTags();
  }, [currentUser, setTags]);
  
  // 创建新标签
  const handleCreateTag = async (name: string): Promise<Tag | null> => {
    if (!currentUser) return null;
    
    try {
      const response = await axios.post('/api/tags', {
        name,
        userId: currentUser.id,
      });
      
      const newTag = response.data;
      setTags([...tags, newTag]);
      return newTag;
    } catch (err) {
      console.error('创建标签失败:', err);
      return null;
    }
  };
  
  // 提交错题表单
  const handleSubmit = async (data: any) => {
    if (!currentUser) {
      setError('请先登录');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/mistakes', {
        ...data,
        userId: currentUser.id,
      });
      
      addMistake(response.data);
      router.push('/');
    } catch (err) {
      console.error('添加错题失败:', err);
      setError('添加错题失败，请重试');
      setIsSubmitting(false);
    }
  };
  
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
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">添加错题</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <MistakeForm
          tags={tags}
          onSubmit={handleSubmit}
          onCreateTag={handleCreateTag}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
} 