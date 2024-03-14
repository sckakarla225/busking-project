import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { reserveSpot } from '@/api';

interface SpotInfoProps {
  activity: number | null,
  availability: boolean | null,
  name: string,
  region: string,
  latitude: number | null,
  longitude: number | null,
  startTime: string
};

const SpotInfo: React.FC<SpotInfoProps> = ({
  activity, availability, name, region, latitude, longitude, startTime
}) => {
  const router = useRouter();

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
    const time = new Date(`1970-01-01T${startTime}`);
    time.setHours(time.getHours() + 1);

    const hours = time.getHours() % 12 === 0 ? 12 : time.getHours() % 12;
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

    return `${hours}:${minutes} ${ampm}`;
  }

  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let hour = 6; hour <= 24; hour++) {
      const hourToShow = hour > 12 ? hour - 12 : hour;
      times.push(`${hourToShow}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}`);
      if (hour !== 24) {
        times.push(`${hourToShow}:30 ${hour < 12 ? 'AM' : 'PM'}`);
      }
    }
    return times;
  };

  const makeReservation = () => {
    reserveSpot()
    router.push('/');
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    const defaultEndTime = getDefaultEndTime(startTime);
    setReservedTo(defaultEndTime);
    setReservedFrom(startTime);
  }, [startTime]);

  return (
    <div className="bg-slate-100 relative py-5 px-4 rounded-lg shadow-md">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div 
          className={`
            bg-slate-100 border-4 border-purple-900 rounded-full flex items-center justify-center w-10 h-10
            ${!availability && 'bg-zinc-700'}
          `}
        >
          {availability && activity == 3 && (
            <div className="w-[75%] h-[75%] rounded-full bg-slate-100 border-4 border-purple-500 animate-wave flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full bg-slate-100 border-4 border-purple-500 animate-wave"></div>
            </div>
          )}
          {availability && activity == 2 && (
            <div className="w-[50%] h-[50%] rounded-full bg-slate-100 border-4 border-purple-500 animate-wave flex items-center justify-center"></div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-black font-light text-sm">Spot Name:</h1>
        <h1 className="text-black font-semibold text-lg">{name}</h1>
      </div>
      <div className="flex flex-row mt-4">
        <div className="flex flex-col w-2/3">
          <h1 className="text-black font-light text-xs">Spot Region:</h1>
          <h1 className="text-black font-semibold text-base">{region}</h1>
        </div>
        <div className="flex flex-col w-1/3">
          <h1 className="text-black font-light text-xs">Date:</h1>
          <h1 className="text-black font-semibold text-sm mt-1">{getCurrentDate()}</h1>
        </div>
      </div>
      <div className="flex flex-col mt-3">
        <h1 className="text-black font-light text-xs">Reservation Time:</h1>
        <div className="flex flex-row justify-between items-center mt-2">
          <div className="inline-block relative w-52">
            <select
              className="block appearance-none text-sm font-medium w-full bg-white border border-slate-100 hover:border-slate-200 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={reservedFrom}
              onChange={(e) => setReservedFrom(e.target.value)}
            >
              {timeOptions.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <h1 className="text-black font-semibold text-sm px-2">TO</h1>
          <div className="inline-block relative w-52">
            <select
              className="block appearance-none text-sm font-medium w-full bg-white border border-slate-100 hover:border-slate-200 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
          className=" hover:bg-purple-600 bg-purple-500 text-white font-black py-3 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
        >
          Reserve
        </button>
      </div>
    </div>
  )
};

export default SpotInfo;