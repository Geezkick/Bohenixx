"use client";

import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Clock, Target, AlertTriangle, ShieldCheck, Zap
} from "lucide-react";

export default function AnalyticsClient({ 
  platformRoi, 
  agentPerformance, 
  timeSeries, 
  cashFlowForecast, 
  anomalies 
}: any) {
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="mb-10">
        <h1 className="text-4xl font-light tracking-tight mb-2">Executive Analytics</h1>
        <p className="text-white/50 text-sm">Real-time ROI and Predictive Intelligence</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-4 text-emerald-400">
            <div className="p-2 bg-emerald-400/10 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/50">Net Savings (KES)</h3>
          </div>
          <p className="text-4xl font-light">{platformRoi.netSavingsKes.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-2">vs. traditional human labor cost</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-4 text-blue-400">
            <div className="p-2 bg-blue-400/10 rounded-lg"><Clock className="w-5 h-5" /></div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/50">Hours Saved</h3>
          </div>
          <p className="text-4xl font-light">{platformRoi.totalHoursSaved.toFixed(1)}</p>
          <p className="text-xs text-white/40 mt-2">Time repurposed for high-value work</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-4 text-purple-400">
            <div className="p-2 bg-purple-400/10 rounded-lg"><Zap className="w-5 h-5" /></div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/50">Automation Rate</h3>
          </div>
          <p className="text-4xl font-light">{platformRoi.automationRate.toFixed(1)}%</p>
          <p className="text-xs text-white/40 mt-2">{platformRoi.completedTasks} tasks handled autonomously</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-light mb-6">ROI Trend (Last 30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="savings" stroke="#10B981" fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Anomalies Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col"
        >
          <h3 className="text-lg font-light mb-6">Predictive Anomalies</h3>
          <div className="flex-1 space-y-4">
            {anomalies.map((anomaly: any, i: number) => (
              <div key={i} className={`p-4 rounded-xl border ${
                anomaly.severity === 'HIGH' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                anomaly.severity === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {anomaly.severity === 'LOW' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span className="font-semibold text-sm">{anomaly.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-sm opacity-80 mb-2">{anomaly.message}</p>
                {anomaly.suggestedAction !== "None" && (
                  <p className="text-xs opacity-60">→ Action: {anomaly.suggestedAction}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-light mb-6">Agent Performance</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformance} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#ffffff90" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '8px' }}
                />
                <Bar dataKey="tasksCompleted" fill="#7B2DFF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cash Flow Forecast */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-light mb-6">Cash Flow Projection (Next 7 Days)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} 
                       tickFormatter={(tick) => tick.substring(5)} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="projectedRevenueKes" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
