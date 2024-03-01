import React, { useEffect, useState } from 'react';
import './styles.css';
import { TbTriangleFilled } from 'react-icons/tb';

interface TimeSliderProps {
  updateSelectedTime: (time: string) => void
};

const TimeSlider: React.FC<TimeSliderProps> = ({ updateSelectedTime }) => {
  const [value, setValue] = useState(18);

  const formatTime = (index: number) => {
    const adjustedIndex = (index + 12) % 48;
    const minutes = adjustedIndex * 30;
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours < 12 ? 'AM' : 'PM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const scrollTime = (direction: any) => {
    setValue((prevValue) => {
      const newValue = prevValue + direction * 6;
      return newValue < 0 ? 0 : newValue > 36 ? 36 : newValue;
    });
  };

  useEffect(() => {
    updateSelectedTime(formatTime(value));
  }, [value]);

  return (
    <div className="flex items-center my-10 space-x-0">
      <TbTriangleFilled 
        aria-disabled={value === 0} 
        size={40} 
        className="text-zinc-700 -rotate-90" 
        onClick={() => scrollTime(-1)}
      />
      <div className="flex-1 relative">
        <input
          type="range"
          min="0"
          max="36"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          step="1"
          className="w-full h-8 bg-zinc-700 rounded-md appearance-none cursor-pointer slider"
        />
        <div className="absolute w-full flex justify-between text-center text-xs">
          {Array.from({ length: 7 }).map((_, i) => {
            const index = value + i - 3;
            if (index >= 0 && index <= 36) {
              return (
                <span key={i} className={`absolute ${i === 3 ? 'text-slate-500 font-semibold text-sm' : 'text-slate-300 font-medium text-xs'}`} style={{ left: `calc(${(i / 6) * 100}% - 15px)`, top: 5 }}>
                  {formatTime(index).split(' ')[0]} <br />
                  {formatTime(index).split(' ')[1]}
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>
      <TbTriangleFilled 
        aria-disabled={value === 36} 
        size={40} 
        className="text-zinc-700 rotate-90" 
        onClick={() => scrollTime(1)}
      />
    </div>
  );
};

export default TimeSlider;
