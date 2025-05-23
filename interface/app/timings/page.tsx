'use client';

import React, { useState, useEffect } from 'react';

import { 
  Navbar, 
  TimeSlotView, 
  Loading,
  ReserveSuccess,
  ReserveError 
} from '@/components';
import { TimeSlot } from '../types';
import { getTimeSlots, predictSpot } from '@/api';
import { useAppSelector } from '@/redux/store';
import { SPOTS_TIME_SLOTS_OPTIONS } from '@/constants';

export default function TimingsList() {
  const allSpots = useAppSelector((state) => state.spots.spots);
  const savedSpotName = useAppSelector((state) => state.spots.selectedSpotName);
  const savedDate = useAppSelector((state) => state.spots.selectedDate);
  const [loading, setLoading] = useState(false);
  const [allTimeSlots, setAllTimeSlots] = useState<TimeSlot[]>([]);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    // savedDate !== '' 
    //   ? savedDate.replace('/2024', '') 
    //   : new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).slice(0, 5)
    new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).slice(0, 5)
  );
  const [selectedSpotName, setSelectedSpotName] = useState<string>(
    // savedSpotName !== '' ? savedSpotName : 'All Spots'
    'All Spots'
  );
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpError, setSignUpError] = useState(false);

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

  function getDayOfWeek(dateStr: string): string {
    const daysOfWeek = [
      'Sunday', 
      'Monday', 
      'Tuesday', 
      'Wednesday', 
      'Thursday', 
      'Friday', 
      'Saturday'
    ];
    const date = new Date(dateStr);
    return daysOfWeek[date.getDay()];
  };

  const getPrediction = async (
    spotInfo: any, 
    timeStr: string, 
    dateStr: string
  ) => {
    const dayOfWeek = getDayOfWeek(dateStr);
    const predictionInput = {
      spotId: spotInfo.spotId,
      latitude: spotInfo.latitude,
      longitude: spotInfo.longitude,
      date: dateStr,
      time: timeStr,
      day: dayOfWeek
    };

    const activityLevel = await predictSpot(predictionInput);
    let activityLevelNum: number;
    switch (activityLevel.data) {
      case "Low":
        activityLevelNum = 1;
        break;
      case "Medium":
        activityLevelNum = 2;
        break;
      case "High":
        activityLevelNum = 3;
        break;
      default:
        activityLevelNum = 0;
    };

    return activityLevelNum;
  };

  useEffect(() => {
    const setupTimeSlots = async () => {
      try {
        setLoading(true); 
        console.log("getting timeslots for timings");
        const timeSlotsData = await getTimeSlots();
        if (timeSlotsData.success) {
          const timeSlots = timeSlotsData.data;
          const promises = timeSlots.map(async (timeSlot: any) => {
            if (!timeSlot.performerId) {
              const spotInfo = allSpots.find((spot) => spot.spotId === timeSlot.spotId);
              if (spotInfo) {
                let convertedTime = new Date(timeSlot.startTime);
                let convertedEndTime = new Date(timeSlot.endTime);
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
                const formattedDate = new Date(timeSlot.date).toLocaleDateString(
                  'en-US', 
                  { year: '2-digit', month: 'numeric', day: 'numeric' }
                );

                const activityLevel = await getPrediction(spotInfo, formattedTime, formattedDate);
                return { 
                  ...timeSlot, 
                  startTime: formattedTime, 
                  endTime: formattedEndTime, 
                  activityLevel: activityLevel 
                };
              };
            } else {
              return null;
            }
          });

          const resolvedTimeSlots = (await Promise.all(promises)).filter(ts => ts !== null);
          setAllTimeSlots(resolvedTimeSlots);
          const currDate = new Date().toLocaleDateString(
            'en-US', 
            { 
              month: '2-digit', day: '2-digit' 
            }).slice(0, 5);
          const filtered = resolvedTimeSlots.filter(timeSlot => timeSlot.date === currDate + '/2024');
          setFilteredTimeSlots(filtered);
        }
      } catch (error) {
        console.error("Failed to load time slots:", error);
      } finally {
        console.log("done loading spots");
        setLoading(false);
      }
    };

    setupTimeSlots();
  }, []);

  useEffect(() => {
    setLoading(true);
    let filtered = allTimeSlots.filter(timeSlot => timeSlot.date === selectedDate + '/2024');
    if (selectedSpotName !== 'All Spots') {
      filtered = filtered.filter(timeSlot => timeSlot.spotName === selectedSpotName);
    }
    
    filtered.sort((a, b) => b.isIdeal === true ? 1 : -1);
    setFilteredTimeSlots(filtered);
    setLoading(false);
    // setLoading(true);
    // const filtered = allTimeSlots.filter(timeSlot => timeSlot.date === selectedDate + '/2024');
    // if (selectedSpotName !== 'All Spots') {
    //   const filteredAgain = filtered.filter(timeSlot => timeSlot.spotName === selectedSpotName);
    //   setFilteredTimeSlots(filteredAgain);
    // } else {
    //   setFilteredTimeSlots(filtered);
    // };
    // setLoading(false);
  }, [selectedDate, selectedSpotName, allTimeSlots]);

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
                {SPOTS_TIME_SLOTS_OPTIONS.map((option: string, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full rounded-sm bg-white border-2 border-white mt-3">
            {filteredTimeSlots.length !== 0 ? (
              <>
                {filteredTimeSlots.map((timeSlot, index) => {
                  if (!timeSlot.performerId) {
                    return (
                      <TimeSlotView
                        key={index}
                        timeSlotId={timeSlot.timeSlotId} 
                        spotId={timeSlot.spotId}
                        spotName={timeSlot.spotName}
                        spotRegion={timeSlot.spotRegion}
                        date={timeSlot.date}
                        startTime={timeSlot.startTime}
                        endTime={timeSlot.endTime}
                        activityLevel={timeSlot.activityLevel}
                        isIdeal={timeSlot.isIdeal ? timeSlot.isIdeal : false}
                        reserveSuccess={() => setSignUpSuccess(true)}
                        reserveFail={() => setSignUpError(true)}
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