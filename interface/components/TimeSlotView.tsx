import React from 'react';
import Link from 'next/link';
import { FaStreetView } from 'react-icons/fa';

import { useAppSelector } from '@/redux/store';
import { reserveTimeSlot } from '@/api';

interface TimeSlotViewProps {
  timeSlotId: string,
  spotId: string,
  spotName: string,
  spotRegion: string,
  date: string,
  startTime: string,
  endTime: string,
  activityLevel: number,
  reserveSuccess: () => void,
  reserveFail: () => void,
};

const TimeSlotView: React.FC<TimeSlotViewProps> = ({
  timeSlotId,
  spotId,
  spotName,
  spotRegion,
  date,
  startTime,
  endTime,
  activityLevel,
  reserveSuccess,
  reserveFail
}) => {
  const userId = useAppSelector((state) => state.auth.userId);

  const reserve = async () => {
    const reserveTimeSlotRes = await reserveTimeSlot(timeSlotId, userId);
    if (reserveTimeSlotRes.success) {
      reserveSuccess();
    } else {
      reserveFail();
    }
  };

  return (
    <div className="w-full bg-slate-50 px-5 py-4 rounded-md mb-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="font-eau-bold text-sm">{spotName}</h1>
          <h1 className="font-eau-light text-xs mt-2">{spotRegion}</h1>
        </div>
        <Link href={`/spot/${spotId}`}>
          <button className="text-white font-semibold text-xs rounded-md bg-spotlite-dark-purple border-2 border-spotlite-dark-purple border-opacity-80 px-1 py-1 mt-4 flex flex-row justify-center w-10">
            <FaStreetView 
              size={15} 
              color="white"
            />
          </button>
        </Link>
      </div>
      <h1 className="text-black font-eau-medium text-xs mt-4">Date: {date}</h1>
      <div className="flex flex-row items-center justify-between space-x-2 mt-3">
        <div className="py-2 px-3 bg-slate-200 border-2 border-slate-300 border-opacity-50 flex flex-row items-center rounded-md">
          <h1 className="text-black font-semibold text-xs">{startTime}</h1>
        </div>
        <h1 className="text-black font-eau-heavy text-sm">TO</h1>
        <div className="py-2 px-3 bg-slate-200 border-2 border-slate-300 border-opacity-50 flex flex-row items-center rounded-md">
          <h1 className="text-black font-semibold text-xs">{endTime}</h1>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between mt-7">
        <div 
          className={`
            bg-slate-100 border-4 border-spotlite-dark-purple rounded-full flex items-center justify-center w-8 h-8
          `}
        >
          {activityLevel == 3 && (
            <div className="w-[75%] h-[75%] rounded-full bg-slate-100 border-2 border-spotlite-light-purple animate-wave flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full bg-slate-100 border-2 border-spotlite-light-purple animate-wave"></div>
            </div>
          )}
          {activityLevel == 2 && (
            <div className="w-[50%] h-[50%] rounded-full bg-slate-100 border-2 border-spotlite-light-purple animate-wave flex items-center justify-center"></div>
          )}
        </div>
        <button 
          type="submit"
          className={`
            text-sm hover:bg-opacity-80 bg-spotlite-orange text-white py-2 px-6 rounded focus:outline-none focus:shadow-outline font-eau-bold
          `}
          onClick={() => reserve()}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default TimeSlotView;