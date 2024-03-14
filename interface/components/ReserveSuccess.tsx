import React from 'react';
import { useRouter } from 'next/navigation';
import { LiaTimesSolid } from 'react-icons/lia';

interface ReserveSuccessProps {
  isOpen: boolean,
  onClose: () => void
};

const ReserveSuccess: React.FC<ReserveSuccessProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const router = useRouter();

  const goBackToMap = () => {
    onClose();
    router.push('/')
  };

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-center">
      <div className="flex flex-row">
        <div className="bg-purple-600 border-4 border-purple-700 rounded-md px-8 py-5">
          <h1 className="text-center font-bold text-2xl text-white">SUCCESS</h1>
          <h3 className="text-center font-light text-base text-white mt-5">
            Your spot was reserved!
          </h3>
          <button 
            className=" hover:bg-slate-200 bg-slate-100 text-black font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
            onClick={goBackToMap}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveSuccess;