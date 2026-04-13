import React from 'react';
import type { Category, TransactionType } from '../types';

const CATEGORY_ICONS: Record<Category, string> = {
  'Maaş':        '💼',
  'Freelance':   '💻',
  'Yatırım':     '📈',
  'Diğer Gelir': '💰',
  'Kira':        '🏠',
  'Market':      '🛒',
  'Ulaşım':      '🚗',
  'Sağlık':      '💊',
  'Eğlence':     '🎭',
  'Faturalar':   '📄',
  'Yemek':       '🍽️',
  'Diğer Gider': '📦',
};

interface CategoryBadgeProps {
  category: Category;
  type: TransactionType;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, type }) => {
  const icon = CATEGORY_ICONS[category] ?? '•';
  const bg = type === 'income' ? 'rgba(0,229,160,0.08)' : 'rgba(255,77,109,0.08)';
  const border = type === 'income' ? 'rgba(0,229,160,0.18)' : 'rgba(255,77,109,0.18)';

  return (
    <div style={{
      width: '40px', height: '40px', borderRadius: '12px',
      background: bg, border: `1px solid ${border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '17px', flexShrink: 0,
    }}>
      {icon}
    </div>
  );
};

export default CategoryBadge;
