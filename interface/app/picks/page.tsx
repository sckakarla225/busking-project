'use client';

import React, { useState } from 'react';

import { 
  Loading, 
  Navbar, 
  ReserveSuccess, 
  ReserveError,
  Pick 
} from '@/components';

export default function PicksList() {
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const [selectedDate, setSelectedDate] = useState('04/19/2024');

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
          <h1 className="font-eau-bold text-xl text-black">Your Picks for 4/19 - 4/21</h1>
          <div className="flex flex-row items-center mt-5 justify-between">
            <div 
              className={`
                px-4 py-2 cursor-pointer rounded-md border-2
                ${selectedDate == '04/19/2024' 
                  ? 'bg-spotlite-dark-purple border-spotlite-dark-purple border-opacity-50'
                  : 'bg-slate-100 border-slate-200'
                }
              `}
              onClick={() => setSelectedDate('04/19/2024')}
            >
              <h1 
                className={`
                  font-medium text-xs
                  ${selectedDate == '04/19/2024' ? 'text-white' : 'text-gray-700'}
                `}
              >
                Fri, 4/19
              </h1>
            </div>
            <div 
              className={`
                px-4 py-2 cursor-pointer rounded-md border-2
                ${selectedDate == '04/20/2024' 
                  ? 'bg-spotlite-dark-purple border-spotlite-dark-purple border-opacity-50'
                  : 'bg-slate-100 border-slate-200'
                }
              `}
              onClick={() => setSelectedDate('04/20/2024')}
            >
              <h1 
                className={`
                  font-medium text-xs
                  ${selectedDate == '04/20/2024' ? 'text-white' : 'text-gray-700'}
                `}
              >
                Sat, 4/20
              </h1>
            </div>
            <div 
              className={`
                px-4 py-2 cursor-pointer rounded-md border-2
                ${selectedDate == '04/21/2024' 
                  ? 'bg-spotlite-dark-purple border-spotlite-dark-purple border-opacity-50'
                  : 'bg-slate-100 border-slate-200'
                }
              `}
              onClick={() => setSelectedDate('04/21/2024')}
            >
              <h1 
                className={`
                  font-medium text-xs
                  ${selectedDate == '04/21/2024' ? 'text-white' : 'text-gray-700'}
                `}
              >
                Sun, 4/21
              </h1>
            </div>
          </div>
          <div className="mt-5">
            <Pick 
              spotId={''}
              spotName={'Raleigh Convention Center'}
              spotRegion={'Fayetteville Street'}
              date={selectedDate}
              events={[
                'PrideExpo 2024', 'First Friday', 'Head Shaving Event'
              ]}
              startTime={'4:00 PM'}
              endTime={'5:00 PM'}
              activityLevel={3}
            />
            <Pick 
              spotId={''}
              spotName={'Raleigh Convention Center'}
              spotRegion={'Fayetteville Street'}
              date={selectedDate}
              events={[
                'PrideExpo 2024', 'First Friday', 'Head Shaving Event'
              ]}
              startTime={'4:00 PM'}
              endTime={'5:00 PM'}
              activityLevel={3}
            />
            <Pick 
              spotId={''}
              spotName={'Raleigh Convention Center'}
              spotRegion={'Fayetteville Street'}
              date={selectedDate}
              events={[
                'PrideExpo 2024', 'First Friday', 'Head Shaving Event'
              ]}
              startTime={'4:00 PM'}
              endTime={'5:00 PM'}
              activityLevel={3}
            />
          </div>
        </section>
      </main>
    </>
  );
};