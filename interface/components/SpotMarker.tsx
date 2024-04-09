import React from 'react';

interface SpotMarkerProps {
  size: number,
  availability: boolean,
  activity: number,
};

const SpotMarker: React.FC<SpotMarkerProps> = ({
  availability, activity
}) => {
  return (
    // <div 
    //   className={`
    //     bg-slate-100 border-4 border-spotlite-dark-purple mt-20 rounded-full flex items-center justify-center
    //     ${((size === 1 || size === 2) && 'h-8 w-8')}
    //     ${(size === 3) && 'h-12 w-12'}
    //     ${((size === 4 || size === 5) && 'h-16 w-16')}
    //     ${!availability && 'bg-zinc-700'}
    //   `}
    // >
    <div 
      className={`
        bg-slate-100 border-4 border-spotlite-dark-purple mt-20 rounded-full flex items-center justify-center h-12 w-12
        ${!availability && 'bg-spotlite-light-purple'}
      `}
    >
      {availability && activity == 3 && (
        <div className="w-[75%] h-[75%] rounded-full bg-slate-100 border-4 border-spotlite-light-purple animate-wave flex items-center justify-center">
          <div className="w-[60%] h-[60%] rounded-full bg-slate-100 border-4 border-spotlite-light-purple animate-wave"></div>
        </div>
      )}
      {availability && activity == 2 && (
        <div className="w-[50%] h-[50%] rounded-full bg-slate-100 border-4 border-spotlite-light-purple animate-wave flex items-center justify-center"></div>
      )}
    </div>
  ) 
};

export default SpotMarker;