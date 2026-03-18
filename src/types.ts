export type Category = 
  | '지식/정보'
  | '교육/학습'
  | '자기계발'
  | '예능/오락'
  | '게임'
  | '음악'
  | '기타';

export interface VideoRecord {
  id: string;
  title: string;
  channel: string;
  category: Category;
  score: number;
  timestamp: string;
  duration?: number;  // seconds
  isShorts?: boolean;
}

export interface AnalysisSummary {
  todayWatchTime: string;
  productivityScore: number;
  topCategory: Category;
  peakTime: string;
  categoryDistribution: { name: string; value: number; color: string }[];
  weeklyData: { day: string; high: number; normal: number }[];
  shortsRatio?: number;
}
