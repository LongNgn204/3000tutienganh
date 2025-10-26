import React from 'react';
import type { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, activeCategory, onCategoryClick }) => {
  return (
    <aside className="w-full lg:sticky lg:top-24 self-start">
      <h2 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">Chủ đề</h2>
      <nav>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href={`#${category.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryClick(category.id);
                }}
                className={`block px-4 py-2 my-1 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;