import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

interface ReserveSuccessProps {
  isOpen: boolean,
  onClose: () => void
};

const ReserveSuccess: React.FC<ReserveSuccessProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const goBackToMap = () => {
    onClose();
    router.push('/')
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-center">
      <div className="flex flex-row">
        <div className="bg-spotlite-light-purple border-4 border-spotlite-light-purple border-opacity-80 rounded-md px-8 py-5">
          <FaCheckCircle color="white" className="mx-auto" size={50} />
          <h1 className="text-center mt-8 font-eau-bold text-xl text-white">SUCCESS</h1>
          <h3 className="text-center font-eau-light text-sm text-white mt-2">
            Your spot was reserved!
          </h3>
          <button 
            className=" hover:bg-opacity-80 bg-spotlite-orange text-black font-bold py-3 flex justify-center rounded-md focus:outline-none focus:shadow-outline mt-10 w-full"
            onClick={goBackToMap}
          >
            <MdKeyboardArrowRight size={30} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveSuccess;