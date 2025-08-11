// src/features/auth/components/SessionsManager.tsx
import { useEffect, useState } from 'react';
import type { Device } from '../types/auth.types';
import { authService } from '../services/auth.service';

export const SessionsManager = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      setDevices(await authService.listDevices());
    } catch (err) {
      console.error('Failed to load devices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleLogoutDevice = async (deviceId: string) => {
    try {
        await authService.logoutDevice(deviceId);
        fetchDevices(); // Refresh the list after revoking
    } catch(err) {
        alert("Failed to revoke session.");
    }
  };

  if (isLoading) return <p className="text-sm text-gray-500">Loading active sessions...</p>;

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {devices.map((device) => (
        <li key={device.id} className="flex items-center justify-between py-4">
          <div className="text-sm">
            <p className="font-medium text-gray-900">{device.device_info}</p>
            <p className="text-gray-500">
              IP: {device.ip_address} &middot; Last used: {new Date(device.last_used_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleLogoutDevice(device.id)}
            className="ml-4 text-sm font-semibold text-indigo-600 hover:text-red-500 focus:outline-none"
          >
            Revoke
          </button>
        </li>
      ))}
    </ul>
  );
};