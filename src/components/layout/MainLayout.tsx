import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaPlus, FaBook, FaChartBar } from 'react-icons/fa';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: '首页', icon: <FaHome className="w-5 h-5" /> },
    { href: '/add', label: '添加错题', icon: <FaPlus className="w-5 h-5" /> },
    { href: '/review', label: '复习', icon: <FaBook className="w-5 h-5" /> },
    { href: '/stats', label: '统计', icon: <FaChartBar className="w-5 h-5" /> },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">错题管理系统</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <nav className="bg-white shadow-lg border-t">
        <div className="container mx-auto">
          <ul className="flex justify-around">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center py-3 px-4 ${
                    pathname === item.href
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {item.icon}
                  <span className="mt-1 text-xs">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout; 