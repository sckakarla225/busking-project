import React from 'react';
import Image from 'next/image';
import { LiaTimesSolid } from 'react-icons/lia';
import { MdModeEdit } from 'react-icons/md';

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
  recentSpots: Object[] | any[]
};

const Profile: React.FC<ProfileProps> = ({ 
  isOpen, onClose, name, email, dateJoined, performanceStyles, currentSpot, recentSpots 
}) => {
  if (!isOpen) return null;

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
  }

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-center">
      <div className="flex flex-row">
        <div className="bg-gray-100 border-2 border-gray-200 w-full rounded-md pb-16">
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
            <h1 className="text-black font-semibold text-sm ml-2">
              {currentSpot.name ? currentSpot.name : 'None'}
            </h1>
          </div>
          {currentSpot.name ? (
            <div className="flex flex-row justify-between mx-5 mt-8">
              <div className="flex flex-col">
                <div className="flex flex-row items-center">
                  <h1 className="text-black text-sm font-light">
                    Reserved from:
                  </h1>
                  <h1 className="text-black text-sm font-semibold ml-2">
                    {
                      currentSpot.reservedFrom.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    } - 
                    {
                      currentSpot.reservedTo.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    }
                  </h1>
                </div>
                <div className="flex flex-row items-center mt-2">
                  <h1 className="text-black text-sm font-light">
                    Time until reservation ends:
                  </h1>
                  <h1 className="text-black text-sm font-semibold ml-2">
                    {calculateTimeLeft(currentSpot.reservedTo)}
                  </h1>
                </div>
              </div>
              <button className="text-white font-semibold text-xs rounded-md bg-red-600 border-2 border-red-600 px-2 mr-4">
                Leave Spot
              </button>
            </div>
          ) : (
            <div className="bg-purple-600 border-2 border-purple-700 w-5/6 mx-5 py-5 px-3 rounded-md mt-4">
              <h1 className="italic font-semibold text-white">Browse the map and select a spot!</h1>
            </div>
          )}
          
          <div className="flex flex-col mt-10 mx-5">
            <div className="flex flex-row items-center">
              <h1 className="text-black font-medium text-sm">My Performance Styles</h1>
              <MdModeEdit size={20} color="black" className="ml-2" />
            </div>
            <div className="flex flex-row flex-wrap mt-5">
              {performanceStyles.map((item: any) => (
                <div className="rounded bg-purple-500 py-2 px-4 mr-2 w-auto">
                  <h1 className="text-xs text-white font-medium">{item}</h1>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col mt-10 mx-5">
            <div className="flex flex-row items-center">
              <h1 className="text-black font-medium text-sm">My Recent Spots</h1>
            </div>
            <div className="flex flex-row flex-wrap mt-5">
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
