'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MdLogout } from 'react-icons/md';

import { SpotInfo } from '@/components';
import { predictSpot } from '@/api';
import { useAppSelector } from '@/redux/store';
import logo from '../../logo.png';

export default function Spot(
  { params }: { params: { id: string } }
) {
  const allSpots = useAppSelector((state) => state.spots.spots);
  const selectedTime = useAppSelector((state) => state.spots.selectedTime);
  const [spotName, setSpotName] = useState<string>('');
  const [spotRegion, setSpotRegion] = useState<string>('');
  const [spotAvailability, setSpotAvailability] = useState<boolean | null>(null);
  const [activityLevel, setActivityLevel] = useState<number | null>(null);

  function convertTime12to24(time12h: string): [number, number] {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return [hours, minutes];
  }

  function checkTimeWithinReservation(startTime: Date, endTime: Date, givenTime: string): boolean {
      const givenDateTime = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        ...convertTime12to24(givenTime)
      );

      return givenDateTime >= startTime && givenDateTime <= endTime;
  }

  useEffect(() => {
    if (allSpots !== []) {
      const spotInfo = allSpots.find((spot) => spot.spotId === params.id);
      if (spotInfo) {
        setSpotName(spotInfo.name);
        setSpotRegion(spotInfo.region);
        let isReserved = false;
        spotInfo.reservations.map((reservation) => {
          const startTime = new Date(reservation.startTime);
          const endTime = new Date(reservation.endTime);
          const spotReserved = checkTimeWithinReservation(
            startTime, 
            endTime, 
            selectedTime
          );
          if (spotReserved) {
            isReserved = true;
          }
        });
        setSpotAvailability(isReserved);
        setActivityLevel(3); // TODO: Set this value from prediction API
      };
    }
  }, [selectedTime]);

  return (
    <main className="flex min-h-screen flex-col">
      <nav className= "border-gray-200 bg-zinc-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 px-8">
          <div className="flex flex-row items-center">
            <a href="/city/home" className="flex items-center">
              <Image src={logo} alt="logo" width={35} height={35} />
            </a>
          </div>
          <MdLogout size={25} color="white" className="ml-4" />
        </div>
      </nav>
      <div className="absolute bottom-16 z-10 px-16 w-full mx-auto">
        <SpotInfo 
          name={spotName}
          region={spotRegion}
          startTime={selectedTime}
          activity={activityLevel}
          availability={spotAvailability}
        />
      </div>
    </main>
  )
}