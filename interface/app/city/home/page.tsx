'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { TimeSlotView, Loading } from '@/components';
import { TimeSlot } from '@/app/types';
import { getTimeSlots } from '@/api';

export default function CityHome() {
  const [loading, setLoading] = useState(false);
  const [activeTimeSlots, setActiveTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    setLoading(true);
    const setupTimeSlots = async () => {
      const timeSlotsData = await getTimeSlots();
      if (timeSlotsData.success) {
        const timeSlots = timeSlotsData.data;
        const promises = timeSlots.map(async (timeSlot: any) => {
          if (timeSlot.performerId) {
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

            return {
              ...timeSlot,
              startTime: formattedTime, 
              endTime: formattedEndTime, 
              activityLevel: 3,
            }
          } else {
            return null;
          }
        });

        const resolvedTimeSlots = (await Promise.all(promises)).filter(ts => ts !== null);
        console.log(resolvedTimeSlots);
        setLoading(false);
        return resolvedTimeSlots
      };
      return [];
    };

    setupTimeSlots()
      .then((resolvedTimeSlots: any[]) => setActiveTimeSlots(resolvedTimeSlots))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Loading isLoading={loading} />
      <main className={`flex min-h-screen flex-col ${loading ? 'opacity-50' : ''}`}>
        <nav className= "border-gray-200 bg-zinc-800">
          <div className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl p-3">
            <div className="flex flex-row items-center">
              <Link href="/" className="flex items-center">
                <Image src={'/logos/spotlite-icon.png'} alt="logo" width={30} height={30} />
              </Link>
            </div>
          </div>
        </nav>
        <section className="px-16 py-20">
          <h1 className="text-black font-eau-bold text-base">Active Time Slots</h1>
          <div className="w-full rounded-sm bg-white border-2 border-white mt-3">
            {activeTimeSlots.length !== 0 ? (
              <>
                {activeTimeSlots.map((timeSlot, index) => {
                  if (timeSlot.performerId) {
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
                        reserveSuccess={() => {}}
                        reserveFail={() => {}}
                        isIdeal={true}
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
  )
}