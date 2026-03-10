import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import HistoryTable from './components/HistoryTable';
import { analyzeVideos } from './services/gemini';
import { VideoRecord } from './types';
import { MOCK_HISTORY } from './constants';
import { BrainCircuit, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [history, setHistory] = useState<VideoRecord[]>(MOCK_HISTORY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (data: any[]) => {
    setIsAnalyzing(true);
    try {
      // Limit to 10 for demo/performance
      const videosToAnalyze = data.slice(0, 10).map(item => ({
        title: item.title || item.snippet?.title || 'Unknown Title',
        channel: item.channelTitle || item.snippet?.channelTitle || 'Unknown Channel'
      }));

      const results = await analyzeVideos(videosToAnalyze);
      
      const newRecords: VideoRecord[] = results.map((res, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: res.title || 'Unknown',
        channel: res.channel || 'Unknown',
        category: (res.category as any) || '기타',
        score: res.score || 0,
        timestamp: new Date().toISOString()
      }));

      setHistory(prev => [...newRecords, ...prev]);
      setActiveTab('history');
    } catch (error) {
      console.error("Analysis failed", error);
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onUploadClick={() => setActiveTab('ai-analysis')} />;
      case 'ai-analysis':
        return (
          <div className="flex-1 bg-[#140808] p-8 overflow-y-auto">
            <header className="mb-10">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <BrainCircuit className="text-red-500" />
                AI 분석
              </h2>
              <p className="text-zinc-500 mt-2">유튜브 시청 데이터를 업로드하여 생산성 리포트를 생성하세요.</p>
            </header>
            <div className="max-w-4xl mx-auto mt-12">
              <FileUpload onUpload={handleUpload} isLoading={isAnalyzing} />
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="flex-1 bg-[#140808] p-8 overflow-y-auto">
            <header className="mb-10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  <HistoryIcon className="text-red-500" />
                  시청 기록
                </h2>
                <p className="text-zinc-500 mt-2">지금까지 분석된 모든 시청 기록입니다.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-sm font-bold hover:bg-white/10 transition-colors">
                  필터링
                </button>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-sm font-bold hover:bg-white/10 transition-colors">
                  내보내기
                </button>
              </div>
            </header>
            <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
              <HistoryTable records={history} />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-[#140808] p-8 overflow-y-auto">
            <header className="mb-10">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <SettingsIcon className="text-red-500" />
                설정
              </h2>
              <p className="text-zinc-500 mt-2">계정 및 애플리케이션 설정을 관리하세요.</p>
            </header>
            <div className="max-w-2xl space-y-6">
              <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-white mb-6">프로필 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">사용자 이름</label>
                    <input type="text" defaultValue="김튜브" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">이메일</label>
                    <input type="email" defaultValue="tube@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-white mb-6">알림 설정</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">주간 리포트 알림</p>
                      <p className="text-xs text-zinc-500">매주 월요일 오전 생산성 리포트를 받아봅니다.</p>
                    </div>
                    <div className="w-12 h-6 bg-red-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#140808] font-sans selection:bg-red-500/30 selection:text-red-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
