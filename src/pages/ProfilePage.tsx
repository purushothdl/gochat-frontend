// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';
import { authService } from '../features/auth/services/auth.service';
import type { Profile } from '../features/auth/types/auth.types';
import { SessionsManager } from '../features/auth/components/SessionsManager';
import Button from '../shared/components/ui/Button';
import Avatar from '../shared/components/ui/Avatar';
import { formatDate } from '../shared/utils/date.utils';


const SettingsListItem = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  isDestructive = false,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
  isDestructive?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-5 gap-2 sm:gap-0">
    <div>
      <h4 className="text-sm sm:text-base font-semibold text-gray-800">{title}</h4>
      <p className="mt-1 text-xs sm:text-sm text-gray-500">{subtitle}</p>
    </div>
    <Button
      onClick={onButtonClick}
      className={`!w-full sm:!w-32 !py-2 !px-4 text-sm ${
        isDestructive
          ? 'bg-red-400 text-red-700 hover:bg-red-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-500'
      }`}
    >
      {buttonText}
    </Button>
  </div>
);

const ProfilePage = () => {
  const globalLogout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfile(await authService.getUserProfile());
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogoutCurrentDevice = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Backend logout failed, clearing local session.", error);
    } finally {
      globalLogout();
      navigate('/login');
    }
  };

  const handleLogoutAll = async () => {
    if (window.confirm('Are you sure you want to log out from all devices?')) {
      try {
        await authService.logoutAllDevices();
        globalLogout();
        navigate('/login');
      } catch (err) {
        alert('Failed to log out from all devices.');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }
  if (!profile) {
    return <div className="text-center text-red-500">Could not load profile.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* Profile Details Card */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center space-x-4">
            <Avatar src={profile.image_url} name={profile.name} className="h-20 w-20 text-3xl"/>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Joined at</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(profile.created_at)}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last login</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(profile.last_login).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* NEW Settings Card */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            <p className="mt-1 text-sm text-gray-600">Your preferences for the application.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Notifications</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {profile.settings.notifications_enabled ? 'Enabled' : 'Disabled'}
                    </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Language</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase">{profile.settings.language}</dd>
                </div>
            </dl>
        </div>
      </div>

      {/* Sessions Card */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
          <p className="mt-1 text-sm text-gray-600">Manage devices where you are logged in.</p>
        </div>
        <div className="px-4 py-5 sm:px-6">
            <SessionsManager />
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Sign Out</h2>
        </div>
        <div className="border-t border-gray-200 px-4 sm:px-6 divide-y divide-gray-200">
           <SettingsListItem
              title="Sign out of this device"
              subtitle="You will be required to sign in again on this device."
              buttonText="Sign out"
              onButtonClick={handleLogoutCurrentDevice}
           />
           <SettingsListItem
              title="Sign out of all other devices"
              subtitle="This will sign you out from all active sessions except this one."
              buttonText="Sign out all"
              onButtonClick={handleLogoutAll}
              isDestructive
           />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;