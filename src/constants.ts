import { Category } from './types';

export const CATEGORIES: Category[] = [
  '지식/정보',
  '교육/학습',
  '자기계발',
  '예능/오락',
  '게임',
  '음악',
  '기타'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  '지식/정보': '#10b981', // emerald-500
  '교육/학습': '#3b82f6', // blue-500
  '자기계발': '#a855f7', // purple-500
  '예능/오락': '#ef4444', // red-500
  '게임': '#f59e0b', // amber-500
  '음악': '#ec4899', // pink-500
  '기타': '#64748b'  // slate-500
};

export const MOCK_HISTORY: any[] = [
  {
    id: '1',
    title: '경제 트렌드 따라잡기 2024',
    channel: '슈카월드',
    category: '지식/정보',
    score: 85,
    timestamp: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    title: '10분 만에 배우는 파이썬 기초',
    channel: '코딩도조',
    category: '교육/학습',
    score: 92,
    timestamp: '2024-03-10T11:30:00Z'
  },
  {
    id: '3',
    title: '무한도전 레전드 정주행 (박명수 특집)',
    channel: 'MBC 오분순삭',
    category: '예능/오락',
    score: 12,
    timestamp: '2024-03-10T14:00:00Z'
  },
  {
    id: '4',
    title: '하루 15분, 미라클 모닝 루틴',
    channel: '동기부여 연구소',
    category: '자기계발',
    score: 78,
    timestamp: '2024-03-10T16:20:00Z'
  }
];
