'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '@/components/layout/MainLayout';
import { useUserStore } from '@/store/userStore';
import { useMistakeStore } from '@/store/mistakeStore';
import { useTagStore } from '@/store/tagStore';
import { FaSpinner, FaChartBar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function StatsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewSessions, setReviewSessions] = useState<any[]>([]);
  
  const { currentUser } = useUserStore();
  const { mistakes } = useMistakeStore();
  const { tags } = useTagStore();
  
  // 加载复习会话数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('/api/review');
        setReviewSessions(response.data);
      } catch (err) {
        console.error('获取复习数据失败:', err);
        setError('获取复习数据失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 计算统计数据
  const calculateStats = () => {
    // 按掌握程度分组
    const masteryGroups = [0, 0, 0, 0, 0, 0]; // 0-5 级掌握程度
    mistakes.forEach((mistake) => {
      masteryGroups[mistake.masteryLevel]++;
    });
    
    // 计算标签统计
    const tagStats = tags.map((tag) => {
      const tagMistakes = mistakes.filter((mistake) =>
        mistake.tags.some((t) => t.id === tag.id)
      );
      
      return {
        id: tag.id,
        name: tag.name,
        count: tagMistakes.length,
        masteryAvg:
          tagMistakes.length > 0
            ? tagMistakes.reduce((sum, m) => sum + m.masteryLevel, 0) /
              tagMistakes.length
            : 0,
      };
    });
    
    // 按错题数量排序
    tagStats.sort((a, b) => b.count - a.count);
    
    // 计算复习统计
    const totalReviewed = reviewSessions.reduce(
      (sum, session) => sum + session.mistakesReviewed,
      0
    );
    
    const lastWeekSessions = reviewSessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });
    
    const lastWeekReviewed = lastWeekSessions.reduce(
      (sum, session) => sum + session.mistakesReviewed,
      0
    );
    
    return {
      totalMistakes: mistakes.length,
      masteryGroups,
      tagStats: tagStats.slice(0, 5), // 只取前5个标签
      totalReviewed,
      lastWeekReviewed,
      sessionCount: reviewSessions.length,
    };
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
  
  // 如果有错误，显示错误信息
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              重试
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const stats = calculateStats();
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">学习统计</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 错题总览 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaChartBar className="mr-2 text-blue-500" />
              错题总览
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">错题总数</span>
                <span className="font-semibold">{stats.totalMistakes}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">已掌握</span>
                <span className="font-semibold text-green-600">
                  {stats.masteryGroups[4] + stats.masteryGroups[5]}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">待加强</span>
                <span className="font-semibold text-yellow-600">
                  {stats.masteryGroups[2] + stats.masteryGroups[3]}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">未掌握</span>
                <span className="font-semibold text-red-600">
                  {stats.masteryGroups[0] + stats.masteryGroups[1]}
                </span>
              </div>
            </div>
            
            {/* 掌握度进度条 */}
            <div className="mt-6">
              <div className="flex h-4 rounded-full overflow-hidden">
                <div
                  className="bg-red-500"
                  style={{
                    width: `${
                      (stats.masteryGroups[0] + stats.masteryGroups[1]) /
                      stats.totalMistakes *
                      100
                    }%`,
                  }}
                ></div>
                <div
                  className="bg-yellow-500"
                  style={{
                    width: `${
                      (stats.masteryGroups[2] + stats.masteryGroups[3]) /
                      stats.totalMistakes *
                      100
                    }%`,
                  }}
                ></div>
                <div
                  className="bg-green-500"
                  style={{
                    width: `${
                      (stats.masteryGroups[4] + stats.masteryGroups[5]) /
                      stats.totalMistakes *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>未掌握</span>
                <span>待加强</span>
                <span>已掌握</span>
              </div>
            </div>
          </div>
          
          {/* 复习统计 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaCheckCircle className="mr-2 text-green-500" />
              复习统计
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">总复习次数</span>
                <span className="font-semibold">{stats.sessionCount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">总复习题数</span>
                <span className="font-semibold">{stats.totalReviewed}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">近7天复习题数</span>
                <span className="font-semibold">{stats.lastWeekReviewed}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">平均每次复习题数</span>
                <span className="font-semibold">
                  {stats.sessionCount > 0
                    ? Math.round(stats.totalReviewed / stats.sessionCount)
                    : 0}
                </span>
              </div>
            </div>
          </div>
          
          {/* 标签统计 */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaExclamationCircle className="mr-2 text-yellow-500" />
              标签统计（Top 5）
            </h2>
            
            {stats.tagStats.length > 0 ? (
              <div className="space-y-4">
                {stats.tagStats.map((tag) => (
                  <div key={tag.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{tag.name}</span>
                      <span className="font-semibold">{tag.count} 题</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(tag.count / stats.totalMistakes) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      平均掌握度: {tag.masteryAvg.toFixed(1)} / 5
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">暂无标签数据</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 