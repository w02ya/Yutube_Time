import React from 'react';
import { Clock, Zap, BarChart3, Moon, Bell } from 'lucide-react';
import StatCard from './StatCard';
import { CategoryDistribution, WeeklyWatchTime } from './Charts';
import HistoryTable from './HistoryTable';
import { MOCK_HISTORY, computeSummary } from '../constants';
import { VideoRecord } from '../types';

interface DashboardProps {
  onUploadClick: () => void;
  history?: VideoRecord[];
}

// 단위: 분(minutes), 평균 ~2h 32m
const WEEKEND_HEAVY_WEEKLY: { day: string; high: number; normal: number }[] = [
  { day: '월', high: 110, normal: 0 },
  { day: '화', high: 90,  normal: 0 },
  { day: '수', high: 110, normal: 0 },
  { day: '목', high: 90,  normal: 0 },
  { day: '금', high: 160, normal: 0 },
  { day: '토', high: 270, normal: 0 },
  { day: '일', high: 250, normal: 0 },
];

const Dashboard: React.FC<DashboardProps> = ({ onUploadClick, history }) => {
  const records = history && history.length > 0 ? history : MOCK_HISTORY;
  const summary = {
    ...computeSummary(records),
    todayWatchTime: '2시간 32분',
    shortsRatio: 28,
    weeklyData: WEEKEND_HEAVY_WEEKLY,
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
          title="하루 평균 시청"
          value={summary.todayWatchTime}
          subValue={
            summary.shortsRatio !== undefined && summary.shortsRatio > 0
              ? `Shorts ${summary.shortsRatio}% · 총 ${records.length}개 영상`
              : `총 ${records.length}개 영상 분석`
          }
          icon={Clock}
          color="red"
        />
        <StatCard
          title="생산성 점수"
          value={`${summary.productivityScore}/100`}
          subValue={summary.productivityScore >= 70 ? '우수한 시청 패턴' : summary.productivityScore >= 50 ? '보통 수준' : '주의: 도파민 과다 노출'}
          icon={Zap}
          color="purple"
        />
        <StatCard
          title="최다 시청 카테고리"
          value={summary.topCategory}
          subValue={summary.categoryDistribution[0] ? `전체 시청의 ${summary.categoryDistribution[0].value}%` : ''}
          icon={BarChart3}
          color="red"
        />
        <StatCard
          title="피크 타임"
          value={summary.peakTime}
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
          </div>
          <WeeklyWatchTime data={summary.weeklyData} />
        </div>
      </div>

      <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-white">최근 시청 기록</h3>
          <button className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest">모두 보기</button>
        </div>
        <HistoryTable records={records.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;
