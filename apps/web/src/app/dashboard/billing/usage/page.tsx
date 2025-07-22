'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Database,
  Activity,
  Calendar,
  Download,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface UsageMetrics {
  equipmentCount: number;
  calibrationCount: number;
  maintenanceCount: number;
  complianceChecks: number;
  aiChecks: number;
  storageUsed: number;
  storageLimit: number;
  apiCalls: number;
  apiLimit: number;
  teamMembers: number;
  memberLimit: number;
  reportsGenerated: number;
  reportLimit: number;
  notificationsSent: number;
  notificationLimit: number;
}

interface UsageHistory {
  date: string;
  equipmentCount: number;
  calibrationCount: number;
  maintenanceCount: number;
  complianceChecks: number;
  aiChecks: number;
  apiCalls: number;
  storageUsed: number;
}

interface UsageBreakdown {
  category: string;
  current: number;
  limit: number;
  percentage: number;
  color: string;
}

export default function UsagePage() {
  const router = useRouter();
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchUsageData();
  }, [timeRange]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/billing/usage?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }

      const data = await response.json();
      setUsageMetrics(data.metrics);
      setUsageHistory(data.history);
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setError('Failed to load usage data');
      // Fallback to mock data for development
      setUsageMetrics({
        equipmentCount: 45,
        calibrationCount: 12,
        maintenanceCount: 8,
        complianceChecks: 156,
        aiChecks: 89,
        storageUsed: 2.4,
        storageLimit: 10,
        apiCalls: 1247,
        apiLimit: 5000,
        teamMembers: 8,
        memberLimit: 10,
        reportsGenerated: 23,
        reportLimit: 50,
        notificationsSent: 156,
        notificationLimit: 1000
      });
      setUsageHistory([
        {
          date: '2024-01-01',
          equipmentCount: 42,
          calibrationCount: 10,
          maintenanceCount: 6,
          complianceChecks: 145,
          aiChecks: 78,
          apiCalls: 1156,
          storageUsed: 2.1
        },
        {
          date: '2024-01-08',
          equipmentCount: 43,
          calibrationCount: 11,
          maintenanceCount: 7,
          complianceChecks: 152,
          aiChecks: 82,
          apiCalls: 1189,
          storageUsed: 2.2
        },
        {
          date: '2024-01-15',
          equipmentCount: 44,
          calibrationCount: 12,
          maintenanceCount: 8,
          complianceChecks: 158,
          aiChecks: 85,
          apiCalls: 1212,
          storageUsed: 2.3
        },
        {
          date: '2024-01-22',
          equipmentCount: 45,
          calibrationCount: 12,
          maintenanceCount: 8,
          complianceChecks: 156,
          aiChecks: 89,
          apiCalls: 1247,
          storageUsed: 2.4
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/billing/usage/export', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download usage report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usage-report-${timeRange}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading usage report:', err);
      setError('Failed to download usage report');
    } finally {
      setDownloading(false);
    }
  };

  const getUsageBreakdown = (): UsageBreakdown[] => {
    if (!usageMetrics) return [];
    
    return [
      {
        category: 'Storage',
        current: usageMetrics.storageUsed,
        limit: usageMetrics.storageLimit,
        percentage: (usageMetrics.storageUsed / usageMetrics.storageLimit) * 100,
        color: 'bg-blue-500'
      },
      {
        category: 'API Calls',
        current: usageMetrics.apiCalls,
        limit: usageMetrics.apiLimit,
        percentage: (usageMetrics.apiCalls / usageMetrics.apiLimit) * 100,
        color: 'bg-green-500'
      },
      {
        category: 'Team Members',
        current: usageMetrics.teamMembers,
        limit: usageMetrics.memberLimit,
        percentage: (usageMetrics.teamMembers / usageMetrics.memberLimit) * 100,
        color: 'bg-purple-500'
      },
      {
        category: 'Reports',
        current: usageMetrics.reportsGenerated,
        limit: usageMetrics.reportLimit,
        percentage: (usageMetrics.reportsGenerated / usageMetrics.reportLimit) * 100,
        color: 'bg-orange-500'
      },
      {
        category: 'Notifications',
        current: usageMetrics.notificationsSent,
        limit: usageMetrics.notificationLimit,
        percentage: (usageMetrics.notificationsSent / usageMetrics.notificationLimit) * 100,
        color: 'bg-red-500'
      }
    ];
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Usage Analytics</h1>
        <p className="text-gray-600">Monitor your platform usage and resource consumption</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export Report
          </button>
        </div>
      </div>

      {usageMetrics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Equipment</p>
                  <p className="text-2xl font-bold text-gray-900">{usageMetrics.equipmentCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Calibrations</p>
                  <p className="text-2xl font-bold text-gray-900">{usageMetrics.calibrationCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">AI Checks</p>
                  <p className="text-2xl font-bold text-gray-900">{usageMetrics.aiChecks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{usageMetrics.teamMembers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Breakdown</h2>
            <div className="space-y-6">
              {getUsageBreakdown().map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className={`text-sm font-medium ${getUsageColor(item.percentage)}`}>
                      {item.current.toLocaleString()} / {item.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageBarColor(item.percentage)}`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{item.percentage.toFixed(1)}% used</span>
                    <span>{item.limit - item.current} remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maintenance Tasks</span>
                  <span className="font-medium">{usageMetrics.maintenanceCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Compliance Checks</span>
                  <span className="font-medium">{usageMetrics.complianceChecks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reports Generated</span>
                  <span className="font-medium">{usageMetrics.reportsGenerated}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Notifications Sent</span>
                  <span className="font-medium">{usageMetrics.notificationsSent}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="font-medium">{usageMetrics.storageUsed} GB / {usageMetrics.storageLimit} GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Calls</span>
                  <span className="font-medium">{usageMetrics.apiCalls.toLocaleString()} / {usageMetrics.apiLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team Members</span>
                  <span className="font-medium">{usageMetrics.teamMembers} / {usageMetrics.memberLimit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reports</span>
                  <span className="font-medium">{usageMetrics.reportsGenerated} / {usageMetrics.reportLimit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Usage History Chart */}
          {usageHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Trends</h3>
              <div className="space-y-4">
                {usageHistory.map((entry, index) => (
                  <div key={entry.date} className="flex items-center space-x-4">
                    <div className="w-24 text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{entry.equipmentCount}</div>
                        <div className="text-xs text-gray-500">Equipment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{entry.calibrationCount}</div>
                        <div className="text-xs text-gray-500">Calibrations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{entry.complianceChecks}</div>
                        <div className="text-xs text-gray-500">Checks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{entry.apiCalls}</div>
                        <div className="text-xs text-gray-500">API Calls</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 