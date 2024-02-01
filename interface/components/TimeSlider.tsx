import { useState } from 'react';
import './styles.css';
import { TbTriangleFilled } from 'react-icons/tb';

const TimeSlider = () => {
  // There are 48 half-hour intervals in a day, so the range is 0-47
  const [value, setValue] = useState(24); // Default value set to noon (12:00 PM)

  // Convert the slider value to a time format
  const formatTime = (index: number) => {
    // Convert index to minutes
    const minutes = index * 30;
    // Calculate hours and minutes
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    // Determine AM or PM
    const period = hours < 12 ? 'AM' : 'PM';
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // Format the time string
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // When the user clicks the scroll buttons
  const scrollTime = (direction: any) => {
    // Each step is 1 interval (30 minutes), and we need to move 6 steps (3 hours)
    setValue((prevValue) => Math.max(0, Math.min(47, prevValue + direction * 6)));
  };

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
          max="47"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          step="1" // Snap to every half-hour
          className="w-full h-8 bg-zinc-700 rounded-md appearance-none cursor-pointer slider"
        />
        <div className="absolute w-full flex justify-between text-center text-xs">
          {Array.from({ length: 7 }).map((_, i) => {
            const index = value + i - 3; // Calculate the index for the label
            const minutes = index * 30;
            // Only render labels that are within the 24-hour range
            if (index >= 0 && index <= 47) {
              return (
                <span key={i} className={`absolute ${i === 3 ? 'text-white font-semibold text-sm' : 'text-gray-200 font-medium text-xs'}`} style={{ left: `calc(${(i / 6) * 100}% - 15px)`, top: 5 }}>
                  {formatTime(index).split(' ')[0]} <br />
                  {formatTime(index).split(' ')[1]}
                </span>
              );
            }
          })}
        </div>
      </div>
      <TbTriangleFilled 
        aria-disabled={value === 0} 
        size={40} 
        className="text-zinc-700 rotate-90" 
        onClick={() => scrollTime(-1)}
      />
    </div>
  );
};

export default TimeSlider;
