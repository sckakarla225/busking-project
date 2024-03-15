import React, { useEffect, useState } from 'react';
import { TbTriangleFilled } from 'react-icons/tb';
import './styles.css';

interface TimeSliderProps {
  updateSelectedTime: (time: string) => void
};

const TimeSlider: React.FC<TimeSliderProps> = ({ updateSelectedTime }) => {
  const [value, setValue] = useState(9);

  const formatTime = (index: number) => {
    const hours = 6 + index;
    const period = hours < 12 || hours === 24 ? 'AM' : 'PM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${formattedHours}:00 ${period}`;
  };

  const scrollTime = (direction: any) => {
    setValue((prevValue) => {
      const newValue = prevValue + direction * 6;
      return newValue < 0 ? 0 : newValue > 17 ? 17 : newValue;
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
          max="17"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          step="1"
          className="w-full h-8 bg-zinc-700 rounded-md appearance-none cursor-pointer slider"
        />
        <div className="absolute w-full flex justify-between text-center text-xs">
          {Array.from({ length: 7 }).map((_, i) => {
            const index = value + i - 3;
            if (index >= 0 && index <= 17) {
              return (
                <span key={i} className={`absolute ${i === 3 ? 'text-slate-100 font-semibold text-sm' : 'text-slate-300 font-medium text-xs'}`} style={{ left: `calc(${(i / 6) * 100}% - 10px)`, top: 5 }}>
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
        aria-disabled={value === 17} 
        size={40} 
        className="text-zinc-700 rotate-90" 
        onClick={() => scrollTime(1)}
      />
    </div>
  );
};

export default TimeSlider;
