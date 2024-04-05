import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { 
  reserveTimeSlot,
  getTimeSlots
} from '@/api';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { logSpotReserved } from '@/firebase/analytics';
import { changeSelectedDate, changeSelectedSpotName } from '@/redux/reducers/spots';

interface SpotInfoProps {
  activity: number | null,
  availability: boolean | null,
  isUser: boolean | null,
  spotId: string,
  name: string,
  region: string,
  latitude: number | null,
  longitude: number | null,
  startTime: string,
  openSuccessPopup: () => void,
  openErrorPopup: () => void,
  startLoading: () => void,
  stopLoading: () => void
};

const SpotInfo: React.FC<SpotInfoProps> = ({
  activity, 
  availability,
  isUser, 
  spotId, 
  name, 
  region, 
  latitude, 
  longitude, 
  startTime,
  openSuccessPopup,
  openErrorPopup,
  startLoading,
  stopLoading
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.userId);
  const selectedDate = useAppSelector((state) => state.spots.selectedDate);
  const [reservedFrom, setReservedFrom] = useState<string>(startTime);
  const [reservedTo, setReservedTo] = useState<string>('');

  const getDefaultEndTime = (startTime: string): string => {
    const [time, period] = startTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    hours += period === 'AM' ? 0 : 12;
    hours += 1;

    if (hours >= 24) {
      hours -= 24;
    }
    const newPeriod = hours >= 12 && hours < 24 ? 'PM' : 'AM';

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes.toString().padStart(2, '0')} ${newPeriod}`;
  }

  const makeReservation = async () => {
    startLoading();
    let timeSlotId;
    const timeSlotsData = await getTimeSlots();
    if (timeSlotsData.success) {
      const allSlots = timeSlotsData.data;
      const timeSlot = allSlots.find((slot: any) => {
        let convertedTime = new Date(slot.startTime);
        convertedTime = new Date(convertedTime.getTime() + 0 * 60 * 60 * 1000);
        const formattedTime = convertedTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        if (
          slot.spotId === spotId &&
          formattedTime === startTime &&
          slot.date === selectedDate
        ) {
          return slot;
        }
      });
      if (timeSlot) {
        timeSlotId = timeSlot.timeSlotId;
      } else {
        stopLoading();
        openErrorPopup();
      }
    };

    const reserveTimeSlotRes = await reserveTimeSlot(timeSlotId, userId);
    if (reserveTimeSlotRes.success) {
      logSpotReserved(spotId);
      stopLoading();
      openSuccessPopup();
    } else {
      stopLoading();
      openErrorPopup();
    }
  };

  const viewTimeSlots = () => {
    dispatch(changeSelectedDate({ selectedDate: selectedDate }));
    dispatch(changeSelectedSpotName({ selectedSpotName: name }));
    router.push('/timings');
  };

  useEffect(() => {
    startLoading();
    setReservedFrom(startTime);
    const defaultEndTime = getDefaultEndTime(startTime);
    setReservedTo(defaultEndTime);
    stopLoading();
  }, [startTime]);

  return (
    <div className="bg-slate-100 relative py-5 px-4 rounded-lg shadow-md">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div 
          className={`
            bg-slate-100 border-4 border-spotlite-dark-purple rounded-full flex items-center justify-center w-10 h-10
            ${!availability && !isUser && 'bg-zinc-700'}
          `}
        >
          {(availability || isUser) && activity == 3 && (
            <div className="w-[75%] h-[75%] rounded-full bg-slate-100 border-4 border-spotlite-light-purple animate-wave flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full bg-slate-100 border-4 border-spotlite-light-purple animate-wave"></div>
            </div>
          )}
          {(availability || isUser) && activity == 2 && (
            <div className="w-[50%] h-[50%] rounded-full bg-slate-100 border-4 border-spotlite-light-purple animate-wave flex items-center justify-center"></div>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-3">
        <h1 className="text-black font-eau-light text-sm">Spot Name:</h1>
        <h1 className="text-black font-eau-medium text-base">{name}</h1>
      </div>
      <div className="flex flex-row mt-4">
        <div className="flex flex-col w-2/3">
          <h1 className="text-black font-eau-light text-xs">Spot Region:</h1>
          <h1 className="text-black font-eau-medium text-base">{region}</h1>
        </div>
        <div className="flex flex-col w-1/3">
          <h1 className="text-black font-eau-light text-xs">Date:</h1>
          <h1 className="text-black font-eau-medium text-sm mt-1">{selectedDate}</h1>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h1 className="text-black font-eau-light text-xs">Booking Time:</h1>
        <div className="flex flex-row justify-between items-center mt-2">
          <div className="inline-block relative w-40">
            <div className="py-2 px-2 bg-slate-200 border-2 border-slate-300 border-opacity-50 flex flex-row items-center justify-center rounded-md">
              <h1 className="text-black font-semibold text-xs">{reservedFrom}</h1>
            </div>
          </div>
          <h1 className="text-black font-eau-medium text-xs px-2">TO</h1>
          <div className="inline-block relative w-40">
            <div className="py-2 px-2 bg-slate-200 border-2 border-slate-300 border-opacity-50 flex flex-row items-center justify-center rounded-md">
              <h1 className="text-black font-semibold text-xs">{reservedTo}</h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        {availability && !isUser && (
          <button 
            className=" hover:bg-opacity-80 bg-spotlite-orange text-white font-eau-heavy py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
            onClick={makeReservation}
          >
            Sign Up
          </button>
        )}
        {!availability && isUser && (
          <button 
            className="opacity-70 bg-spotlite-orange text-white font-eau-heavy py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
            disabled={true}
          >
            Reserved By Me
          </button>
        )}
        {!availability && !isUser && (
          <div className="flex flex-row items-center justify-between w-full mt-10">
            <h1 className="text-black text-base font-eau-medium">Unavailable.</h1>
            <Link href={'/timings'}>
              <button 
                className="hover:bg-opacity-80 bg-spotlite-dark-purple text-white text-sm font-eau-heavy py-2 px-3 rounded-md focus:outline-none focus:shadow-outline"
                // onClick={() => viewTimeSlots()}
              >
                View Time Slots
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
};

export default SpotInfo;