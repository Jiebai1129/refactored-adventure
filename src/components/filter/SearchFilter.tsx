import React, { useState, useEffect } from 'react';
import { Tag } from '@prisma/client';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface SearchFilterProps {
  tags: Tag[];
  selectedTags: string[];
  searchQuery: string;
  onTagsChange: (tagIds: string[]) => void;
  onSearchChange: (query: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  tags,
  selectedTags,
  searchQuery,
  onTagsChange,
  onSearchChange,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // 当外部搜索查询变化时更新本地状态
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);
  
  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };
  
  // 提交搜索
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };
  
  // 切换标签选择
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };
  
  // 清除所有筛选条件
  const clearFilters = () => {
    onTagsChange([]);
    onSearchChange('');
    setLocalSearch('');
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={localSearch}
          onChange={handleSearchInput}
          placeholder="搜索错题..."
          className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            selectedTags.length > 0 ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          <FaFilter />
        </button>
      </form>
      
      {(isFilterOpen || selectedTags.length > 0) && (
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">按标签筛选</h3>
            {(selectedTags.length > 0 || localSearch) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 flex items-center"
              >
                <FaTimes className="mr-1" />
                清除筛选
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
            
            {tags.length === 0 && (
              <p className="text-gray-500 text-sm">暂无标签</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 