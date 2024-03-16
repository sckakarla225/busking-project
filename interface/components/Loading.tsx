import React from 'react';
import Image from 'next/image';

interface LoadingProps {
  isLoading: boolean,
};

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-center items-center mx-4">
      <div className="flex flex-row">
        <Image src={'/logos/spotlite-icon.png'} alt="logo" width={60} height={60} className="animate-spin" />
      </div>
    </div>
  );
};

export default Loading;