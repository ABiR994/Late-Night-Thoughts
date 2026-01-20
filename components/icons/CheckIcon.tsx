// components/icons/CheckIcon.tsx

import React from 'react';

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

const CheckIcon: React.FC<CheckIconProps> = (props) => (
  <svg 
    className="w-4 h-4 flex-shrink-0" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default CheckIcon;