import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { LiaTimesSolid } from 'react-icons/lia';
import { HiLocationMarker } from 'react-icons/hi';
import { FaStreetView } from 'react-icons/fa';

import { useAppSelector, AppDispatch } from '@/redux/store';
import { updateCurrentSpot } from '@/redux/reducers/performer';
import { leaveSpot } from '@/api';
import logo from '../app/logo.png';

interface ProfileProps {
  isOpen: boolean,
  onClose: () => void,
  name: string,
  email: string,
  dateJoined: string,
  performanceStyles: string[],
  currentSpot: Object | any,
  recentSpots: Object[] | any[],
  startLoading: () => void,
  stopLoading: () => void
};

const Profile: React.FC<ProfileProps> = ({ 
  isOpen, 
  onClose, 
  name, 
  email, 
  dateJoined, 
  performanceStyles, 
  currentSpot, 
  recentSpots,
  startLoading,
  stopLoading 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useAppSelector((state) => state.auth.userId);
  const spots = useAppSelector((state) => state.spots.spots);
  const [reservedFromDate, setReservedFromDate] = useState<Date | null>(null);
  const [reservedToDate, setReservedToDate] = useState<Date | null>(null);

  const calculateTimeLeft = (endTime: Date): string => {
    const now = new Date();
    let difference = endTime.getTime() - now.getTime();
    if (difference < 0) {
      return "0:00";
    }

    difference = difference / 1000 / 60;
    const hours = Math.floor(difference / 60);
    const minutes = Math.floor(difference % 60);

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const leaveCurrentSpot = async () => {
    startLoading();
    let reservationId = '';
    const spotId = currentSpot.spotId;
    const startTime = currentSpot.reservedFrom;
    const endTime = currentSpot.reservedTo;
    const spotInfo = spots.find((spot) => spot.spotId === spotId);
    const matchedReservation = spotInfo?.reservations.find((reservation) => 
      reservation.performerId === userId &&
      reservation.startTime === startTime &&
      reservation.endTime === endTime
    );

    if (matchedReservation) {
      reservationId = matchedReservation.reservationId;
    }
    const spotLeft = await leaveSpot(userId, spotId, reservationId);
    if (spotLeft.success) {
      dispatch(updateCurrentSpot({ currentSpot: {} }));
      onClose();
    }
    stopLoading();
    onClose();
  };

  const openGoogleMaps = () => {
    const latitude = currentSpot.latitude;
    const longitude = currentSpot.longitude;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  }

  useEffect(() => {
    startLoading();
    if (currentSpot.name) {
      const formattedReservedFrom = new Date(currentSpot.reservedFrom);
      const formattedReservedTo = new Date(currentSpot.reservedTo);
      setReservedToDate(formattedReservedTo);
      setReservedFromDate(formattedReservedFrom);
    };
    stopLoading();
  }, [currentSpot]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-center mx-4">
      <div className="flex flex-row">
        <div className="bg-gray-100 border-2 border-gray-200 w-full rounded-md pb-10">
          <div className="bg-zinc-700 px-6 py-5 flex flex-col rounded-t-md">
            <div className="flex flex-row justify-between items-center w-full">
              <LiaTimesSolid size={15} color="white" onClick={onClose} />
            </div>
            <div className="flex flex-row items-center my-3 pr-10 pl-4">
              <Image src={logo} alt="logo" width={75} height={75} />
              <div className="flex flex-col ml-5">
                <h1 className="text-white font-semibold text-lg">{name}</h1>
                <h1 className="text-white font-light text-sm mt-2">{email}</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mt-5 mx-5">
            <h1 className="text-black font-medium text-xs">Date Joined: {dateJoined} </h1>
          </div>
          <div className="flex flex-row items-center mt-6 mx-5">
            <h1 className="text-black font-medium text-sm">My Current Spot: </h1>
            <h1 className="text-black font-semibold text-sm ml-2 mr-4">
              {currentSpot.name ? currentSpot.name : 'None'}
            </h1>
            {currentSpot.name && (
              <button className="text-white font-semibold text-xs rounded-md bg-purple-600 border-2 border-purple-600 px-1 py-1">
                <HiLocationMarker 
                  size={15} 
                  color="white"
                  onClick={openGoogleMaps} 
                />
              </button>
            )}
          </div>
          {reservedFromDate && reservedToDate ? (
            <div className="flex flex-row justify-between mx-5 mt-4 bg-purple-600 rounded-md py-5 px-4">
              <div className="flex flex-col w-full">
                <div className="flex flex-row items-center">
                  <h1 className="text-white text-sm font-light">
                    Reserved from:
                  </h1>
                  <h1 className="text-white text-sm font-semibold ml-2">
                    {
                      reservedFromDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    } - {" "}
                    {
                      reservedToDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    }
                  </h1>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <h1 className="text-white text-sm font-light">
                    Time until reservation ends:
                  </h1>
                  <h1 className="text-white text-sm font-semibold ml-2">
                    {calculateTimeLeft(reservedToDate)}
                  </h1>
                </div>
                <div className="flex flex-row justify-between items-center mt-4">
                  <Link href={`/spot/${currentSpot.spotId}`}>
                    <button 
                      className="text-black font-semibold text-xs rounded-md bg-slate-100 border-2 border-slate-200 px-3 py-3 mr-4 cursor-pointer"
                      
                    >
                      <div className="flex flex-row items-center">
                        <FaStreetView size={15} color="black" />
                        <h1 className="ml-2">View Spot</h1>
                      </div>
                    </button>
                  </Link>
                  <button 
                    className="text-white font-semibold text-xs rounded-md bg-red-600 border-2 border-red-600 px-2 py-3 mr-4 cursor-pointer"
                    onClick={leaveCurrentSpot}
                  >
                    Leave Spot
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-purple-600 border-2 border-purple-700 w-5/6 mx-5 py-5 px-3 rounded-md mt-4">
              <h1 className="italic font-semibold text-white">Browse the map and select a spot!</h1>
            </div>
          )}
          
          <div className="flex flex-col mt-5 mx-5">
            <div className="flex flex-row items-center">
              <h1 className="text-black font-medium text-sm">My Performance Styles</h1>
            </div>
            <div className="flex flex-row flex-wrap mt-5">
              {performanceStyles.map((item: any, index) => (
                <div key={index} className="rounded bg-purple-500 py-2 px-4 mr-2 w-auto">
                  <h1 className="text-xs text-white font-medium">{item}</h1>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col mt-8 mx-5">
            <div className="flex flex-row items-center">
              <h1 className="text-black font-medium text-sm">My Recent Spots</h1>
            </div>
            {recentSpots.length !== 0 ? (
              <div className="flex space-x-4 p-4 bg-slate-200 rounded-md mt-3">
                {recentSpots.map((spot, index) => (
                  <div key={index} className="flex flex-col bg-purple-500 p-3 w-1/3 rounded-lg justify-between">
                    <h1 className="text-white font-semibold text-center text-xs">{spot.name}</h1>
                    <Link href={`/spot/${spot.spotId}`}>
                      <button 
                        className=" hover:bg-slate-100 bg-slate-200 text-black font-black py-1 px-2 rounded-md focus:outline-none focus:shadow-outline mt-4 w-full"
                      >
                        View
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ): (
              <div className="flex flex-row mt-3">
                <h1 className="text-lg">No recent spots to show.</h1>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
