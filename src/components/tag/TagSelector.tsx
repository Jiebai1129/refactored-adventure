import React, { useState } from 'react';
import { Tag } from '@prisma/client';
import { FaPlus, FaTimes } from 'react-icons/fa';

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: Tag[];
  onSelectTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
  onCreateTag?: (name: string) => Promise<Tag | null>;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onSelectTag,
  onRemoveTag,
  onCreateTag,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 过滤掉已选择的标签
  const availableTags = tags.filter(
    (tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id)
  );
  
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError('标签名不能为空');
      return;
    }
    
    if (!onCreateTag) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      const createdTag = await onCreateTag(newTagName.trim());
      if (createdTag) {
        onSelectTag(createdTag);
        setNewTagName('');
      }
    } catch (err) {
      setError('创建标签失败');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            <span>{tag.name}</span>
            <button
              onClick={() => onRemoveTag(tag.id)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="添加或创建标签"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {newTagName && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {availableTags
                .filter((tag) =>
                  tag.name.toLowerCase().includes(newTagName.toLowerCase())
                )
                .map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => {
                      onSelectTag(tag);
                      setNewTagName('');
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {tag.name}
                  </div>
                ))}
              {onCreateTag && (
                <div
                  onClick={handleCreateTag}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-blue-600"
                >
                  <FaPlus className="mr-2" />
                  创建 "{newTagName}"
                </div>
              )}
            </div>
          )}
        </div>
        
        {onCreateTag && (
          <button
            onClick={handleCreateTag}
            disabled={isCreating || !newTagName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isCreating ? '创建中...' : '创建'}
          </button>
        )}
      </div>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default TagSelector; 