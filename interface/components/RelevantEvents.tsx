import React from 'react';
import { LiaTimesSolid } from 'react-icons/lia';

import { EventInfo } from '@/components';

interface RelevantEventsProps {
  isOpen: boolean,
  onClose: () => void
};

const RelevantEvents: React.FC<RelevantEventsProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-center py-28 px-5">
      <div className="flex flex-row">
        <div className="bg-slate-100 border-4 border-slate-200 rounded-md py-5 overflow-y-auto">
          <div className="flex flex-row items-center justify-end px-3">
            <LiaTimesSolid 
              size={15}
              onClick={onClose} 
            />
          </div>
          <div className="px-5 mt-3">
            <h1 className="text-black text-base font-eau-medium text-left">Nearby Events:</h1>
            <div className="flex flex-col mt-4">
              <EventInfo 
                eventName={'21Marbles: PARTYology'}
                eventVenue={'Marbles Kids Museum'}
                distanceFromSpot={75}
                startTime={'6:30 PM'}
                endTime={'9:30 PM'}
                tags={['Children', 'Play', 'Exhibit']}
              />
              <EventInfo 
                eventName={'21Marbles: PARTYology'}
                eventVenue={'Marbles Kids Museum'}
                distanceFromSpot={75}
                startTime={'6:30 PM'}
                endTime={'9:30 PM'}
                tags={['Children', 'Play', 'Exhibit']}
              />
              <EventInfo 
                eventName={'21Marbles: PARTYology'}
                eventVenue={'Marbles Kids Museum'}
                distanceFromSpot={75}
                startTime={'6:30 PM'}
                endTime={'9:30 PM'}
                tags={['Children', 'Play', 'Exhibit']}
              />
              <EventInfo 
                eventName={'21Marbles: PARTYology'}
                eventVenue={'Marbles Kids Museum'}
                distanceFromSpot={75}
                startTime={'6:30 PM'}
                endTime={'9:30 PM'}
                tags={['Children', 'Play', 'Exhibit']}
              />
              <EventInfo 
                eventName={'21Marbles: PARTYology'}
                eventVenue={'Marbles Kids Museum'}
                distanceFromSpot={75}
                startTime={'6:30 PM'}
                endTime={'9:30 PM'}
                tags={['Children', 'Play', 'Exhibit']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelevantEvents;