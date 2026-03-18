import { Category, VideoRecord, AnalysisSummary } from './types';

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

export function computeSummary(records: VideoRecord[]): AnalysisSummary {
  if (records.length === 0) {
    return {
      todayWatchTime: '0개 영상',
      productivityScore: 0,
      topCategory: '기타',
      peakTime: '-',
      categoryDistribution: [],
      weeklyData: ['월', '화', '수', '목', '금', '토', '일'].map(day => ({ day, high: 0, normal: 0 })),
    };
  }

  const avgScore = Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length);

  const uniqueDays = new Set(records.map(r => new Date(r.timestamp).toLocaleDateString())).size;

  // 실제 영상 시간(초) 합산 → 하루 평균 시청 시간 계산
  const recordsWithDuration = records.filter(r => typeof r.duration === 'number');
  const hasDurationData = recordsWithDuration.length > 0;

  let todayWatchTime: string;
  if (hasDurationData) {
    const totalSeconds = recordsWithDuration.reduce((sum, r) => sum + (r.duration ?? 0), 0);
    const avgSecondsPerDay = uniqueDays > 0 ? totalSeconds / uniqueDays : totalSeconds;
    const avgMinutes = Math.round(avgSecondsPerDay / 60);
    const h = Math.floor(avgMinutes / 60);
    const m = avgMinutes % 60;
    todayWatchTime = h > 0 ? `하루 평균 ${h}h ${m}m` : `하루 평균 ${m}m`;
  } else {
    // 영상 시간 데이터 없을 때 기존 방식(개수)으로 대체
    const avgPerDay = uniqueDays > 0 ? (records.length / uniqueDays).toFixed(1) : records.length;
    todayWatchTime = `하루 평균 ${avgPerDay}개`;
  }

  // Shorts 비율 계산
  const shortsCount = records.filter(r => r.isShorts === true).length;
  const shortsRatio = records.length > 0 ? Math.round((shortsCount / records.length) * 100) : 0;

  const catCount: Partial<Record<Category, number>> = {};
  records.forEach(r => { catCount[r.category] = (catCount[r.category] || 0) + 1; });
  const topCategory = (Object.entries(catCount).sort((a, b) => b[1] - a[1])[0][0]) as Category;

  const hourCount: Record<number, number> = {};
  records.forEach(r => {
    const hour = new Date(r.timestamp).getHours();
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  });
  const sortedHours = Object.entries(hourCount).sort((a, b) => b[1] - a[1]);
  console.log("📊 시간대별 시청 분포 (로컬 시간):", sortedHours.slice(0, 5).map(([h, c]) => `${h}시 ${c}회`).join(", "));
  const peakHour = parseInt(sortedHours[0]?.[0] ?? '0');
  const peakTime = `${peakHour < 12 ? '오전' : '오후'} ${peakHour % 12 || 12}시`;

  const total = records.length;
  const categoryDistribution = (Object.entries(catCount) as [Category, number][])
    .map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
      color: CATEGORY_COLORS[name],
    }))
    .sort((a, b) => b.value - a.value);

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const weeklyMap: Record<string, { high: number; normal: number }> = {};
  ['월', '화', '수', '목', '금', '토', '일'].forEach(d => { weeklyMap[d] = { high: 0, normal: 0 }; });
  records.forEach(r => {
    const day = days[new Date(r.timestamp).getDay()];
    if (r.score >= 70) weeklyMap[day].high++;
    else weeklyMap[day].normal++;
  });
  const weeklyData = ['월', '화', '수', '목', '금', '토', '일'].map(day => ({ day, ...weeklyMap[day] }));

  return {
    todayWatchTime,
    productivityScore: avgScore,
    topCategory,
    peakTime,
    categoryDistribution,
    weeklyData,
    shortsRatio,
  };
}

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
