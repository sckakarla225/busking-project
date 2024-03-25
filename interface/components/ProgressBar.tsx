import React from 'react';

interface ProgressBarProps {
  currentStep: number
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative flex-grow h-2 bg-spotlite-dark-purple">
        <div 
          className={`
            absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border-2 flex flex-row items-center justify-center
            ${currentStep == 1 ? 'bg-orange-500 border-spotlite-orange border-opacity-80 w-10 h-10' : 'bg-white border-slate-200 w-8 h-8'}
          `}
        >
          <h1 
            className={`
              font-black
              ${currentStep !== 1 ? 'text-xs text-black': 'text-white'}
            `}
          >
            1
          </h1>
        </div>
        <div 
          className={`
            absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-row items-center justify-center rounded-full border-2
            ${currentStep == 2 ? 'bg-orange-500 border-spotlite-orange border-opacity-80 w-10 h-10' : 'w-8 h-8 bg-white border-slate-200'}
          `}
        >
          <h1 
            className={`
              font-black
              ${currentStep !== 2 ? 'text-xs text-black': 'text-white'}
            `}
          >
            2
          </h1>
        </div>
        <div 
          className={`
            absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 flex flex-row items-center justify-center rounded-full border-2
            ${currentStep == 3 ? 'bg-orange-500 border-spotlite-orange border-opacity-80 w-10 h-10' : 'w-8 h-8 bg-white border-slate-200'} 
          `}
        >
          <h1 
            className={`
              font-black
              ${currentStep !== 3 ? 'text-xs text-black': 'text-white'}
            `}
          >
            3
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;