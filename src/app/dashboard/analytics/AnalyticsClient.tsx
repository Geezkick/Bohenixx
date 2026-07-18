"use client";

import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, Cell
} from "recharts";
import { 
  TrendingUp, Clock, Target, AlertTriangle, ShieldCheck, Zap, Activity, BarChart3
} from "lucide-react";

// Helper for large numbers
const formatCurrency = (val: number) => {
  if (val >= 1000000) return `KES ${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `KES ${(val / 1000).toFixed(1)}k`;
  return `KES ${val}`;
};

export default function AnalyticsClient({ 
  platformRoi, 
  agentPerformance, 
  timeSeries, 
  cashFlowForecast, 
  anomalies 
}: any) {
  
  return (
    <div className="relative min-h-screen pb-20 w-full overflow-hidden bg-[#05030A]">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7B2DFF]/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00E5FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative p-6 md:p-10 max-w-[1400px] mx-auto space-y-10 z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/60 tracking-widest uppercase mb-4"
            >
              <Activity size={12} className="text-[#00E5FF]" /> Telemetry Active
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-light tracking-tight text-white mb-2"
            >
              Mission <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7B2DFF] to-[#00E5FF]">Analytics</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-base max-w-xl"
            >
              Real-time intelligence mapping autonomous operational output against projected human equivalents.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 bg-white/[0.03] border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md"
          >
            <div className="text-right">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Total Agents</p>
              <p className="text-2xl font-semibold text-white">{agentPerformance.length}</p>
            </div>
            <div className="h-10 w-[1px] bg-white/10 mx-2" />
            <div className="text-left">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Tasks Handled</p>
              <p className="text-2xl font-semibold text-[#00E5FF]">{platformRoi.completedTasks.toLocaleString()}</p>
            </div>
          </motion.div>
        </header>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl overflow-hidden hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-400/80">Net Savings</h3>
              </div>
              <p className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight">
                <span className="text-2xl text-white/40 align-top mr-1">KES</span>
                {platformRoi.netSavingsKes.toLocaleString()}
              </p>
              <p className="text-sm text-white/40">vs. estimated human labor equivalent</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl overflow-hidden hover:bg-white/[0.04] hover:border-[#00E5FF]/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#00E5FF]/10 rounded-xl border border-[#00E5FF]/20"><Clock className="w-5 h-5 text-[#00E5FF]" /></div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#00E5FF]/80">Hours Reclaimed</h3>
              </div>
              <p className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight">
                {platformRoi.totalHoursSaved.toFixed(1)} <span className="text-2xl text-white/40 font-normal">hrs</span>
              </p>
              <p className="text-sm text-white/40">Time freed for strategic execution</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl overflow-hidden hover:bg-white/[0.04] hover:border-[#7B2DFF]/30 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7B2DFF]/10 rounded-full blur-[50px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#7B2DFF]/10 rounded-xl border border-[#7B2DFF]/20"><Target className="w-5 h-5 text-[#7B2DFF]" /></div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#7B2DFF]/80">Automation Index</h3>
              </div>
              <p className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight">
                {platformRoi.automationRate.toFixed(1)}<span className="text-3xl text-[#7B2DFF] font-normal">%</span>
              </p>
              <p className="text-sm text-white/40">Of requested tasks executed autonomously</p>
            </div>
          </motion.div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ROI Trend */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-medium text-white mb-1">Value Generation Trend</h3>
                <p className="text-sm text-white/40">30-day trailing savings analysis</p>
              </div>
              <div className="p-2 bg-white/5 rounded-lg border border-white/10"><BarChart3 size={18} className="text-white/60" /></div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7B2DFF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickMargin={12} minTickGap={20} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `KES ${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="savings" stroke="#7B2DFF" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Predictive Anomalies */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-medium text-white mb-1">System Anomalies</h3>
                <p className="text-sm text-white/40">AI-driven pattern detection</p>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {anomalies.map((anomaly: any, i: number) => {
                const isHigh = anomaly.severity === 'HIGH';
                const isMedium = anomaly.severity === 'MEDIUM';
                const colorClass = isHigh ? 'text-red-400' : isMedium ? 'text-amber-400' : 'text-emerald-400';
                const bgClass = isHigh ? 'bg-red-500/5 border-red-500/20' : isMedium ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20';
                
                return (
                  <div key={i} className={`p-5 rounded-2xl border ${bgClass} transition-all duration-300 hover:bg-opacity-10`}>
                    <div className="flex items-center gap-3 mb-3">
                      {isHigh ? <AlertTriangle className={`w-4 h-4 ${colorClass}`} /> : <ShieldCheck className={`w-4 h-4 ${colorClass}`} />}
                      <span className={`font-semibold text-xs tracking-wider uppercase ${colorClass}`}>{anomaly.type.replace(/_/g, ' ')}</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-3">{anomaly.message}</p>
                    {anomaly.suggestedAction !== "None" && (
                      <div className="mt-2 pt-3 border-t border-white/5 flex items-start gap-2">
                        <Zap size={14} className="text-white/40 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-white/60">Action: {anomaly.suggestedAction}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Lower Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Agent Performance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl"
          >
            <div className="mb-8">
              <h3 className="text-xl font-medium text-white mb-1">Workforce Output</h3>
              <p className="text-sm text-white/40">Completed tasks per AI Agent</p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerformance} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#ffffff90" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#00E5FF', fontWeight: 600 }}
                  />
                  <Bar dataKey="tasksCompleted" radius={[0, 6, 6, 0]} barSize={24}>
                    {agentPerformance.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={`url(#colorBar${index})`} />
                    ))}
                  </Bar>
                  <defs>
                    {agentPerformance.map((entry: any, index: number) => (
                      <linearGradient key={`gradient-${index}`} id={`colorBar${index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7B2DFF" />
                        <stop offset="100%" stopColor="#00E5FF" />
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Cash Flow Forecast */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl"
          >
            <div className="mb-8">
              <h3 className="text-xl font-medium text-white mb-1">Revenue Forecast</h3>
              <p className="text-sm text-white/40">7-day machine learning projection</p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} 
                         tickFormatter={(tick) => {
                           const parts = tick.split('-');
                           return `${parts[1]}/${parts[2]}`;
                         }} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `K ${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#00E5FF', fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="projectedRevenueKes" stroke="#00E5FF" strokeWidth={3} dot={{ fill: '#00E5FF', r: 4, strokeWidth: 0, strokeOpacity: 0.8 }} activeDot={{ r: 6, fill: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
