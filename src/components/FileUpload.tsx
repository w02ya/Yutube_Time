import React, { useRef } from 'react';
import { Upload, FileJson } from 'lucide-react';
import { motion } from 'motion/react';

interface FileUploadProps {
  onUpload: (data: any[]) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Handle both direct array and wrapped array
        const data = Array.isArray(json) ? json : json.history || [];
        onUpload(data);
      } catch (error) {
        alert('올바른 JSON 형식이 아닙니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-all group cursor-pointer"
         onClick={() => fileInputRef.current?.click()}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />
      
      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
        <Upload size={32} />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">JSON 데이터 업로드</h3>
      <p className="text-zinc-500 text-sm text-center max-w-xs mb-8">
        유튜브 시청 기록 JSON 파일을 업로드하여 AI 분석을 시작하세요.
      </p>
      
      <div className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-zinc-300 text-sm font-medium group-hover:bg-white/10 transition-colors">
        <FileJson size={18} />
        파일 선택하기
      </div>

      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center gap-3 text-red-500"
        >
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold">AI 분석 중...</span>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
