"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image'
import Map, { Marker } from 'react-map-gl';
import { HiMiniUserCircle } from 'react-icons/hi2';

import { firestore } from '@/firebase/spotsData';
import { collection, getDocs } from 'firebase/firestore';
import { useAppSelector } from '@/redux/store';
import { MAPBOX_API_KEY } from '@/constants';
import logo from './logo.png';

export default function Home() {
  const [spots, setSpots] = useState<any[]>([]);

  useEffect(() => {
    const getSpots = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "spots"));
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
    <main className="relative w-screen h-screen">
      <nav className="absolute top-0 left-0 z-10 w-full border-gray-200 bg-zinc-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 px-8">
          <div className="flex flex-row items-center">
            <a href="/" className="flex items-center">
              <Image src={logo} alt="logo" width={35} height={35} />
            </a>
          </div>
          <HiMiniUserCircle size={30} color="white" />
        </div>
      </nav>
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
        mapStyle="mapbox://styles/mapbox/standard"
      >
        {spots !== [] 
          && spots.map((spot: any) => (
            <Marker key={spot.id} latitude={spot.lat} longitude={spot.long}>
              <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
            </Marker>
        ))}
      </Map>
    </main>
  )
}
