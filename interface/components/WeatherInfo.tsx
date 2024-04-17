import React from 'react';
import Image from 'next/image';
import { LiaTimesSolid } from 'react-icons/lia';
import { FaWind, FaSun } from 'react-icons/fa';

interface WeatherInfoProps {
  isOpen: boolean,
  onClose: () => void,
  temperature: number,
  winds: string,
  sunCoverage: string
};

const WeatherInfo: React.FC<WeatherInfoProps> = ({ 
  isOpen, 
  onClose,
  temperature,
  winds,
  sunCoverage 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-center py-80 px-5">
      <div className="flex flex-row">
        <div className="bg-slate-100 border-4 border-slate-200 rounded-md py-5">
          <div className="flex flex-row items-center justify-start px-3">
            <LiaTimesSolid 
              size={15}
              onClick={onClose} 
            />
          </div>
          <div className="px-5 mt-3 flex flex-row items-center">
            <div className="flex flex-row">
              <Image src={'/weather/partly-cloudy.png'} alt="weather" width={100} height={100} />
            </div>
            <div className="flex flex-col ml-6">
              <div className="flex flex-col">
                <h1 className="text-black font-eau-medium text-xs">Expected Temperature: </h1>
                <h1 className="text-black font-bold text-3xl">{temperature}&deg;F</h1>
              </div>
              <div className="flex flex-row items-center mt-4">
                <FaWind size={20} className="text-sky-400" />
                <h1 className="text-black font-eau-medium text-sm ml-4">Winds:</h1>
                <h1 className="text-black font-eau-bold ml-2 text-sm">{winds}</h1>
              </div>
              <div className="flex flex-row items-center mt-4">
                <FaSun size={20} className="text-amber-500" />
                <h1 className="text-black font-eau-medium text-sm ml-4">Sun Coverage:</h1>
                <h1 className="text-black font-eau-bold ml-2 text-sm">{sunCoverage}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;