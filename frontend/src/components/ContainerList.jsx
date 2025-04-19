import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  running: 'bg-green-100 text-green-800',
  exited: 'bg-red-100 text-red-800',
  created: 'bg-yellow-100 text-yellow-800',
  restarting: 'bg-blue-100 text-blue-800'
};

export default function ContainerList({ containers, onRestart }) {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatUptime = (seconds) => {
    if (seconds === 0) return 'Not running';
    return formatDistanceToNow(Date.now() - seconds * 1000, { addSuffix: true });
  };

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {containers.map((container) => (
          <li key={container.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {container.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {container.image}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[container.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {container.status}
                </span>
                <button
                  onClick={() => onRestart(container.id)}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Uptime:</span>{' '}
                {formatUptime(container.uptime)}
              </div>
              <div>
                <span className="font-medium">CPU:</span>{' '}
                {container.cpu ? `${(container.cpu / 1000000).toFixed(2)}%` : 'N/A'}
              </div>
              <div>
                <span className="font-medium">Memory:</span>{' '}
                {container.memory
                  ? `${formatBytes(container.memory.used)} / ${formatBytes(
                      container.memory.limit
                    )}`
                  : 'N/A'}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}