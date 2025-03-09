'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';
import MistakeForm from '@/components/mistake/MistakeForm';
import { useTagStore } from '@/store/tagStore';
import { useUserStore } from '@/store/userStore';
import { useMistakeStore } from '@/store/mistakeStore';
import { MistakeWithTags } from '@/store/mistakeStore';
import { Tag } from '@prisma/client';
import { FaArrowLeft, FaSpinner, FaTrash } from 'react-icons/fa';

interface MistakeDetailPageProps {
  params: {
    id: string;
  };
}

export default function MistakeDetailPage({ params }: MistakeDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const [mistake, setMistake] = useState<MistakeWithTags | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { tags, setTags } = useTagStore();
  const { currentUser } = useUserStore();
  const { updateMistake, deleteMistake } = useMistakeStore();
  
  // 加载错题和标签
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 获取错题详情
        const mistakeResponse = await axios.get(`/api/mistakes/${id}`);
        setMistake(mistakeResponse.data);
        
        // 获取所有标签
        if (currentUser) {
          const tagsResponse = await axios.get(`/api/tags?userId=${currentUser.id}`);
          setTags(tagsResponse.data);
        }
      } catch (err) {
        console.error('获取数据失败:', err);
        setError('获取数据失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, currentUser, setTags]);
  
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
    setIsSubmitting(true);
    
    try {
      const response = await axios.put(`/api/mistakes/${id}`, data);
      updateMistake(id, response.data);
      router.push('/');
    } catch (err) {
      console.error('更新错题失败:', err);
      setError('更新错题失败，请重试');
      setIsSubmitting(false);
    }
  };
  
  // 删除错题
  const handleDelete = async () => {
    if (!confirm('确定要删除这个错题吗？')) return;
    
    try {
      await axios.delete(`/api/mistakes/${id}`);
      deleteMistake(id);
      router.push('/');
    } catch (err) {
      console.error('删除错题失败:', err);
      setError('删除错题失败，请重试');
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
  
  // 如果错题不存在，显示错误信息
  if (!mistake) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <p>错题不存在或已被删除</p>
            <button
              onClick={() => router.push('/')}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
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
              onClick={() => router.back()}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">编辑错题</h1>
          </div>
          
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
          >
            <FaTrash className="mr-2" />
            删除
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        <MistakeForm
          initialData={mistake}
          tags={tags}
          onSubmit={handleSubmit}
          onCreateTag={handleCreateTag}
          isSubmitting={isSubmitting}
        />
      </div>
    </MainLayout>
  );
} 