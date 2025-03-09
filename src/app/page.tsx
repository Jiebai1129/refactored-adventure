'use client';

import React from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import MainLayout from '@/components/layout/MainLayout';
import MistakeList from '@/components/mistake/MistakeList';

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">我的错题本</h1>
          <Link
            href="/add"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaPlus className="mr-2" />
            添加错题
          </Link>
        </div>
        
        <MistakeList />
      </div>
    </MainLayout>
  );
}
