import { useEffect, useState } from 'react';
import { pterodactylApi } from '../services/pterodactylApi';
import { PlayIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Containers() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await pterodactylApi.getServers();
      setServers(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch servers');
      console.error('Error fetching servers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePowerAction = async (serverId, action) => {
    try {
      switch (action) {
        case 'start':
          await pterodactylApi.startServer(serverId);
          break;
        case 'stop':
          await pterodactylApi.stopServer(serverId);
          break;
        case 'restart':
          await pterodactylApi.restartServer(serverId);
          break;
        default:
          throw new Error('Invalid action');
      }
      // Refresh server status after action
      await fetchServers();
    } catch (err) {
      setError(`Failed to ${action} server`);
      console.error(`Error during ${action} action:`, err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 m-4">
        <div className="flex">
          <div className="text-red-700">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Containers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all containers in your Pterodactyl panel
          </p>
        </div>
      </div>
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
                      Memory
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      CPU
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {servers.map((server) => (
                    <tr key={server.attributes.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {server.attributes.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          server.attributes.status === 'running' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {server.attributes.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {server.attributes.limits.memory} MB
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {server.attributes.limits.cpu}%
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handlePowerAction(server.attributes.id, 'start')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <PlayIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handlePowerAction(server.attributes.id, 'stop')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <StopIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handlePowerAction(server.attributes.id, 'restart')}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <ArrowPathIcon className="h-5 w-5" />
                          </button>
                        </div>
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
  );
} 