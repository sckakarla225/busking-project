'use client';

import React, { useState, useEffect } from 'react';

import { 
  Loading, 
  Navbar, 
  ReserveSuccess, 
  ReserveError,
  Pick 
} from '@/components';
import { getPicks } from '@/api/timeslots';

export default function PicksList() {
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const [selectedDate, setSelectedDate] = useState('04/26/2024');
  const [allPicks, setAllPicks] = useState<any[]>([]);
  const [filteredPicks, setFilteredPicks] = useState<any[]>([]);

  useEffect(() => {
    const setupPicks = async () => {
      const picks = await getPicks();
      if (picks.success) {
        return picks.data;
      } else {
        return [];
      };
    };

    setupPicks()
      .then((picks: any[]) => {
        setAllPicks(picks);
        const filtered = picks.filter((pick) => pick.date === selectedDate);
        setFilteredPicks(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = allPicks.filter((pick) => pick.date === selectedDate);
    setFilteredPicks(filtered);
  }, [selectedDate]);

  return (
    <>
      <ReserveSuccess 
        isOpen={signUpSuccess}
        onClose={() => setSignUpSuccess(false)}
      />
      <ReserveError 
        isOpen={signUpError}
        onClose={() => setSignUpError(false)}
        availability={true}
      />
      <Loading isLoading={loading} />
      <main className={`
        relative w-screen h-screen 
        ${loading ? 'opacity-50' : ''}
        ${signUpSuccess ? 'opacity-50': ''}
        ${signUpError ? 'opacity-50' : ''}
      `}>
        <Navbar />
        <section className="px-10 md:px-96 py-28">
          <h1 className="font-eau-bold text-xl text-black">Your Picks for 4/26 - 4/28</h1>
          <div className="flex flex-row items-center mt-5 justify-between">
            <div 
              className={`
                px-4 py-2 cursor-pointer rounded-md border-2
                ${selectedDate == '04/26/2024' 
                  ? 'bg-spotlite-dark-purple border-spotlite-dark-purple border-opacity-50'
                  : 'bg-slate-100 border-slate-200'
                }
              `}
              onClick={() => setSelectedDate('04/26/2024')}
            >
              <h1 
                className={`
                  font-medium text-xs
                  ${selectedDate == '04/26/2024' ? 'text-white' : 'text-gray-700'}
                `}
              >
                Fri, 4/26
              </h1>
            </div>
            <div 
              className={`
                px-4 py-2 cursor-pointer rounded-md border-2
                ${selectedDate == '04/27/2024' 
                  ? 'bg-spotlite-dark-purple border-spotlite-dark-purple border-opacity-50'
                  : 'bg-slate-100 border-slate-200'
                }
              `}
              onClick={() => setSelectedDate('04/27/2024')}
            >
              <h1 
                className={`
                  font-medium text-xs
                  ${selectedDate == '04/27/2024' ? 'text-white' : 'text-gray-700'}
                `}
              >
                Sat, 4/27
              </h1>
            </div>
            <div 
              className={`
                px-4 py-2 cursor-pointer rounded-md border-2
                ${selectedDate == '04/28/2024' 
                  ? 'bg-spotlite-dark-purple border-spotlite-dark-purple border-opacity-50'
                  : 'bg-slate-100 border-slate-200'
                }
              `}
              onClick={() => setSelectedDate('04/28/2024')}
            >
              <h1 
                className={`
                  font-medium text-xs
                  ${selectedDate == '04/28/2024' ? 'text-white' : 'text-gray-700'}
                `}
              >
                Sun, 4/28
              </h1>
            </div>
          </div>
          <div className="mt-5">
            {filteredPicks.map((pick: any, index) => {
              let convertedTime = new Date(pick.startTime);
              let convertedEndTime = new Date(pick.endTime);
              convertedTime = new Date(convertedTime.getTime() + 0 * 60 * 60 * 1000);
              convertedEndTime = new Date(convertedEndTime.getTime() + 0 * 60 * 60 * 1000);
              const formattedTime = convertedTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              const formattedEndTime = convertedEndTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              return (
                <Pick
                  key={index}
                  timeSlotId={pick.timeSlotId} 
                  spotId={pick.spotId}
                  spotName={pick.spotName}
                  spotRegion={pick.spotRegion}
                  date={pick.date}
                  events={pick.nearbyEvents}
                  startTime={formattedTime}
                  endTime={formattedEndTime}
                  activityLevel={3}
                  reserveSuccess={() => setSignUpSuccess(true)}
                  reserveFail={() => setSignUpError(true)}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};