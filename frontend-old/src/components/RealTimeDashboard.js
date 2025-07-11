import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const RealTimeDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [userSegments, setUserSegments] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    if (!user || !user.is_admin) {
      return;
    }

    // Connect to WebSocket
    const wsUrl = BACKEND_URL.replace('http', 'ws') + '/ws/dashboard';
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setConnectionStatus('connected');
      console.log('Dashboard WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'metrics_update' || data.type === 'initial_metrics') {
          setMetrics(data.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('Dashboard WebSocket disconnected');
    };

    wsRef.current.onerror = (error) => {
      setConnectionStatus('error');
      console.error('WebSocket error:', error);
    };

    // Fetch user segments
    fetchUserSegments();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  const fetchUserSegments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/analytics/segments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const segments = await response.json();
        setUserSegments(segments);
      }
    } catch (error) {
      console.error('Error fetching user segments:', error);
    }
  };

  const trainSegmentationModel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/analytics/train-segmentation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const results = await response.json();
        alert(`Model trained successfully!\nUsers: ${results.num_users}\nFeatures: ${results.num_features}\nClusters: ${results.num_clusters}`);
        fetchUserSegments();
      } else {
        alert('Failed to train model');
      }
    } catch (error) {
      console.error('Error training model:', error);
      alert('Error training model');
    }
  };

  if (!user || !user.is_admin) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <i className="bx bx-bar-chart-alt-2 mr-2"></i>
              Real-Time Analytics Dashboard
            </h2>
            <p className="text-gray-600">Monitorea métricas en tiempo real y rendimiento del sistema</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : connectionStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span>{connectionStatus}</span>
            </div>
            <button
              onClick={trainSegmentationModel}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <i className="bx bx-brain mr-2"></i>
              Train ML Model
            </button>
          </div>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={metrics.active_users || 0}
          icon="bx-group"
          color="blue"
          subtitle="Currently online"
        />
        <MetricCard
          title="Bookings/Hour"
          value={metrics.event_booking_hourly || 0}
          icon="bx-calendar-check"
          color="green"
          subtitle="Last hour"
        />
        <MetricCard
          title="Page Views/Hour"
          value={metrics.page_view_hourly || 0}
          icon="bx-trending-up"
          color="purple"
          subtitle="Last hour"
        />
        <MetricCard
          title="Check-ins/Hour"
          value={metrics.event_checkin_hourly || 0}
          icon="bx-check-circle"
          color="orange"
          subtitle="Last hour"
        />
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">API Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.performance && Object.entries(metrics.performance).map(([key, value]) => {
            if (key.includes('_avg_response')) {
              const endpoint = key.replace('_avg_response', '');
              const successRate = metrics.performance[`${endpoint}_success_rate`] || 100;
              
              return (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2 capitalize">{endpoint}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Response:</span>
                      <span className={`text-sm font-medium ${
                        value > 1 ? 'text-red-600' : value > 0.5 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {value}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate:</span>
                      <span className={`text-sm font-medium ${
                        successRate < 95 ? 'text-red-600' : successRate < 99 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {successRate}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* System Metrics */}
      {metrics.system && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SystemMetricCard
              title="CPU Usage"
              value={metrics.system.cpu_percent}
              unit="%"
              threshold={80}
            />
            <SystemMetricCard
              title="Memory Usage"
              value={metrics.system.memory_percent}
              unit="%"
              threshold={85}
            />
            <SystemMetricCard
              title="Disk Usage"
              value={metrics.system.disk_percent}
              unit="%"
              threshold={90}
            />
          </div>
        </div>
      )}

      {/* User Segments */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">User Segments</h2>
          <button
            onClick={fetchUserSegments}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(userSegments).map(([segmentName, data]) => (
            <div key={segmentName} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">{segmentName}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium">{data.user_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentage:</span>
                  <span className="font-medium">{data.percentage?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Reservations:</span>
                  <span className="font-medium">{data.avg_reservations?.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in Rate:</span>
                  <span className="font-medium">{(data.avg_checkin_rate * 100)?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-500 text-xs">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center text-white text-2xl`}>
          <i className={`bx ${icon}`}></i>
        </div>
      </div>
    </div>
  );
};

const SystemMetricCard = ({ title, value, unit, threshold }) => {
  const isHigh = value > threshold;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isHigh ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${isHigh ? 'text-red-600' : 'text-green-600'}`}>
          {value?.toFixed(1)}{unit}
        </span>
      </div>
    </div>
  );
};

export default RealTimeDashboard; 