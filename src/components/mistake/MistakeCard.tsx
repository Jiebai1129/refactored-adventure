import React from 'react';
import Link from 'next/link';
import { MistakeWithTags } from '@/store/mistakeStore';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';

interface MistakeCardProps {
  mistake: MistakeWithTags;
  onDelete: (id: string) => void;
}

const MistakeCard: React.FC<MistakeCardProps> = ({ mistake, onDelete }) => {
  // 根据掌握程度显示不同颜色的星星
  const renderMasteryStars = () => {
    const stars = [];
    const maxStars = 5;
    
    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`w-4 h-4 ${
            i < mistake.masteryLevel
              ? 'text-yellow-500'
              : 'text-gray-300'
          }`}
        />
      );
    }
    
    return <div className="flex space-x-1">{stars}</div>;
  };
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {mistake.content}
          </h3>
          <div className="mt-1 text-sm text-gray-500">
            创建于 {formatDate(mistake.createdAt)}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <Link
            href={`/mistake/${mistake.id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => onDelete(mistake.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-700 font-medium">正确答案:</div>
        <div className="text-sm text-gray-600 line-clamp-2">
          {mistake.correctAnswer}
        </div>
      </div>
      
      {mistake.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {mistake.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {mistake.reviewedAt
            ? `上次复习: ${formatDate(mistake.reviewedAt)}`
            : '未复习'}
        </div>
        {renderMasteryStars()}
      </div>
    </div>
  );
};

export default MistakeCard; 