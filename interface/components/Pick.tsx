import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaStar, FaStreetView } from 'react-icons/fa';

import { 
  changeSelectedDate,
  changeSelectedTime 
} from '@/redux/reducers/spots';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { reserveTimeSlot } from '@/api';

interface PickProps {
  timeSlotId: string,
  spotId: string,
  spotName: string,
  spotRegion: string,
  date: string,
  events: string[],
  startTime: string,
  endTime: string,
  activityLevel: number,
  reserveSuccess: () => void,
  reserveFail: () => void,
};

const Pick: React.FC<PickProps> = ({
  timeSlotId,
  spotId,
  spotName,
  spotRegion,
  date,
  events,
  startTime,
  endTime,
  activityLevel,
  reserveSuccess,
  reserveFail
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.userId);

  const reserve = async () => {
    const reserveTimeSlotRes = await reserveTimeSlot(timeSlotId, userId);
    if (reserveTimeSlotRes.success) {
      reserveSuccess();
    } else {
      reserveFail();
    }
  };

  const viewSpot = async () => {
    dispatch(changeSelectedDate({ selectedDate: date }));
    dispatch(changeSelectedTime({ selectedTime: startTime }));
    router.push(`/spot/${spotId}`)
  }

  return (
    <div className="w-full bg-slate-50 px-5 py-4 rounded-md mb-6">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <FaStar size={25} className="text-spotlite-pink" />
          <div className="flex flex-col ml-3">
            <h1 className="font-eau-bold text-sm">{spotName}</h1>
            <h1 className="font-eau-light text-xs mt-1">{spotRegion}</h1>
          </div>
        </div>
        <button 
          className="text-white font-semibold text-xs rounded-md bg-spotlite-dark-purple border-2 border-spotlite-dark-purple border-opacity-80 px-1 py-1 mt-4 flex flex-row justify-center w-10"
          onClick={() => viewSpot()}
        >
          <FaStreetView 
            size={15} 
            color="white"
          />
        </button>
      </div>
      <h1 className="text-black font-eau-medium text-xs mt-4">Date: {date}</h1>
      <h1 className="text-black font-eau-regular text-xs mt-4">Nearby Events:</h1>
      {events.length !== 0 ? (
        <div className="flex flex-row flex-wrap mt-2">
          {events.map((event: string, index) => (
            <div
              key={index} 
              className={`rounded py-2 px-3 mr-2 w-auto mb-2 bg-spotlite-light-purple`}
            >
              <h1 className={`text-xs font-eau-regular text-white`}>
                {event}
              </h1>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="font-eau-regular text-base mt-2">None</h1>
      )}
      
      <div className="flex flex-row items-center justify-between space-x-2 mt-5">
        <div className="py-2 px-3 bg-slate-200 border-2 border-slate-300 border-opacity-50 flex flex-row items-center rounded-md">
          <h1 className="text-black font-semibold text-xs">{startTime}</h1>
        </div>
        <h1 className="text-black font-eau-heavy text-sm">TO</h1>
        <div className="py-2 px-3 bg-slate-200 border-2 border-slate-300 border-opacity-50 flex flex-row items-center rounded-md">
          <h1 className="text-black font-semibold text-xs">{endTime}</h1>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end mt-7">
        {/* <div 
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
        </div> */}
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

export default Pick;