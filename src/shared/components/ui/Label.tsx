// src/shared/components/ui/Label.tsx
import type { LabelHTMLAttributes, FC } from 'react';

const Label: FC<LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => {
  return (
    <label className="block text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  );
};

export default Label;