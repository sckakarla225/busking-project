import React from 'react';
import { FaClock } from 'react-icons/fa';

interface EventInfoProps {
  eventName: string,
  eventVenue: string,
  distanceFromSpot: number,
  startTime: string,
  endTime: string,
  tags: string[]
};

const EventInfo: React.FC<EventInfoProps> = ({
  eventName,
  eventVenue,
  distanceFromSpot,
  startTime,
  endTime,
  tags
}) => {
  return (
    <div className="w-full bg-slate-200 border-2 border-slate-300 px-3 py-4 rounded-md mb-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-3/5">
          <h1 className="font-eau-bold text-black text-sm">{eventName}</h1>
          <div className="flex flex-row items-center mt-3">
            <FaClock size={20} className="text-spotlite-orange" />
            <h1 className="font-semibold text-xs ml-2">{startTime} - {endTime}</h1>
          </div>
          <h1 className="font-eau-light text-black text-xs mt-3">Venue:</h1>
          <h1 className="font-eau-medium text-black text-xs">{eventVenue}</h1>
          <h1 className="font-eau-light text-black text-xs mt-3">Distance From Spot:</h1>
          <h1 className="font-eau-medium text-black text-xs">{distanceFromSpot} meters</h1>
        </div>
        <div className="w-2/5">
          <div className="flex flex-row flex-wrap mt-2">
            {tags.map((tag: string, index) => (
              <div 
                key={index} 
                className={`rounded py-2 px-2 mr-1 w-auto mb-2 bg-spotlite-light-purple`}
              >
                <h1 className={`text-xs font-eau-regular text-white`}>
                  {tag}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;