import React from 'react';
import { LiaTimesSolid } from 'react-icons/lia';

interface KeyProps {
  isOpen: boolean,
  onClose: () => void
};

const Key: React.FC<KeyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="flex flex-col px-4 py-4 pb-6 pl-5 bg-spotlite-light-purple border-2 border-spotlite-light-purple border-opacity-80 rounded-md">
      <div className="flex flex-row justify-end">
        <LiaTimesSolid size={15} color="black" onClick={onClose} />
      </div>
      {/* <div className="flex flex-row items-center mt-2">
        <h1 className="text-white font-eau-bold text-xs">Spot Size:</h1>
        <div className="flex flex-row items-end ml-3">
          <div className="flex flex-col justify-center items-center">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-purple-900"></div>
            <h1 className="text-white font-semibold mt-1 text-xs">1</h1>
          </div>
          <div className="flex flex-col justify-center items-center ml-2">
            <div className="w-7 h-7 rounded-full bg-white border-2 border-purple-900"></div>
            <h1 className="text-white font-semibold mt-1 text-xs">2</h1>
          </div>
          <div className="flex flex-col justify-center items-center ml-2">
            <div className="w-5 h-5 rounded-full bg-white border-2 border-purple-900"></div>
            <h1 className="text-white font-semibold mt-1 text-xs">3</h1>
          </div>
        </div>
      </div> */}
      <div className="flex flex-row items-center mt-3">
        <h1 className="text-white font-eau-bold text-xs">Spot Availability:</h1>
        <div className="flex flex-row items-center ml-3">
          <div className="w-6 h-6 rounded-full bg-white border-2 border-zinc-800"></div>
          <div className="w-6 h-6 rounded-full bg-spotlite-dark-purple border-2 border-zinc-800 ml-3"></div>
        </div>
      </div>
      <div className="flex flex-row items-center mt-7">
        <h1 className="text-white font-eau-bold text-xs">Spot Activity:</h1>
        <div className="flex flex-row items-center ml-3">
          <div className="flex flex-col justify-center items-center">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-purple-900 flex items-center justify-center">
              <div className="w-[75%] h-[75%] rounded-full bg-white border-2 border-spotlite-dark-purple animate-wave flex items-center justify-center">
                <div className="w-[60%] h-[60%] rounded-full bg-white border-2 border-spotlite-dark-purple animate-wave"></div>
              </div>
            </div>
            <h1 className="text-white font-eau-medium mt-1 text-xs">High</h1>
          </div>
          <div className="flex flex-col justify-center items-center ml-3">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-purple-900 flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full bg-white border-2 border-spotlite-dark-purple animate-wave flex items-center justify-center"></div>
            </div>
            <h1 className="text-white font-eau-medium mt-1 text-xs">Low</h1>
          </div>
          {/* <div className="flex flex-col justify-center items-center ml-2">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-purple-900"></div>
            <h1 className="text-white font-eau-medium mt-1 text-xs">Low</h1>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Key;