import React from 'react';
import { LiaTimesSolid } from 'react-icons/lia';

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
          <h1 className="text-center font-bold text-2xl text-white">ERROR</h1>
          <h3 className="text-center font-light text-base text-white mt-5">
            {availability ? 
              'There was an error reserving this spot. Please try again.' : 
              'This spot is unavailable at this time. Please try again.'
            }
          </h3>
          <button 
            className=" hover:bg-slate-200 bg-slate-100 text-black font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
            onClick={onClose}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveError;