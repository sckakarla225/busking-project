'use client';

import React, { useState, useEffect } from 'react';

import { Navbar, TimeSlotView, Loading } from '@/components';
import { TimeSlot } from '../types';
import { SAMPLE_TIME_SLOTS } from '@/constants';

export default function TimingsList() {
  const [loading, setLoading] = useState(false);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSpotName, setSelectedSpotName] = useState('');

  function getNextSevenDays(): string[] {
    const dates = [];
    const currentDate = new Date();
  
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(currentDate.getTime());
      nextDate.setDate(currentDate.getDate() + i);
      const day = String(nextDate.getDate()).padStart(2, '0');
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      dates.push(`${month}/${day}`);
    }
  
    return dates;
  };

  const options = [
    'All Spots',
    'Raleigh Convention Center',
    'Weaver Street Market',
    'Lichtin Plaza',
    'City Plaza',
    'Capitol Building'
  ];

  useEffect(() => {
    setFilteredTimeSlots(SAMPLE_TIME_SLOTS);
  }, []);

  useEffect(() => {
    // TODO: Update filtered time slots accordingly
  }, [selectedDate, selectedSpotName]);

  return (
    <>
      <Loading isLoading={loading} />
      <main className={`relative w-screen h-screen ${loading ? 'opacity-50' : ''}`}>
        <Navbar />
        <section className="px-10 py-28">
          <div className="flex flex-row justify-between space-x-2">
            <div className="relative">
              <select
                className="appearance-none bg-spotlite-light-purple text-white text-xs font-bold py-3 pl-4 pr-8 rounded leading-tight focus:outline-none"
                name="date"
                id="date-selector"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {getNextSevenDays().map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-slate-200 font-eau-medium text-black text-xs font-bold py-3 pl-3 pr-8 rounded leading-tight border-2 border-slate-300"
                name="date"
                id="date-selector"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  outline: 'none',
                }}
                value={selectedSpotName}
                onChange={(e) => setSelectedSpotName(e.target.value)}
              >
                {options.map((option: string, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full rounded-sm bg-white border-2 border-white mt-3">
            {filteredTimeSlots.length !== 0 ? (
              <>
                {filteredTimeSlots.map((timeSlot) => {
                  if (!timeSlot.performerId) {
                    return (
                      <TimeSlotView 
                        spotId={timeSlot.spotId}
                        spotName={timeSlot.spotName}
                        spotRegion={timeSlot.spotDistrict}
                        date={timeSlot.date}
                        startTime={timeSlot.startTime}
                        endTime={timeSlot.endTime}
                        activityLevel={timeSlot.activityLevel}
                      />
                    )
                  }
                })}
              </>
            ) : (
              <h1 className="my-5 mx-3 text-black font-eau-medium text-base">No results found.</h1>
            )}
          </div>
        </section>
      </main>
    </>
  );
};