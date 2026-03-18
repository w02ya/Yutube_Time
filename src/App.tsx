import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import HistoryTable from './components/HistoryTable';
import Landing from './components/Landing';
import { analyzeVideos, analyzeDashboard } from './services/gemini';
import { extractVideoId, fetchVideoDurations } from './services/youtube';
import { computeSummary } from './constants';
import ReactMarkdown from 'react-markdown';
import { VideoRecord } from './types';
import { BrainCircuit, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [history, setHistory] = useState<VideoRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const handleUpload = async (data: any[]) => {
    setIsAnalyzing(true);
    try {
      // Google Takeout 형식 포함 다양한 JSON 구조 지원
      const sourceItems = data
        .filter(item => item.title || item.snippet?.title)
        .slice(0, 50);

      if (sourceItems.length === 0) {
        alert('유효한 영상 데이터를 찾을 수 없습니다. JSON 형식을 확인해주세요.');
        return;
      }

      const videosToAnalyze = sourceItems.map(item => {
        const rawTitle = item.title || item.snippet?.title || 'Unknown Title';
        const title = rawTitle.replace(/^Watched\s+/i, '').replace(/^시청함:\s+/, '');
        const channel =
          item.subtitles?.[0]?.name ||
          item.channelTitle ||
          item.snippet?.channelTitle ||
          'Unknown Channel';
        return { title, channel };
      });

      const results = await analyzeVideos(videosToAnalyze);

      if (results.length === 0) {
        alert('분석 결과가 없습니다. GEMINI_API_KEY가 .env 파일에 설정되어 있는지 확인해주세요.');
        return;
      }

      // Fetch video durations from YouTube Data API v3
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const videoItems = sourceItems
        .map((item, index) => ({
          videoId: extractVideoId(item.titleUrl || ''),
          index,
        }))
        .filter((v): v is { videoId: string; index: number } => v.videoId !== null);

      const durationMap = await fetchVideoDurations(videoItems, apiKey);

      const newRecords: VideoRecord[] = results.map((res, index) => {
        const durInfo = durationMap.get(index);
        return {
          id: Math.random().toString(36).substr(2, 9),
          title: res.title || videosToAnalyze[index]?.title || 'Unknown',
          channel: res.channel || videosToAnalyze[index]?.channel || 'Unknown',
          category: (res.category as any) || '기타',
          score: res.score || 0,
          // sourceItems[index]로 올바른 타임스탬프 매핑
          timestamp: sourceItems[index]?.time || sourceItems[index]?.timestamp || new Date().toISOString(),
          duration: durInfo?.duration,
          isShorts: durInfo?.isShorts,
        };
      });

      setHistory(newRecords);
      setShowLanding(false);
      setActiveTab('dashboard');
    } catch (error: any) {
      console.error("Analysis failed", error);
      alert(`분석 오류: ${error?.message || String(error)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onUploadClick={() => setActiveTab('ai-analysis')} history={history} />;
      case 'ai-analysis':
        return (
          <div className="flex-1 bg-[#140808] p-8 overflow-y-auto">
            <header className="mb-10">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <BrainCircuit className="text-red-500" />
                AI 분석
              </h2>
              <p className="text-zinc-500 mt-2">Gemini가 내 대시보드를 분석하고 인사이트를 제공합니다.</p>
            </header>
            {history.length === 0 ? (
              <div className="max-w-4xl mx-auto mt-12">
                <FileUpload onUpload={handleUpload} isLoading={isAnalyzing} />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                {!aiInsight && !isLoadingInsight && (
                  <div className="flex flex-col items-center gap-6 mt-16">
                    <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center">
                      <BrainCircuit size={40} className="text-red-500" />
                    </div>
                    <p className="text-zinc-400 text-center">Gemini가 내 시청 패턴을 분석하고 맞춤 조언을 드립니다.</p>
                    <button
                      onClick={async () => {
                        setIsLoadingInsight(true);
                        try {
                          const summary = { ...computeSummary(history), todayWatchTime: '2시간 32분', shortsRatio: 28 };
                          const result = await analyzeDashboard(summary as any, history.length);
                          setAiInsight(result);
                        } catch (e: any) {
                          setAiInsight(`분석 오류: ${e?.message || String(e)}`);
                        } finally {
                          setIsLoadingInsight(false);
                        }
                      }}
                      className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-500 transition-colors"
                    >
                      분석 시작
                    </button>
                  </div>
                )}
                {isLoadingInsight && (
                  <div className="flex flex-col items-center gap-4 mt-24">
                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400">Gemini가 분석 중입니다...</p>
                  </div>
                )}
                {aiInsight && (
                  <div className="bg-[#241212] border border-white/5 rounded-3xl p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Gemini 분석 결과</h3>
                      <button
                        onClick={() => setAiInsight(null)}
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                      >
                        다시 분석
                      </button>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed">
                      <ReactMarkdown>{aiInsight}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
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

  if (showLanding) {
    return (
      <AnimatePresence>
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <Landing
            onStart={() => setShowLanding(false)}
            onUpload={handleUpload}
            isAnalyzing={isAnalyzing}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

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
