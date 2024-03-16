import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { MdKeyboardArrowLeft } from 'react-icons/md';

interface ReserveErrorProps {
  isOpen: boolean,
  onClose: () => void,
  availability: boolean | null
};

const ReserveError: React.FC<ReserveErrorProps> = ({ isOpen, onClose, availability }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-center px-20">
      <div className="flex flex-row">
        <div className="bg-red-600 border-4 border-red-700 rounded-md px-4 py-5">
          <FaTimesCircle color="white" className="mx-auto" size={50} />
          <h1 className="text-center mt-8 font-eau-bold text-xl text-white">ERROR</h1>
          <h3 className="text-center font-eau-light text-sm text-white mt-2">
            {availability ? 
              'There was an error reserving this spot. Please try again.' : 
              'This spot is unavailable at this time. Please try again.'
            }
          </h3>
          <button 
            className=" hover:bg-opacity-80 bg-slate-100 text-black flex justify-center font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
            onClick={onClose}
          >
            <MdKeyboardArrowLeft size={30} color="black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveError;