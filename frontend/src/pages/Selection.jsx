import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleStackIcon, ServerIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import { pterodactylApi } from '../services/pterodactylApi';

export default function Selection() {
  const navigate = useNavigate();
  const [serverStats, setServerStats] = useState({
    totalServers: 0,
    runningServers: 0,
    totalMemory: 0,
    totalCpu: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await pterodactylApi.getServers();
        const serversData = response.data.data;
        
        // Get detailed information for each server
        const detailedServers = await Promise.all(
          serversData.map(async (server) => {
            try {
              const resources = await pterodactylApi.getServerResources(server.attributes.identifier);
              return {
                ...server.attributes,
                resources: resources.data
              };
            } catch (err) {
              console.error(`Error fetching resources for server ${server.attributes.name}:`, err);
              return {
                ...server.attributes,
                resources: null
              };
            }
          })
        );

        // Calculate stats
        const stats = {
          totalServers: detailedServers.length,
          runningServers: detailedServers.filter(s => s.resources?.attributes?.state === 'running').length,
          totalMemory: detailedServers.reduce((acc, server) => 
            acc + (server.resources?.attributes?.memory_bytes || 0), 0),
          totalCpu: detailedServers.reduce((acc, server) => 
            acc + (server.resources?.attributes?.cpu_absolute || 0), 0)
        };

        setServerStats(stats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching server stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      name: 'Server Status',
      description: 'Monitor your Pterodactyl servers and resources',
      icon: CircleStackIcon,
      href: '/containers',
      amount: `${serverStats.totalServers} Servers`,
      color: 'bg-indigo-600'
    },
    {
      name: 'Bot Status',
      description: 'View Diva bot shards and performance metrics',
      icon: ServerIcon,
      href: '/bot-status',
      amount: '5 Shards',
      color: 'bg-indigo-600'
    }
  ];

  const stats = [
    { 
      name: 'Total Servers', 
      value: serverStats.totalServers.toString(), 
      icon: CircleStackIcon 
    },
    { 
      name: 'Active Servers', 
      value: serverStats.runningServers.toString(), 
      icon: CircleStackIcon 
    },
    { 
      name: 'Total Memory Usage', 
      value: `${Math.round(serverStats.totalMemory / 1024 / 1024 / 1024 * 100) / 100} GB`, 
      icon: ServerIcon 
    },
    { 
      name: 'Average CPU Usage', 
      value: `${Math.round(serverStats.totalCpu / serverStats.totalServers || 0)}%`, 
      icon: ServerIcon 
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Welcome section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Welcome to Diva Status Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage your infrastructure from a single place
          </p>
        </div>

        {/* Stats */}
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-3 py-4 shadow"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-600 p-1.5">
                  <stat.icon className="h-3 w-3 text-white" aria-hidden="true" />
                </div>
                <p className="ml-8 truncate text-xs font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-8 flex items-baseline">
                <p className="text-sm font-medium text-gray-900">
                  {loading ? '...' : stat.value}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        {/* Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.name}
              onClick={() => navigate(card.href)}
              className="relative group cursor-pointer rounded-lg bg-white p-4 shadow hover:shadow-md transition-all duration-200 focus-within:ring-1 focus-within:ring-inset focus-within:ring-indigo-500"
            >
              <div>
                <span className={`inline-flex rounded-lg p-1.5 ${card.color} text-white ring-1 ring-white`}>
                  <card.icon className="h-3 w-3" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-900">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {card.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {card.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute right-3 top-3 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 