import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { pterodactylApi } from '../services/pterodactylApi';

export default function Containers() {
  const { token } = useAuth();
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await pterodactylApi.getServers();
      const serversData = response.data.data;
      
      // Get detailed information for each server
      const detailedServers = await Promise.all(
        serversData.map(async (server) => {
          const resources = await pterodactylApi.getServerResources(server.attributes.identifier);
          return {
            ...server.attributes,
            resources: resources.data
          };
        })
      );
      
      setServers(detailedServers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch servers: ' + err.message);
      console.error('Error fetching servers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Server Status
            </h2>
            <button
              onClick={fetchServers}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
          <p className="mt-2 text-lg text-gray-600">
            Monitor your Pterodactyl servers in real-time
          </p>
        </div>

        {/* Stats */}
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Total Servers</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{servers.length}</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Running</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {servers.filter(s => s.resources?.attributes?.state === 'running').length}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Stopped</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {servers.filter(s => s.resources?.attributes?.state === 'stopped').length}
            </dd>
          </div>
        </dl>

        {/* Server List */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        CPU
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Memory
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Disk
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {servers.map((server) => (
                      <tr key={server.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {server.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              server.resources?.attributes?.state === 'running'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {server.resources?.attributes?.state || 'unknown'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {server.resources?.attributes?.cpu_absolute}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {Math.round(server.resources?.attributes?.memory_bytes / 1024 / 1024)} MB
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {Math.round(server.resources?.attributes?.disk_bytes / 1024 / 1024)} MB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 