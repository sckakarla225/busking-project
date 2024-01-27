import React from 'react';
import Image from 'next/image';
import Map, { Marker } from 'react-map-gl';
import { LiaTimesSolid } from 'react-icons/lia';
import { MdModeEdit } from 'react-icons/md';

import logo from '../app/logo.png';
import { MAPBOX_API_KEY } from '@/constants';
import { User, Spot } from '../app/types';

interface ProfileProps {
  isOpen: boolean,
  onClose: () => void
};

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sampleSpot: Spot = {
    id: '2VAhg1nW6BTCrOHNwUTl',
    name: 'Raleigh City Hall',
    regionName: 'Fayetteville Street',
    latitude: 35.77857823433585,
    longitude: -78.64296843800201,
  };

  const sampleRecentSpots: Spot[] = [sampleSpot, sampleSpot, sampleSpot];

  const sampleUser: User = {
    name: "Samhith Kakarla",
    email: "samhith.kakarla@gmail.com",
    dateJoined: "03/14/2024",
    currentSpot: sampleSpot,
    reservedFrom: '5:30',
    reservedTo: '6:30',
    performanceStyles: ['Singing', 'Juggling', 'Electric Guitar'],
    recentSpots: sampleRecentSpots
  };

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-center">
      <div className="flex flex-row">
          <div className="bg-gray-100 border-2 border-gray-200 w-full rounded-md pb-16">
            <div className="bg-zinc-700 px-6 py-5 flex flex-col rounded-t-md">
              <div className="flex flex-row justify-between items-center w-full">
                <LiaTimesSolid size={15} color="white" onClick={onClose} />
                <button className="text-white font-semibold text-xs rounded-md bg-purple-600 border-2 border-purple-700 px-2 py-2">
                  Logout
                </button>
              </div>
              <div className="flex flex-row items-center my-3 pr-10 pl-4">
                <Image src={logo} alt="logo" width={75} height={75} />
                <div className="flex flex-col ml-5">
                  <h1 className="text-white font-semibold text-lg">{sampleUser.name}</h1>
                  <h1 className="text-white font-light text-sm mt-2">{sampleUser.email}</h1>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between mt-5 mx-5">
              <h1 className="text-black font-medium text-xs">Date Joined: {sampleUser.dateJoined} </h1>
            </div>
            <div className="flex flex-row items-center mt-6 mx-5">
              <h1 className="text-black font-medium text-sm">My Current Spot: </h1>
              <h1 className="text-black font-semibold text-sm ml-2">{sampleUser.currentSpot.name}</h1>
            </div>
            <Map
              mapboxAccessToken={MAPBOX_API_KEY}
              initialViewState={{
                longitude: sampleUser.currentSpot.longitude,
                latitude: sampleUser.currentSpot.latitude,
                zoom: 10
              }}
              maxBounds={[
                [-78.65855724798772, 35.769623580355734],
                [-78.62039725622377, 35.792861226084234]
              ]}
              style={{ 
                width: 325, 
                height: 100,
                marginLeft: 20,
                marginTop: 25,
              }}
              mapStyle="mapbox://styles/mapbox/standard"
            >
              <Marker 
                key={sampleUser.currentSpot.id} 
                latitude={sampleUser.currentSpot.latitude} 
                longitude={sampleUser.currentSpot.longitude}
              >
                <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
              </Marker>
            </Map>
            <div className="flex flex-row justify-between mx-5 mt-8">
              <div className="flex flex-col">
                <div className="flex flex-row items-center">
                  <h1 className="text-black text-sm font-light">
                    Reserved from:
                  </h1>
                  <h1 className="text-black text-sm font-semibold ml-2">
                    {sampleUser.reservedFrom} - {sampleUser.reservedTo}
                  </h1>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <h1 className="text-black text-sm font-light">
                    Time until reservation ends:
                  </h1>
                  <h1 className="text-black text-sm font-semibold ml-2">
                    {'0:27'}
                  </h1>
                </div>
              </div>
              <button className="text-white font-semibold text-xs rounded-md bg-red-600 border-2 border-red-600 px-2 mr-4">
                Leave Spot
              </button>
            </div>
            <div className="flex flex-col mt-10 mx-5">
              <div className="flex flex-row items-center">
                <h1 className="text-black font-medium text-sm">My Performance Styles </h1>
                <MdModeEdit size={20} color="black" className="ml-2" />
              </div>
              <div className="flex flex-row flex-wrap mt-5">
                {sampleUser.performanceStyles.map((item: any) => (
                  <div className="rounded bg-purple-500 py-2 px-4 mr-2 w-auto">
                    <h1 className="text-xs text-white font-medium">{item}</h1>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
    </div>
  );
};

export default Profile;
