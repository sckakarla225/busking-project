'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaSoundcloud,
  FaSpotify,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

import { 
  Loading, 
  Navbar, 
  ReservationView 
} from '@/components';
import { Reservation } from '../types';
import { getTimeSlots } from '@/api';
import { useAppSelector } from '@/redux/store';

type PlatformType = 
  'Instagram' |
  'Facebook' |
  'Twitter' |
  'Youtube' |
  'Soundcloud' |
  'Spotify';

export default function Profile() {
  const userId = useAppSelector((state) => state.auth.userId);
  const allSpots = useAppSelector((state) => state.spots.spots);
  const performerName = useAppSelector((state) => state.performer.name);
  const performerEmail = useAppSelector((state) => state.auth.email);
  const description = useAppSelector((state) => state.performer.performerDescription);
  const dateJoined = useAppSelector((state) => state.performer.dateJoined);
  const performanceStyles = useAppSelector((state) => state.performer.performanceStyles);
  const socialMediaHandles = useAppSelector((state) => state.performer.socialMediaHandles);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const iconMap: Record<PlatformType, IconType> = {
    Instagram: FaInstagram,
    Facebook: FaFacebook,
    Twitter: FaTwitter,
    Youtube: FaYoutube,
    Soundcloud: FaSoundcloud,
    Spotify: FaSpotify
  };

  useEffect(() => {
    setLoading(true);
    const setupReservations = async () => {
      const timeSlotsData = await getTimeSlots();
      const userReservations: Reservation[] = [];
      if (timeSlotsData.success) {
        const timeSlots = timeSlotsData.data;
        timeSlots.map((timeSlot: any) => {
          if (timeSlot.performerId && timeSlot.performerId === userId) {
            const spotInfo = allSpots.find((spot) => spot.spotId === timeSlot.spotId);
            if (spotInfo) {
              const latitude = spotInfo.latitude;
              const longitude = spotInfo.longitude;
              let convertedTime = new Date(timeSlot.startTime);
              let convertedEndTime = new Date(timeSlot.endTime);
              convertedTime = new Date(convertedTime.getTime() + 0 * 60 * 60 * 1000);
              convertedEndTime = new Date(convertedEndTime.getTime() + 0 * 60 * 60 * 1000);
              const formattedTime = convertedTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              const formattedEndTime = convertedEndTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              const reservation: Reservation = {
                timeSlotId: timeSlot.timeSlotId,
                spotId: timeSlot.spotId,
                spotName: timeSlot.spotName,
                spotLatitude: latitude,
                spotLongitude: longitude,
                date: timeSlot.date,
                startTime: formattedTime,
                endTime: formattedEndTime
              };
              userReservations.push(reservation);
            };
          };
        });
      };
      setReservations(userReservations);
    };

    setupReservations()
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Loading isLoading={loading} />
      <main className={`
        relative w-screen h-screen
        ${loading ? 'opacity-50' : ''} 
      `}>
        <Navbar />
        <section className="px-10 py-28 flex flex-col justify-center">
          <div className="flex flex-row items-center my-3">
            <Image src={'/logos/spotlite-icon.png'} alt="logo" width={75} height={75} />
            <div className="flex flex-col ml-5">
              <h1 className="text-black font-eau-medium text-lg">{performerName}</h1>
              <h1 className="text-black font-eau-light text-sm mt-2">&quot;{description}&quot;</h1>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mt-5">
            <h1 className="text-black font-eau-medium text-xs">Date Joined: {dateJoined} </h1>
            <h1 className="text-black font-eau-medium text-xs">{performerEmail}</h1>
          </div>
          <div className="flex flex-col mt-5">
            <div className="flex flex-row items-center">
              <h1 className="text-black font-eau-regular text-sm">My Performance Styles</h1>
            </div>
            <div className="flex flex-row flex-wrap mt-3">
              {performanceStyles.map((item: any, index) => (
                <div key={index} className="rounded bg-spotlite-dark-purple py-2 px-2 mr-2 mb-2 w-auto">
                  <h1 className="text-xs text-white font-eau-regular">{item}</h1>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-5">
            <div className="flex flex-row items-center">
              <h1 className="text-black font-eau-regular text-sm">Upcoming Bookings</h1>
            </div>
            <div className="w-full rounded-sm bg-slate-50 border-2 border-slate-100 h-72 mt-3 p-2 overflow-y-auto scroll-smooth snap-none touch-pan-y">
              {reservations.length !== 0 ? (
                <>
                  {reservations.map((reservation: Reservation, index) => (
                    <ReservationView
                      key={index}
                      timeSlotId={reservation.timeSlotId} 
                      spotId={reservation.spotId}
                      spotName={reservation.spotName}
                      latitude={reservation.spotLatitude}
                      longitude={reservation.spotLongitude}
                      date={reservation.date}
                      reservedTo={reservation.endTime}
                      reservedFrom={reservation.startTime}
                      reservations={reservations}
                      updateReservations={
                        (reservations: Reservation[]) => setReservations(reservations)
                      }
                    />
                  ))}
                </>
              ) : (
                <>
                  <h1 className="text-sm font-eau-medium m-5">
                    No bookings found. Browse the map and sign up for a time-slot to get started!
                  </h1>
                </>
              )}
              
            </div>
          </div>
          <div className="flex flex-col mt-7">
            <div className="flex flex-row items-center mb-3">
              <h1 className="text-black font-eau-regular text-sm">My Social Media</h1>
            </div>
            {socialMediaHandles.length !== 0 ? (
              <>
                {socialMediaHandles.map((handle, index) => {
                  const IconComponent = iconMap[handle.platform as PlatformType];
                  return (
                    <div className="flex flex-row items-center mb-2" key={index}>
                      <div className="flex flex-row items-center justify-center p-2 rounded-md bg-spotlite-light-purple">
                        <IconComponent size={20} color="white" />
                      </div>
                      <h1 className="ml-3 font-eau-medium text-sm">@{handle.handle}</h1>
                    </div>
                  )
                })}
              </>
            ) : (
              <>
                <h1 className="text-base font-eau-medium text-black">None</h1>
              </>
            )}
            
          </div>
        </section>
      </main>
    </>
  );
};