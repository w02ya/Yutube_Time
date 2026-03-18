import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface CategoryDistributionProps {
  data: { name: string; value: number }[];
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category] || '#64748b'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a0b0b', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">100%</span>
        <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">전체 시청</span>
      </div>
    </div>
  );
};

interface WeeklyWatchTimeProps {
  data: { day: string; high: number; normal: number }[];
}

function minsToLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const WeeklyWatchTime: React.FC<WeeklyWatchTimeProps> = ({ data }) => {
  const totalData = data.map(d => ({ day: d.day, 시청: d.high + d.normal }));

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={totalData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a0b0b',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => [minsToLabel(value), '시청 시간']}
          />
          <Line type="monotone" dataKey="시청" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
