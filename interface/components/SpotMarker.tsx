import React from 'react';

interface SpotMarkerProps {
  size: number,
  availability: boolean,
  activity: number
};

const SpotMarker: React.FC<SpotMarkerProps> = ({
  size, availability, activity
}) => {
  return (
    <div className={`
      bg-slate-100 border-8 border-purple-900 mt-20 rounded-full
      ${size === 1 || size === 2 && 'h-10 w-8'}
      ${size === 3 && 'h-16 w-12'}
      ${size === 4 || size === 5 && 'h-24 w-20'}
    `}>

    </div>
  ) 
};

export default SpotMarker;