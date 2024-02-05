"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'
import Map, { Marker, Popup } from 'react-map-gl';
import { HiMiniUserCircle } from 'react-icons/hi2';
import { TbMapPinPlus } from 'react-icons/tb';

import { TimeSlider, Profile, Key } from '../components';
import { firestore } from '@/firebase/spotsData';
import { collection, getDocs } from 'firebase/firestore';
import { useAppSelector } from '@/redux/store';
import { MAPBOX_API_KEY } from '@/constants';
import logo from './logo.png';

export default function Home() {
  const [spots, setSpots] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isKeyOpen, setIsKeyOpen] = useState(false);

  useEffect(() => {
    const getSpots = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "final-spots"));
        const spotsData: any[] = [];
        querySnapshot.forEach((doc) => {
          spotsData.push({ 
            id: doc.id, 
            name: doc.data().name,
            lat: doc.data().coordinates._lat,
            long: doc.data().coordinates._long
          });
        });
        if (spotsData !== []) {
          setSpots(spotsData);
          console.log(spotsData);
        };
      } catch (e) {
        console.log(e);
      }
    };

    getSpots();
  }, [])

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
        <TimeSlider />
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
        pitch={55}
        mapStyle="mapbox://styles/sckakarla36/clrtwmjh800rh01o86wqfe7rx"
      >
        {spots !== [] 
          && spots.map((spot: any) => (
            <Marker 
              key={spot.id}
              latitude={spot.lat} 
              longitude={spot.long}
            >
              <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
            </Marker>
        ))}
      </Map>
    </main>
    </>
  )
}
