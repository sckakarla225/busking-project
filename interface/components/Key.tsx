import React from 'react';

interface KeyProps {
  isOpen: boolean,
  onClose: () => void
};

const Key: React.FC<KeyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-5 ml-48 h-40 top-36 inset-0 z-20 flex justify-center items-center px-4 py-3 bg-zinc-300 border-2 border-zinc-400 rounded-md">
      
    </div>
  );
};

export default Key;