import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, icon: Icon, color, trend }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#241212] border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl bg-${color}-500/10 text-${color}-500`}>
          <Icon size={20} />
        </div>
      </div>
      
      {subValue && (
        <p className="text-xs text-zinc-500 mt-2 font-medium">
          {subValue}
        </p>
      )}

      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          <TrendingUp size={14} className="text-red-500" />
          <span className="text-[11px] font-medium text-red-500">{trend}</span>
        </div>
      )}

      {/* Subtle background glow */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}-500/5 blur-3xl rounded-full group-hover:bg-${color}-500/10 transition-all duration-500`} />
    </motion.div>
  );
};

export default StatCard;
