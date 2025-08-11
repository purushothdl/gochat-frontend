// src/shared/components/ui/Avatar.tsx
// src/shared/components/ui/Avatar.tsx
import type { FC } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({ src, name, className = 'h-16 w-16' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (src) {
    return (
      <img
        className={`rounded-full object-cover ${className}`}
        src={src}
        alt={`${name}'s profile picture`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
};

export default Avatar;