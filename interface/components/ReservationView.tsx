import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStreetView, FaTimes } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';

import { Reservation } from '@/app/types';
import { cancelTimeSlot } from '@/api';
import { changeSelectedTime, changeSelectedDate } from '@/redux/reducers/spots';
import { useAppSelector, AppDispatch } from '@/redux/store';

interface ReservationViewProps {
  timeSlotId: string,
  spotId: string,
  spotName: string,
  latitude: number,
  longitude: number,
  date: string,
  reservedFrom: string,
  reservedTo: string,
  reservations: Reservation[],
  updateReservations: (reservations: Reservation[]) => void,
};

const ReservationView: React.FC<ReservationViewProps> = ({
  timeSlotId,
  spotId,
  spotName,
  latitude,
  longitude,
  date,
  reservedFrom,
  reservedTo,
  reservations,
  updateReservations
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useAppSelector((state) => state.auth.userId);

  const viewSpot = () => {
    dispatch(changeSelectedDate({ selectedDate: date }));
    dispatch(changeSelectedTime({ selectedTime: reservedFrom }));
    router.push(`/spot/${spotId}`);
  }

  const cancel = async () => {
    const cancelTimeSlotRes = await cancelTimeSlot(timeSlotId, userId);
    if (cancelTimeSlotRes.success) {
      const updatedReservations = reservations.filter(
        (reservation) => reservation.timeSlotId !== timeSlotId
      );
      updateReservations(updatedReservations);
    };
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  }

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
        <button 
          className="text-black font-eau-medium text-xs rounded-md bg-slate-100 border-2 border-slate-200 px-2 py-2 cursor-pointer mt-3 mr-6"
          onClick={() => viewSpot()}
        >
          <div className="flex flex-row items-center">
            <FaStreetView size={15} color="black" />
            <h1 className="ml-2">View Spot</h1>
          </div>
        </button>
        <Link href={''}>
          <button 
            className="text-white font-eau-medium text-xs rounded-md bg-red-600 border-2 border-red-600 px-2 py-2 cursor-pointer mt-4"
            onClick={() => cancel()}
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