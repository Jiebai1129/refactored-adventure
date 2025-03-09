import React, { useState } from 'react';
import { MistakeWithTags } from '@/store/mistakeStore';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';

interface ReviewCardProps {
  mistake: MistakeWithTags;
  onMasteryChange: (mistakeId: string, newLevel: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ mistake, onMasteryChange }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  
  // 渲染掌握度选择器
  const renderMasterySelector = () => {
    const maxStars = 5;
    const stars = [];
    
    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => onMasteryChange(mistake.id, i + 1)}
          className="focus:outline-none"
        >
          <FaStar
            className={`w-8 h-8 ${
              i < mistake.masteryLevel
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          />
        </button>
      );
    }
    
    return <div className="flex space-x-2">{stars}</div>;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* 错题内容 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">题目内容</h3>
          <div className="bg-gray-50 p-4 rounded-md text-gray-800">
            {mistake.content}
          </div>
        </div>
        
        {/* 错题图片（如果有） */}
        {mistake.imageUrl && (
          <div className="flex justify-center">
            <div className="relative w-full h-64">
              <Image
                src={mistake.imageUrl}
                alt="错题图片"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </div>
        )}
        
        {/* 标签 */}
        {mistake.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mistake.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        {/* 显示/隐藏答案按钮 */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {showAnswer ? '隐藏答案' : '显示答案'}
          </button>
        </div>
        
        {/* 答案和解释（可切换显示） */}
        {showAnswer && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">正确答案</h3>
              <div className="bg-green-50 p-4 rounded-md text-gray-800">
                {mistake.correctAnswer}
              </div>
            </div>
            
            {mistake.errorReason && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">错误原因</h3>
                <div className="bg-red-50 p-4 rounded-md text-gray-800">
                  {mistake.errorReason}
                </div>
              </div>
            )}
            
            {mistake.explanation && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">解析</h3>
                <div className="bg-blue-50 p-4 rounded-md text-gray-800">
                  {mistake.explanation}
                </div>
              </div>
            )}
            
            {/* 掌握度评分 */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                掌握程度
              </h3>
              <div className="flex justify-center">
                {renderMasterySelector()}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                点击星星评价你对这道题的掌握程度
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard; 