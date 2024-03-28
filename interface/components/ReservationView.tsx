import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStreetView, FaTimes } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';

interface ReservationViewProps {
  spotId: string,
  spotName: string,
  latitude: number,
  longitude: number,
  date: string,
  reservedFrom: string,
  reservedTo: string
};

const ReservationView: React.FC<ReservationViewProps> = ({
  spotId,
  spotName,
  latitude,
  longitude,
  date,
  reservedFrom,
  reservedTo
}) => {
  const [reservedFromDate, setReservedFromDate] = useState<Date | null>(null);
  const [reservedToDate, setReservedToDate] = useState<Date | null>(null);

  const calculateTimeLeft = (endTime: Date | null): string => {
    if (endTime) {
      const now = new Date();
      let difference = endTime.getTime() - now.getTime();
      if (difference < 0) {
        return "0:00";
      }

      difference = difference / 1000 / 60;
      const hours = Math.floor(difference / 60);
      const minutes = Math.floor(difference % 60);

      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return '';
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  }

  useEffect(() => {
      let formattedReservedFrom = new Date(reservedFrom);
      let formattedReservedTo = new Date(reservedTo);
      formattedReservedFrom = new Date(formattedReservedFrom.getTime() + 4 * 60 * 60 * 1000);
      formattedReservedTo = new Date(formattedReservedTo.getTime() + 4 * 60 * 60 * 1000);
      
      setReservedToDate(formattedReservedTo);
      setReservedFromDate(formattedReservedFrom);
  }, []);

  return (
    <div className="w-full bg-white border-2 border-slate-200 px-3 py-3 grid grid-cols-2 gap-4 rounded-md mb-4">
      <div className="flex flex-col">
        <h1 className="text-black font-eau-heavy text-sm">{spotName}</h1>
        <h1 className="text-black font-eau-medium text-xs mt-2">{date}</h1>
        <h1 className="text-black font-eau-regular text-xs mt-2">{reservedFrom} - {reservedTo}</h1>
        <button className="text-white font-semibold text-xs rounded-md bg-spotlite-orange border-2 border-spotlite-orange border-opacity-80 px-1 py-1 mt-4 flex flex-row justify-center w-1/3">
          <HiLocationMarker 
            size={15} 
            color="white"
            onClick={openGoogleMaps} 
          />
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h1 className="text-xs font-eau-regular">Time left:</h1>
          <h1 className="text-sm font-eau-medium">{calculateTimeLeft(reservedToDate)}</h1>
        </div>
        <Link href={`/spot/${spotId}`}>
          <button 
            className="text-black font-eau-medium text-xs rounded-md bg-slate-100 border-2 border-slate-200 px-2 py-2 cursor-pointer mt-3"
          >
            <div className="flex flex-row items-center">
              <FaStreetView size={15} color="black" />
              <h1 className="ml-2">View Spot</h1>
            </div>
          </button>
        </Link>
        <Link href={''}>
          <button 
            className="text-white font-eau-medium text-xs rounded-md bg-red-600 border-2 border-red-600 px-2 py-2 cursor-pointer mt-4"
            onClick={() => {}}
          >
            <div className="flex flex-row items-center">
              <FaTimes size={15} color="white" />
              <h1 className="ml-2">Cancel</h1>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReservationView;