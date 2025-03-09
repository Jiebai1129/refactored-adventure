import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMistakeStore } from '@/store/mistakeStore';
import { useTagStore } from '@/store/tagStore';
import { useUserStore } from '@/store/userStore';
import MistakeCard from './MistakeCard';
import SearchFilter from '../filter/SearchFilter';
import { FaSpinner } from 'react-icons/fa';

const MistakeList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 从状态管理库获取数据和方法
  const {
    filteredMistakes,
    setMistakes,
    deleteMistake,
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    filterMistakes,
  } = useMistakeStore();
  
  const { tags, setTags } = useTagStore();
  const { currentUser, setCurrentUser } = useUserStore();
  
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
  
  // 加载错题和标签
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 获取标签
        const tagsResponse = await axios.get(`/api/tags?userId=${currentUser.id}`);
        setTags(tagsResponse.data);
        
        // 获取错题
        const mistakesResponse = await axios.get(`/api/mistakes?userId=${currentUser.id}`);
        setMistakes(mistakesResponse.data);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError('获取数据失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, setMistakes, setTags]);
  
  // 处理删除错题
  const handleDeleteMistake = async (id: string) => {
    if (!confirm('确定要删除这个错题吗？')) return;
    
    try {
      await axios.delete(`/api/mistakes/${id}`);
      deleteMistake(id);
    } catch (err) {
      console.error('删除错题失败:', err);
      alert('删除错题失败，请重试');
    }
  };
  
  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin w-8 h-8 text-blue-500" />
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    );
  }
  
  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          重试
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <SearchFilter
        tags={tags}
        selectedTags={selectedTags}
        searchQuery={searchQuery}
        onTagsChange={setSelectedTags}
        onSearchChange={setSearchQuery}
      />
      
      {/* 错题列表 */}
      {filteredMistakes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMistakes.map((mistake) => (
            <MistakeCard
              key={mistake.id}
              mistake={mistake}
              onDelete={handleDeleteMistake}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <p className="text-gray-500 mb-4">暂无错题</p>
          {(selectedTags.length > 0 || searchQuery) && (
            <p className="text-sm text-gray-400">
              尝试清除筛选条件或使用不同的搜索词
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MistakeList; 