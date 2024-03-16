import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { reserveSpot, updateRecentSpots } from '@/api';
import { 
  updateCurrentSpot, 
  updateRecentSpots as ReduxUpdateRecentSpots
} from '@/redux/reducers/performer';
import { useAppSelector, AppDispatch } from '@/redux/store';

interface SpotInfoProps {
  activity: number | null,
  availability: boolean | null,
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
  spotId, name, 
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
  const userId = useAppSelector((state) => state.auth.userId);
  const [reservedFrom, setReservedFrom] = useState<string>(startTime);
  const [reservedTo, setReservedTo] = useState<string>('');

  const getCurrentDate = (): string => {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = currentDate.getFullYear();

    const dateString = `${month}/${day}/${year}`;
    console.log(dateString);
    return dateString;
  }

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

  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let hour = 6; hour <= 23; hour++) {
      const hourToShow = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      times.push(`${hourToShow}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}`);
    }
    return times;
  };

  const saveToRecentSpots = async () => {
    const updatedRecentSpots = await updateRecentSpots(userId, spotId, name, region);
    if (updatedRecentSpots.success) {
      const userInfo = updatedRecentSpots.data;
      const recentSpots = userInfo.recentSpots;
      dispatch(ReduxUpdateRecentSpots({ recentSpots: recentSpots }));
    };
  }

  const makeReservation = async () => {
    startLoading();

    if (!availability) {
      stopLoading();
      openErrorPopup();
      return
    };

    if (
      latitude && 
      longitude &&
      reservedFrom !== '' &&
      reservedTo !== ''
    ) {
      const reservationStatus = await reserveSpot(
        userId,
        spotId,
        name,
        region,
        latitude,
        longitude,
        reservedFrom,
        reservedTo
      );
      if (reservationStatus.success) {
        console.log(reservationStatus.data);
        const currentSpotData = reservationStatus.data.currentSpot;
        const currentSpot = {
          spotId: currentSpotData.spotId,
          name: currentSpotData.name,
          region: currentSpotData.region,
          latitude: currentSpotData.latitude,
          longitude: currentSpotData.longitude,
          reservedFrom: currentSpotData.reservedFrom,
          reservedTo: currentSpotData.reservedTo,
        };
        dispatch(updateCurrentSpot({ currentSpot: currentSpot }));
        saveToRecentSpots();
        stopLoading();
        openSuccessPopup();
      } else {
        stopLoading();
        openErrorPopup();
      }
    } else {
      stopLoading();
      openErrorPopup();
    };
  };

  const timeOptions = generateTimeOptions();

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
            ${!availability && 'bg-zinc-700'}
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
          <h1 className="text-black font-eau-medium text-sm mt-1">{getCurrentDate()}</h1>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h1 className="text-black font-eau-light text-xs">Reservation Time:</h1>
        <div className="flex flex-row justify-between items-center mt-2">
          <div className="inline-block relative w-52">
            <select
              className="block appearance-none text-xs font-medium w-full bg-white border border-slate-100 hover:border-slate-200 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={reservedFrom}
              onChange={(e) => setReservedFrom(e.target.value)}
            >
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <h1 className="text-black font-eau-medium text-xs px-2">TO</h1>
          <div className="inline-block relative w-52">
            <select
              className="block appearance-none text-xs font-medium w-full bg-white border border-slate-100 hover:border-slate-200 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={reservedTo}
              onChange={(e) => setReservedTo(e.target.value)}
            >
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <button 
          className=" hover:bg-opacity-80 bg-spotlite-dark-purple text-white font-eau-heavy py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
          onClick={makeReservation}
        >
          Reserve
        </button>
      </div>
    </div>
  )
};

export default SpotInfo;