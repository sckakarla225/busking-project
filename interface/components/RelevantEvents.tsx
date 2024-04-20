import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LiaTimesSolid } from 'react-icons/lia';

import { EventInfo } from '@/components';
import { Event } from '../app/types';
import { getNearbyEvents } from '@/api';
import { useAppSelector } from '@/redux/store';

interface RelevantEventsProps {
  isOpen: boolean,
  onClose: () => void,
  latitude: number | null,
  longitude: number | null,
};

const RelevantEvents: React.FC<RelevantEventsProps> = ({ 
  isOpen, 
  onClose,
  latitude,
  longitude 
}) => {
  const selectedDate = useAppSelector((state) => state.spots.selectedDate);
  const [loading, setLoading] = useState(true);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);

  useEffect(() => {
    const setupNearbyEvents = async () => {
      console.log(latitude, longitude);
      const nearbyEvents = await getNearbyEvents(selectedDate, latitude, longitude);
      if (nearbyEvents.success) {
        return nearbyEvents.data;
      };
    };

    setupNearbyEvents()
      .then((nearbyEvents) => {
        console.log(nearbyEvents);
        setNearbyEvents(nearbyEvents);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [latitude, longitude]);

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
              {nearbyEvents && nearbyEvents.length !== 0 ? (
                nearbyEvents.map((event: Event, index) => (
                  <EventInfo 
                    key={index}
                    eventName={event.name}
                    eventVenue={event.venue}
                    distanceFromSpot={75}
                    startTime={event.startTime}
                    endTime={event.endTime}
                    tags={event.tags}
                  />
                ))
              ) : (
                <>
                  <h1 className="font-eau-regular text-sm mr-32">No events found.</h1>
                </>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelevantEvents;