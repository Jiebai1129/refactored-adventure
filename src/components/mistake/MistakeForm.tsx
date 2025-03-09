import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Tag } from '@prisma/client';
import { MistakeWithTags } from '@/store/mistakeStore';
import TagSelector from '../tag/TagSelector';
import { FaCamera, FaImage, FaTimes } from 'react-icons/fa';

interface MistakeFormProps {
  initialData?: MistakeWithTags;
  tags: Tag[];
  onSubmit: (data: any) => void;
  onCreateTag?: (name: string) => Promise<Tag | null>;
  isSubmitting: boolean;
}

const MistakeForm: React.FC<MistakeFormProps> = ({
  initialData,
  tags,
  onSubmit,
  onCreateTag,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: initialData || {
      content: '',
      correctAnswer: '',
      explanation: '',
      errorReason: '',
      imageUrl: '',
    },
  });
  
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    initialData?.tags || []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  
  // 处理图片上传
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 在实际应用中，这里应该上传图片到服务器或云存储
    // 这里仅做本地预览
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setValue('imageUrl', result);
    };
    reader.readAsDataURL(file);
  };
  
  // 移除图片
  const removeImage = () => {
    setImagePreview(null);
    setValue('imageUrl', '');
  };
  
  // 处理标签选择
  const handleSelectTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
  };
  
  // 处理移除标签
  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };
  
  // 提交表单
  const onFormSubmit = (data: any) => {
    // 添加标签ID到提交数据
    const formData = {
      ...data,
      tags: selectedTags.map((tag) => tag.id),
    };
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* 题目内容 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          题目内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('content', { required: '请输入题目内容' })}
          rows={4}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入题目内容..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>
      
      {/* 正确答案 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          正确答案 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('correctAnswer', { required: '请输入正确答案' })}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入正确答案..."
        />
        {errors.correctAnswer && (
          <p className="mt-1 text-sm text-red-500">{errors.correctAnswer.message}</p>
        )}
      </div>
      
      {/* 错误原因 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          错误原因
        </label>
        <textarea
          {...register('errorReason')}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入错误原因..."
        />
      </div>
      
      {/* 解析 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          解析
        </label>
        <textarea
          {...register('explanation')}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入解析..."
        />
      </div>
      
      {/* 图片上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          题目图片
        </label>
        
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="题目图片预览"
              className="w-full h-48 object-contain border rounded-md"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center">
                <FaImage className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">点击上传图片</span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            
            <button
              type="button"
              className="ml-4 p-2 bg-blue-100 text-blue-600 rounded-md"
              onClick={() => {
                // 在实际应用中，这里应该调用相机API
                alert('相机功能需要在移动设备上实现');
              }}
            >
              <FaCamera className="w-6 h-6" />
            </button>
          </div>
        )}
        
        <input type="hidden" {...register('imageUrl')} />
      </div>
      
      {/* 标签选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标签
        </label>
        <TagSelector
          tags={tags}
          selectedTags={selectedTags}
          onSelectTag={handleSelectTag}
          onRemoveTag={handleRemoveTag}
          onCreateTag={onCreateTag}
        />
      </div>
      
      {/* 提交按钮 */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '提交中...' : initialData ? '更新错题' : '添加错题'}
        </button>
      </div>
    </form>
  );
};

export default MistakeForm; 