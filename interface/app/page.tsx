"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image'
import Map, { Marker, Popup } from 'react-map-gl';
import { HiMiniUserCircle } from 'react-icons/hi2';
import { TbMapPinPlus } from 'react-icons/tb';

import { 
  TimeSlider, 
  Profile, 
  Key,
  SpotMarker 
} from '../components';
import { useAppSelector } from '@/redux/store';
import { predictSpots } from '@/api';
import { MAPBOX_API_KEY } from '@/constants';
import logo from './logo.png';

export default function Home() {
  const [spots, setSpots] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isKeyOpen, setIsKeyOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const userId = useAppSelector((state) => state.auth.userId);
  const spotsInfo = useAppSelector((state) => state.spots.spots);

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
    const processedSpots: any[] = [];
    if (selectedTime) {
      spotsInfo.map((spotInfo) => {
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

        let activity = 3; // TODO: Get this value from prediction API
        const processedSpot = {
          ...spotInfo,
          availability: !isReserved,
          activity: activity
        };
        processedSpots.push(processedSpot);
      });
    }
    console.log(processedSpots);
    setSpots(processedSpots);
  }, [selectedTime]);

  return (
    <>
    <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    <main className={`relative w-screen h-screen ${isProfileOpen ? 'opacity-50' : ''}`}>
      <nav className="absolute top-0 left-0 z-10 w-full border-gray-200 bg-zinc-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 px-8">
          <div className="flex flex-row items-center">
            <a href="/" className="flex items-center">
              <Image src={logo} alt="logo" width={35} height={35} />
            </a>
          </div>
          <HiMiniUserCircle size={30} color="white" onClick={() => setIsProfileOpen(true)} />
        </div>
      </nav>
      <button 
        className="absolute top-24 right-5 z-10 px-4 py-2 border-2 border-purple-800 bg-purple-700 rounded-lg"
        onClick={() => setIsKeyOpen(!isKeyOpen)}
      >
        <div className="flex flex-row items-center justify-center">
          <TbMapPinPlus size={20} color="white" />
          <p className="text-white font-semibold text-xs ml-2">Key</p>
        </div>
      </button>
      <Key isOpen={isKeyOpen} onClose={() => setIsKeyOpen(!isKeyOpen)} />
      <div className="absolute bottom-10 px-5 z-10 w-full">
        <TimeSlider updateSelectedTime={(newTime) => setSelectedTime(newTime)} />
      </div>
      <Map
        mapboxAccessToken={MAPBOX_API_KEY}
        initialViewState={{
          longitude: -78.63913983214495,
          latitude: 35.78055856250403,
          zoom: 2
        }}
        maxBounds={[
          [-78.65855724798772, 35.769623580355734],
          [-78.62039725622377, 35.792861226084234]
        ]}
        style={{ width: '100%', height: '100%' }}
        pitch={45}
        mapStyle="mapbox://styles/sckakarla36/clrtwmjh800rh01o86wqfe7rx"
      >
        {spots !== [] 
          && spots.map((spot: any) => (
            <Marker 
              key={spot.spotId}
              latitude={spot.latitude} 
              longitude={spot.longitude}
            >
              <SpotMarker 
                size={spot.spotSize} 
                availability={spot.availability} 
                activity={spot.activity} 
              />
            </Marker>
        ))}
      </Map>
    </main>
    </>
  )
}
