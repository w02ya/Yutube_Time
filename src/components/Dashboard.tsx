import React from 'react';
import { Clock, Zap, BarChart3, Moon, Bell } from 'lucide-react';
import StatCard from './StatCard';
import { CategoryDistribution, WeeklyWatchTime } from './Charts';
import HistoryTable from './HistoryTable';
import { MOCK_HISTORY, CATEGORY_COLORS } from '../constants';
import { AnalysisSummary } from '../types';

interface DashboardProps {
  onUploadClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onUploadClick }) => {
  const summary: AnalysisSummary = {
    todayWatchTime: '2시간 35분',
    productivityScore: 42,
    topCategory: '예능/오락',
    peakTime: '밤 10시',
    categoryDistribution: [
      { name: '예능/오락', value: 50, color: CATEGORY_COLORS['예능/오락'] },
      { name: '교육/학습', value: 30, color: CATEGORY_COLORS['교육/학습'] },
      { name: '기타', value: 20, color: CATEGORY_COLORS['기타'] },
    ],
    weeklyData: [
      { day: '월', high: 40, normal: 60 },
      { day: '화', high: 30, normal: 70 },
      { day: '수', high: 50, normal: 50 },
      { day: '목', high: 20, normal: 80 },
      { day: '금', high: 60, normal: 40 },
      { day: '토', high: 10, normal: 90 },
      { day: '일', high: 15, normal: 85 },
    ]
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#140808] p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">대시보드 요약</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onUploadClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-500 transition-colors"
          >
            <Zap size={16} />
            JSON 데이터 업로드
          </button>
          <button className="p-2.5 bg-white/5 text-zinc-400 rounded-xl hover:text-white transition-colors border border-white/5">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="오늘 시청 시간" 
          value={summary.todayWatchTime} 
          icon={Clock} 
          color="red" 
          trend="어제보다 15% 증가" 
        />
        <StatCard 
          title="생산성 점수" 
          value={`${summary.productivityScore}/100`} 
          subValue="주의: 도파민 과다 노출"
          icon={Zap} 
          color="purple" 
        />
        <StatCard 
          title="최다 시청 카테고리" 
          value="예능" 
          subValue="전체 시청의 50%"
          icon={BarChart3} 
          color="red" 
        />
        <StatCard 
          title="피크 타임" 
          value={summary.peakTime} 
          subValue="취침 전 집중 시청"
          icon={Moon} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-8">카테고리 비율</h3>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <CategoryDistribution data={summary.categoryDistribution} />
            <div className="flex-1 space-y-4 w-full">
              {summary.categoryDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">요일별 시청 시간</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Normal</span>
              </div>
            </div>
          </div>
          <WeeklyWatchTime data={summary.weeklyData} />
        </div>
      </div>

      <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-white">최근 시청 기록</h3>
          <button className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest">모두 보기</button>
        </div>
        <HistoryTable records={MOCK_HISTORY} />
      </div>
    </div>
  );
};

export default Dashboard;
