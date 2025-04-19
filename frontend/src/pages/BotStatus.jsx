import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ServerIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function BotStatus() {
  const { token } = useAuth();
  const [shards, setShards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        const response = await fetch('/api/bot/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bot status');
        }

        const data = await response.json();
        setShards(data.shards);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBotStatus();
    const interval = setInterval(fetchBotStatus, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Diva Bot Status
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Monitor bot shards and performance
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {shards.map((shard) => (
            <div
              key={shard.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ServerIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Shard {shard.id}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {shard.status}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold">
                          {shard.status === 'online' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">
                    <p>Latency: {shard.latency}ms</p>
                    <p>Guilds: {shard.guilds}</p>
                    <p>Users: {shard.users}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 