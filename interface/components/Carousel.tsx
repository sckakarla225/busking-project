import React, { useRef } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { 
  BsSpeakerFill, 
  BsMusicNoteBeamed,
  BsGearWideConnected 
} from 'react-icons/bs';

interface CarouselProps {
  items: string[],
  type: 'instruments' | 'audio' | 'staging',
  selectedItems: string[],
  setSelectedItems: (item: string) => void
};

const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  type,
  selectedItems,
  setSelectedItems  
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      if (direction === 'right') {
        carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
      } else {
        carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth;
      }
    }
  };

  return (
    <div className="flex items-center">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scroll-smooth snap-none touch-pan-x w-full space-x-4"
      >
        {items.map((item, index) => (
          <div key={index} className="shrink-0 flex justify-center items-center">
            <div 
              className={`
                flex flex-col items-center justify-center shadow rounded-lg h-24 w-24
                ${selectedItems.includes(item) ? 'bg-spotlite-light-purple' : 'bg-white'}
              `}
              onClick={() => setSelectedItems(item)}
            >
              {type == 'instruments' && (
                <BsMusicNoteBeamed 
                  size={25} 
                  className={`${selectedItems.includes(item) ? 'text-white' : 'text-black'}`} 
                />
              )}
              {type == 'audio' && (
                <BsSpeakerFill 
                  size={25} 
                  className={`${selectedItems.includes(item) ? 'text-white' : 'text-black'}`} 
                />
              )}
              {type == 'staging' && (
                <BsGearWideConnected 
                  size={25} 
                  className={`${selectedItems.includes(item) ? 'text-white' : 'text-black'}`} 
                />
              )}
              <div 
                className={`
                  mt-4 text-xs font-medium
                  ${selectedItems.includes(item) ? 'text-white' : 'text-black'}
                `}
              >
                {item}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="ml-2 py-2 px-2"
        onClick={() => scroll('right')}
      >
        <MdKeyboardArrowRight size={20} color="black" />
      </button>
    </div>
  );
};

export default Carousel;