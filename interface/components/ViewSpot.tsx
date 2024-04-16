import React from 'react';
import Link from 'next/link';
import { IoCheckbox } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { FaPersonWalking } from 'react-icons/fa6';
import { LiaTimesSolid } from 'react-icons/lia';
import { AiFillSound } from 'react-icons/ai';

interface ViewSpotProps {
  isOpen: boolean,
  onClose: () => void,
  spotId: string,
  spotName: string,
  region: string,
  selectedTime: string | null,
  availability: boolean,
  activity: number,
  sound: number,
  isIdeal: boolean
};

const ViewSpot: React.FC<ViewSpotProps> = ({ 
  isOpen, 
  onClose,
  spotId,
  spotName,
  region,
  selectedTime,
  availability,
  activity,
  sound,
  isIdeal 
}) => {
  if (!isOpen) return null;
  
  let activityString = '';
  switch(activity) {
    case 1:
      activityString = 'Low';
      break;
    case 2:
      activityString = 'Medium';
      break;
    case 3:
      activityString = 'High';
      break;
    default:
      activityString = '';
  };
  let soundLevelString = '';
  switch (sound) {
    case 1:
      soundLevelString = 'Low';
      break;
    case 2:
      soundLevelString = 'High';
      break;
    default:
      soundLevelString = '';
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-end px-5">
      <div className="bg-slate-100 border-2 border-slate-200 w-full px-6 py-4 rounded-md mb-8">
        <div className="flex flex-row justify-start">
          <LiaTimesSolid 
            onClick={onClose}
            size={15}
          />
        </div>
        <div className="grid grid-cols-2 mt-5">
          <div>
            <h1 className="text-sm text-black font-eau-regular">Spot Name:</h1>
            <h1 className="text-base text-black font-eau-heavy mr-2">{spotName}</h1>
            <h1 className="text-xs text-black font-eau-regular mt-3">Region:</h1>
            <h1 className="text-sm text-black font-eau-heavy">{region}</h1>
          </div>
          <div>
            <div className="flex flex-row items-center">
              <IoCheckbox size={20} color="black" />
              <h1 className="font-eau-regular ml-1 text-xs">
                {availability ? `Available @ ${selectedTime}` : `Unavailable @ ${selectedTime}`}
              </h1>
            </div>
            <div className="flex flex-row items-center mt-4">
              <FaPersonWalking size={20} color="black" />
              <h1 className="font-eau-regular ml-1 text-xs">
                {`
                  ${activityString !== '' && activityString}
                  Activity @ ${selectedTime}
                `}
              </h1>
            </div>
            <div className="flex flex-row items-center mt-4">
              <AiFillSound size={20} color="black" />
              <h1 className="font-eau-regular ml-1 text-xs">
                {`
                  ${soundLevelString !== '' && soundLevelString}
                  Sounds @ ${selectedTime}
                `}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center mt-6">
          <div className="bg-spotlite-dark-purple border-4 border-spotlite-light-purple rounded-full flex flex-row items-center justify-center p-2">
            <FaStar size={20} className="text-spotlite-pink" />
          </div>
          <div className="flex flex-row items-center ml-3">
            <h1 className="font-eau-regular text-sm text-black">Your Fit:</h1>
            <h1 className="font-eau-medium text-xl text-black ml-3">
              {isIdeal ? 'Great' : 'Not Great'}
            </h1>
          </div>
        </div>
        <div className="w-full">
          <Link href={`/spot/${spotId}`}>
            <button 
              className="hover:bg-opacity-80 bg-spotlite-dark-purple text-white font-black py-3 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
              // onClick={() => logSpotViewed(userId, spotId)}
            >
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewSpot;