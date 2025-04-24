/**
 * ChannelStatistics Component
 * 
 * Displays detailed statistics for a channel including views, subscribers,
 * engagement metrics, and performance trends.
 */
import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  ThumbsUp, 
  Eye, 
  Activity 
} from 'lucide-react';

/**
 * StatCard - Displays a single statistic with icon and trend indicator
 */
const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
  <div className="bg-base-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-base-content/70">{title}</h3>
      <div className={`p-2 rounded-full bg-${color}/10`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-base-content">{value}</p>
    <div className="mt-1 flex items-center">
      <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </span>
      <span className="text-xs text-base-content/60 ml-1">vs last period</span>
    </div>
  </div>
);

/**
 * ChannelStatistics - Main component that displays overall channel performance data
 */
export default function ChannelStatistics() {
  // Sample statistics data - would be replaced with actual data from API/props
  const stats = [
    {
      title: "Total Views",
      value: "348,921",
      icon: <Eye size={18} className="text-info" />,
      trend: "up",
      trendValue: "12.5%",
      color: "info"
    },
    {
      title: "Subscribers",
      value: "24,827",
      icon: <Users size={18} className="text-success" />,
      trend: "up",
      trendValue: "3.2%",
      color: "success"
    },
    {
      title: "Avg. Watch Time",
      value: "8m 42s",
      icon: <Clock size={18} className="text-warning" />,
      trend: "up",
      trendValue: "1.8%",
      color: "warning"
    },
    {
      title: "Engagement",
      value: "18.3%",
      icon: <ThumbsUp size={18} className="text-secondary" />,
      trend: "down",
      trendValue: "0.5%",
      color: "secondary"
    },
    {
      title: "Growth Rate",
      value: "+4.7%",
      icon: <TrendingUp size={18} className="text-accent" />,
      trend: "up",
      trendValue: "0.8%",
      color: "accent"
    },
    {
      title: "Impressions",
      value: "1.2M",
      icon: <Activity size={18} className="text-primary" />,
      trend: "up",
      trendValue: "9.3%",
      color: "primary"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <BarChart3 size={24} className="text-secondary" />
          <h2 className="text-2xl font-bold text-secondary">Channel Statistics</h2>
        </div>
        <div className="flex gap-2">
          <select className="select select-sm select-bordered">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button className="btn btn-sm btn-outline btn-secondary">
            Export
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={stat.color}
          />
        ))}
      </div>

      {/* Placeholder for detailed statistics */}
      <div className="mt-8 bg-base-200 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-base-content">Performance Trends</h3>
        </div>
        <p className="text-base-content/70">Detailed performance analytics and charts will be displayed here.</p>
        <div className="h-48 mt-4 bg-base-300/50 rounded flex items-center justify-center">
          <span className="text-base-content/50">Chart visualization area</span>
        </div>
      </div>
    </div>
  );
}