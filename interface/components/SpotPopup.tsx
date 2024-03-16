import React from 'react';
import Link from 'next/link';
import { IoCheckbox } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';

interface SpotPopupProps {
  spotId: string,
  spotName: string,
  region: string,
  selectedTime: string | null,
  availability: boolean,
  activity: number
};

const SpotPopup: React.FC<SpotPopupProps> = ({
  spotId, spotName, region, selectedTime, availability, activity
}) => {
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

  return (
    <div className="bg-white px-4 py-2 flex flex-col justify-between">
      <div className="mt-5 mb-5">
        <h1 className="text-black font-eau-light text-xs">Spot Name:</h1>
        <h1 className="text-black font-eau-medium text-base mt-1">{spotName}</h1>
        <h1 className="text-black font-eau-light text-xs mt-3">Region:</h1>
        <h1 className="text-black font-eau-medium text-sm mt-1">{region}</h1>
        <div className="flex flex-row items-center mt-7">
          <IoCheckbox size={20} color="black" />
          <h1 className="font-eau-regular ml-2 text-xs">
            {availability ? `Available @ ${selectedTime}` : `Unavailable @ ${selectedTime}`}
          </h1>
        </div>
        <div className="flex flex-row items-center mt-4">
          <FaStar size={20} color="black" />
          <h1 className="font-eau-regular ml-2 text-xs">
            {`
              ${activityString !== '' && activityString}
              Activity @ ${selectedTime}
            `}
          </h1>
        </div>
      </div>
      <div>
        <Link href={`/spot/${spotId}`}>
          <button 
            className=" hover:bg-opacity-80 bg-spotlite-dark-purple text-white font-black py-3 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
          >
            View
          </button>
        </Link>
      </div>
    </div>
  )
};

export default SpotPopup;