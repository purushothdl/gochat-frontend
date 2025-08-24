// src/pages/ProfilePage.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Global State & Services
import { useAuthStore } from '../features/auth/store/auth.store';
import { authService } from '../features/auth/services/auth.service';
import { userService } from '../features/user/services/user.service';
import { toast } from '../shared/components/ui/toast';

// UI Components
import { SessionsManager } from '../features/auth/components/SessionsManager';
import { UpdateProfileForm } from '../features/user/components/UpdateProfileForm';
import { UpdateSettingsForm } from '../features/user/components/UpdateSettingsForm';
import { ChangePasswordForm } from '../features/user/components/ChangePasswordForm';
import Button from '../shared/components/ui/Button';
import Avatar from '../shared/components/ui/Avatar';

// Utils & Types
import { formatDate } from '../shared/utils/date.utils';
import type { Profile } from '../features/user/types/user.types';

// Reusable list item component for the sign out section
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
      className={`!w-full sm:!w-32 !py-2 !px-4 text-sm ${isDestructive
        ? 'bg-red-500 text-white hover:bg-red-600'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
    >
      {buttonText}
    </Button>
  </div>
);


const ProfilePage = () => {
  const profile = useAuthStore((s) => s.user);
  const globalLogout = useAuthStore((s) => s.logout);
  const updateUserProfile = useAuthStore((s) => s.updateUserProfile);
  const navigate = useNavigate();

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  // Disable scrolling when the popup is open
  useEffect(() => {
    if (isImagePopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isImagePopupOpen]);

  useEffect(() => {
    if (!profile) {
      userService.getProfile().catch(() => {
        toast.error("Session invalid. Please log in again.");
        globalLogout();
        navigate('/login');
      });
    }
  }, [profile, globalLogout, navigate]);

  useEffect(() => {
    if (isUploadingImage) {
      setIsUploadingImage(false);
    }
  }, [profile?.image_url]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    toast.info('Uploading image...');

    try {
      await userService.updateProfileImage(file);
    } catch (error) {
      toast.error('Upload failed. Please try a different image.');
      setIsUploadingImage(false);
    }
    event.target.value = '';
  };

  const handleProfileSave = async (data: Profile) => {
    try {
      const updatedProfile = await userService.updateProfile({ name: data.name });
      updateUserProfile(updatedProfile);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('Failed to update profile.');
    }
  };

  const handleSettingsSave = async (data: Profile) => {
    try {
      const updatedSettings = await userService.updateSettings(data.settings);
      updateUserProfile({ settings: updatedSettings });
      toast.success('Settings updated successfully!');
      setIsEditingSettings(false);
    } catch (error) {
      toast.error('Failed to update settings.');
    }
  };

  const handleLogoutCurrentDevice = async () => {
    try {
      await authService.logout();
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
        toast.error('Failed to log out from all devices.');
      }
    }
  };

  if (!profile) {
    return <div className="text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* Image Popup */}
      {isImagePopupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 h-screen">
          <div className="relative">
            <img src={profile.image_url} alt="Profile" className="max-w-[90vw] max-h-[90vh] rounded-lg" />
            <button
              type="button"
              onClick={() => setIsImagePopupOpen(false)}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-2 shadow-sm hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- PROFILE CARD --- */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="relative group" onClick={() => !isUploadingImage && setIsImagePopupOpen(true)}>
              <Avatar src={profile.image_url} name={profile.name} className="h-20 w-20 text-3xl" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              disabled={isUploadingImage}
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </div>
          </div>
          {!isEditingProfile && (
            <button onClick={() => setIsEditingProfile(true)} className="font-semibold text-indigo-600 hover:text-indigo-500">Edit</button>
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {isEditingProfile ? (
            <UpdateProfileForm profile={profile} onSave={handleProfileSave} onCancel={() => setIsEditingProfile(false)} />
          ) : (
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Joined at</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(profile.created_at)}</dd>
              </div>
              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Last login</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.last_login ? new Date(profile.last_login).toLocaleString() : 'N/A'}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* --- SETTINGS CARD --- */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            <p className="mt-1 text-sm text-gray-600">Your preferences for the application.</p>
          </div>
          {!isEditingSettings && (
            <button onClick={() => setIsEditingSettings(true)} className="font-semibold text-indigo-600 hover:text-indigo-500">Edit</button>
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {isEditingSettings ? (
            <UpdateSettingsForm profile={profile} onSave={handleSettingsSave} onCancel={() => setIsEditingSettings(false)} />
          ) : (
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Notifications</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.settings?.notifications_enabled ? 'Enabled' : 'Disabled'}</dd>
              </div>
              <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Language</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase">{profile.settings?.language ?? 'N/A'}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* --- PASSWORD & SECURITY CARD --- */}
      <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900">Password & Security</h2>
          <p className="mt-1 text-sm text-gray-600">Change your password and manage active sessions.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Change Password</h3>
          <ChangePasswordForm />
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Active Sessions</h3>
          <SessionsManager />
        </div>
      </div>

      {/* --- SIGN OUT CARD --- */}
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