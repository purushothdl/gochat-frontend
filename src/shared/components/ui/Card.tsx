// src/shared/components/ui/Card.tsx
import type { HTMLAttributes, FC } from 'react';

const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={`bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;