'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { getAllSpots } from '../../firebase';
// import { Spot } from '../types';
import logo from '../logo.png';

export default function FilterSpots () {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const setupData = async () => {
      const spotsData: any = await getAllSpots();
      setSpots(spotsData);
    };

    setupData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <nav className= "border-gray-200 bg-zinc-800">
        <div className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl p-4">
          <div className="flex flex-row items-center">
            <a href="/" className="flex items-center">
              <Image src={logo} alt="logo" width={35} height={35} />
            </a>
          </div>
        </div>
      </nav>
      <section className="px-16 py-10">
        {spots.map((spot: any) => (
          <>
            <h1>Spot ID: {spot.id}</h1>
            <h1>Spot Name: {spot.name}</h1>
            <h1>Latitude: {spot.latitude}</h1>
            <h1>Longitude: {spot.longitude}</h1>
            {/* {spot.mediaUrls.map((url: any) => {
              if (url.type == 'image') {
                return <Image src={url.url} alt="spot image" width={100} height={100} />
              } else if (url.type == 'video') {
                return <video controls><source src={url.url} type="video/quicktime" /></video>
              }
            })} */}
          </>
        ))}
      </section>
    </main>
  )
}