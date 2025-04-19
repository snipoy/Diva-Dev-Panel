import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import ContainerList from '../components/ContainerList';
import SystemMetrics from '../components/SystemMetrics';
import RestartLogs from '../components/RestartLogs';

export default function Dashboard() {
  const [containers, setContainers] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [restartLogs, setRestartLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [containersRes, metricsRes, logsRes] = await Promise.all([
        axios.get('/api/containers'),
        axios.get('/api/system'),
        axios.get('/api/logs')
      ]);

      setContainers(containersRes.data);
      setSystemMetrics(metricsRes.data);
      setRestartLogs(logsRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = async (containerId) => {
    try {
      await axios.post(`/api/containers/${containerId}/restart`);
      toast.success('Container restart initiated');
      fetchData();
    } catch (error) {
      toast.error('Failed to restart container');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Container Status
          </h2>
          <ContainerList
            containers={containers}
            onRestart={handleRestart}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            System Metrics
          </h2>
          <SystemMetrics metrics={systemMetrics} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Restarts
        </h2>
        <RestartLogs logs={restartLogs} />
      </div>
    </div>
  );
} 