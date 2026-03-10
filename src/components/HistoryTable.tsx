import React from 'react';
import { VideoRecord } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { clsx } from 'clsx';

interface HistoryTableProps {
  records: VideoRecord[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            <th className="py-4 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-widest">영상 제목</th>
            <th className="py-4 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-widest">채널명</th>
            <th className="py-4 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-widest">카테고리</th>
            <th className="py-4 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-widest text-right">생산성 점수</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {records.map((record) => (
            <tr key={record.id} className="group hover:bg-white/[0.02] transition-colors">
              <td className="py-4 px-4">
                <p className="text-sm font-medium text-white line-clamp-1">{record.title}</p>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-zinc-400">{record.channel}</p>
              </td>
              <td className="py-4 px-4">
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ 
                    backgroundColor: `${CATEGORY_COLORS[record.category]}20`, 
                    color: CATEGORY_COLORS[record.category] 
                  }}
                >
                  {record.category}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className={clsx(
                  "text-sm font-bold",
                  record.score >= 80 ? "text-emerald-500" : 
                  record.score >= 50 ? "text-amber-500" : "text-red-500"
                )}>
                  {record.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
