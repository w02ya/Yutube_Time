import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, BarChart3, Clock, Play, Upload } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
  onUpload: (data: any[]) => void;
  isAnalyzing: boolean;
}

const features = [
  {
    icon: BrainCircuit,
    title: 'AI 카테고리 분석',
    desc: 'Gemini AI가 시청 영상을 자동으로 분류하고 생산성 점수를 계산해줍니다.',
  },
  {
    icon: BarChart3,
    title: '시청 패턴 시각화',
    desc: '요일별, 카테고리별 시청 데이터를 한눈에 파악할 수 있는 대시보드를 제공합니다.',
  },
  {
    icon: Clock,
    title: '시간 낭비 알림',
    desc: '도파민 유발 콘텐츠 소비 패턴을 감지하고 생활 습관 개선을 도와줍니다.',
  },
];

const Landing: React.FC<LandingProps> = ({ onStart, onUpload, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const data = Array.isArray(json) ? json : json.history || [];
        onUpload(data);
      } catch {
        alert('올바른 JSON 형식이 아닙니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#0e0505] flex flex-col items-center justify-center px-6 overflow-hidden relative">

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-14"
      >
        <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-red-600 ml-0.5" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TubeDiet</h1>
          <p className="text-[10px] text-red-500 font-medium uppercase tracking-widest">튜브다이어트</p>
        </div>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center max-w-2xl mb-6"
      >
        <h2 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
          유튜브, 정말<br />
          <span className="text-red-500">똑똑하게</span> 보고 있나요?
        </h2>
        <p className="text-zinc-400 text-lg leading-relaxed">
          내 유튜브 시청 기록을 AI로 분석해<br />
          시간 낭비 패턴을 발견하고 생산적인 습관을 만들어보세요.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center gap-4 mb-20"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        <button
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="group flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-base shadow-xl shadow-red-600/25 hover:bg-red-500 transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI 분석 중...
            </>
          ) : (
            <>
              <Upload size={18} />
              내 시청 기록 업로드
            </>
          )}
        </button>
        <p className="text-xs text-zinc-600">유튜브 시청 기록 JSON 파일을 업로드하세요</p>
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-zinc-400 rounded-2xl font-medium text-sm hover:bg-white/10 transition-colors"
        >
          <Play size={14} className="text-red-500" />
          데모 데이터로 먼저 보기
        </button>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
            className="bg-[#1a0b0b] border border-white/5 rounded-2xl p-6 hover:border-red-900/40 transition-colors"
          >
            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center mb-4">
              <f.icon size={20} className="text-red-500" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-8 text-xs text-zinc-700"
      >
        Powered by Gemini AI
      </motion.p>
    </div>
  );
};

export default Landing;
