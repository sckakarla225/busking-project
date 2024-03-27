'use client';

import React from 'react';
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

import { Navbar, Reservation } from '@/components';
import { useAppSelector } from '@/redux/store';
import { SAMPLE_RESERVATIONS } from '@/constants';

type PlatformType = 
  'Instagram' |
  'Facebook' |
  'Twitter' |
  'Youtube' |
  'Soundcloud' |
  'Spotify';

export default function Profile() {
  const userId = useAppSelector((state) => state.auth.userId);
  const performerName = useAppSelector((state) => state.performer.name);
  const performerEmail = useAppSelector((state) => state.auth.email);
  const description = useAppSelector((state) => state.performer.performerDescription);
  const dateJoined = useAppSelector((state) => state.performer.dateJoined);
  const performanceStyles = useAppSelector((state) => state.performer.performanceStyles);
  const socialMediaHandles = useAppSelector((state) => state.performer.socialMediaHandles);

  const iconMap: Record<PlatformType, IconType> = {
    Instagram: FaInstagram,
    Facebook: FaFacebook,
    Twitter: FaTwitter,
    Youtube: FaYoutube,
    Soundcloud: FaSoundcloud,
    Spotify: FaSpotify
  };

  return (
    <>
      <main className={`relative w-screen h-screen `}>
        <Navbar />
        <section className="px-10 py-28 flex flex-col justify-center">
          <div className="flex flex-row items-center my-3">
            <Image src={'/logos/spotlite-icon.png'} alt="logo" width={75} height={75} />
            <div className="flex flex-col ml-5">
              <h1 className="text-black font-eau-medium text-lg">{performerName}</h1>
              <h1 className="text-black font-eau-light text-sm mt-2">"{description}"</h1>
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
              {SAMPLE_RESERVATIONS.map((reservation) => (
                <Reservation 
                  spotId={reservation.spotId}
                  spotName={reservation.spotName}
                  latitude={reservation.latitude}
                  longitude={reservation.longitude}
                  date={reservation.date}
                  reservedTo={reservation.reservedTo}
                  reservedFrom={reservation.reservedFrom}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-7">
            <div className="flex flex-row items-center mb-3">
              <h1 className="text-black font-eau-regular text-sm">My Social Media</h1>
            </div>
            {socialMediaHandles.map((handle) => {
              const IconComponent = iconMap[handle.platform as PlatformType];
              return (
                <div className="flex flex-row items-center mb-2">
                  <div className="flex flex-row items-center justify-center p-2 rounded-md bg-spotlite-light-purple">
                    <IconComponent size={20} color="white" />
                  </div>
                  <h1 className="ml-3 font-eau-medium text-sm">@{handle.handle}</h1>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </>
  );
};