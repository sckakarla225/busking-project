"use client";

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, redirect } from 'next/navigation';
import Map, { Marker, Popup } from 'react-map-gl';
import { TbMapPinPlus } from 'react-icons/tb';

import { 
  TimeSlider, 
  Key,
  SpotMarker,
  Loading,
  Navbar,
  ViewSpot 
} from '../components';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { 
  changeSelectedTime, 
  changeSelectedDate,
  loadTimeSlots 
} from '@/redux/reducers/spots';
import { predictSpots, getTimeSlots } from '@/api';
import { MAPBOX_API_KEY } from '@/constants';
import {
  logViewMapPage, 
  logSpotClicked,
  logTimeViewed,
  logKeyClicked,
} from '@/firebase/analytics';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [spots, setSpots] = useState<any[]>([]);
  const [isKeyOpen, setIsKeyOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }).slice(0, 5)
  );
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewSpotActive, setViewSpotActive] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const setupComplete = useAppSelector((state) => state.performer.setupComplete);
  const userId = useAppSelector((state) => state.auth.userId);
  const spotsInfo = useAppSelector((state) => state.spots.spots);
  const timeSlots = useAppSelector((state) => state.spots.timeSlots);

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

  function getDayOfWeekShort(dateStr: string): string {
    const daysOfWeek = [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ];
    const date = new Date(dateStr);
    return daysOfWeek[date.getDay()];
  };

  function reformatDateString(dateStr: string): string {
    const dateParts = dateStr.split('/').map(part => parseInt(part, 10));
    const yearShort = dateParts[2] % 100;
    return `${dateParts[0]}/${dateParts[1]}/${yearShort < 10 ? '0' + yearShort : yearShort}`;
  }

  const logTimeToAnalytics = () => {
    if (selectedTime) {
      logTimeViewed(userId, selectedTime);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    };
    if (!setupComplete) {
      redirect('/setup');
    }
  }, [isAuthenticated, setupComplete, router]);

  useEffect(() => {
    setLoading(true);
    console.log("getting timeslots initial");
    const setupTimeSlots = async () => {
      const timeSlots = await getTimeSlots();
      if (timeSlots.success) {
        return timeSlots.data
      } else {
        return []
      };
    };

    setupTimeSlots()
      .then((timeSlots) => {
        dispatch(loadTimeSlots({ timeSlots: timeSlots }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    logViewMapPage();
  }, []);

  useEffect(() => {
    setLoading(true);
    const setupPredictions = async (predictionInputs: any[], processedSpots: any[]) => {
      const predictions = await predictSpots(predictionInputs);
      if (predictions.data) {
        predictions.data.map((prediction: any) => {
          const parts = prediction.predictionKey.split("||");
          const spotId = parts[0];
          const spotToUpdate = processedSpots.find((spot) => spot.spotId === spotId);
          
          if (spotToUpdate) {
            let activityLevel: number;
            switch (prediction.predictionValue) {
              case "Low":
                activityLevel = 1;
                break;
              case "Medium":
                activityLevel = 2;
                break;
              case "High":
                activityLevel = 3;
                break;
              default:
                activityLevel = 0;
            };
            spotToUpdate.activity = activityLevel;
          };

          if (timeSlots.length !== 0 && spotToUpdate) {
            const slots = timeSlots;
            let isAvailable = false;
            let isIdeal = false;
            slots.map((slot: any) => {
              let convertedTime = new Date(slot.startTime);
              convertedTime = new Date(convertedTime.getTime() + 0 * 60 * 60 * 1000);
              const formattedTime = convertedTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              const formattedDate = selectedDate + '/2024';
              // if (!slot.performerId && spotToUpdate.activity !== 1) {
              //   isAvailable = true;
              // };
              if (
                spotToUpdate.spotId === slot.spotId &&
                selectedTime === formattedTime &&
                formattedDate === slot.date
              ) {
                if (!slot.performerId) {
                  isAvailable = true;
                }
                if (slot.isIdeal) {
                  isIdeal = true;
                }
              };
            });
            spotToUpdate.availability = isAvailable;
            spotToUpdate.isIdeal = isIdeal;
          };

          // spotToUpdate.availability = true;
        })
      };

      return processedSpots;
    }

    const processedSpots: any[] = [];
    const predictionInputs: any[] = [];
    if (selectedTime && selectedDate !== '') {
      const dateString = selectedDate + '/2024';
      const formattedDateString = reformatDateString(dateString);
      const dayOfWeek = getDayOfWeek(dateString);
      dispatch(changeSelectedTime({ selectedTime: selectedTime }));
      dispatch(changeSelectedDate({ selectedDate: dateString }));
      spotsInfo.map((spotInfo) => {
        const processedSpot = { ...spotInfo };
        const predictionInput = {
          spotId: spotInfo.spotId,
          latitude: spotInfo.latitude,
          longitude: spotInfo.longitude,
          date: formattedDateString,
          time: selectedTime,
          day: dayOfWeek
        };
        processedSpots.push(processedSpot);
        predictionInputs.push(predictionInput);
      });
    }

    setupPredictions(predictionInputs, processedSpots)
      .then((processedSpots) => {
        setSpots(processedSpots);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedTime, selectedDate]);

  return (
    <>
      <ViewSpot 
        isOpen={viewSpotActive}
        onClose={() => setViewSpotActive(!viewSpotActive)}
        spotId={selectedSpot && selectedSpot.spotId}
        spotName={selectedSpot && selectedSpot.name}
        region={selectedSpot && selectedSpot.region}
        selectedTime={selectedTime}
        availability={selectedSpot && selectedSpot.availability}
        activity={selectedSpot && selectedSpot.activity}
        sound={1}
        isIdeal={selectedSpot && selectedSpot.isIdeal}
      />
      <Loading isLoading={loading} />
      <main className={`
        relative w-screen h-screen 
        ${loading ? 'opacity-40' : ''}
        ${viewSpotActive ? 'opacity-80' : ''}
      `}>
        <Navbar />
        <div className="absolute top-20 left-5 z-10 flex flex-row items-center space-x-3">
          <div className="relative">
            <select
              className="appearance-none bg-spotlite-light-purple text-white text-xs md:text-sm font-bold py-3 pl-4 pr-8 rounded leading-tight focus:outline-none"
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
                <option key={date} value={date}>
                  {getDayOfWeekShort(date + '/2024')} - {date}
                </option>
              ))}
            </select>
          </div>
          <div className="px-3 py-2 border-4 border-opacity-80 border-spotlite-light-purple bg-spotlite-light-purple rounded-lg">
            <div className="flex flex-row items-center justify-center">
              <p className="text-white font-semibold text-xs md:text-sm">{selectedTime}</p>
            </div>
          </div>
        </div>
        <button 
          className="absolute top-20 right-5 z-10 px-3 py-2 border-2 border-opacity-80 border-spotlite-dark-purple bg-spotlite-dark-purple rounded-lg"
          onClick={() => {
            setIsKeyOpen(!isKeyOpen);
            logKeyClicked();
          }}
        >
          <div className="flex flex-row items-center justify-center">
            <TbMapPinPlus size={20} color="white" />
            <p className="text-white font-eau-medium text-sm ml-2">Key</p>
          </div>
        </button>
        <div className="absolute right-5 top-36 z-10">
          <Key isOpen={isKeyOpen} onClose={() => setIsKeyOpen(!isKeyOpen)} />
        </div>
        <div className="absolute bottom-32 px-5 z-10 w-full">
          <TimeSlider 
            updateSelectedTime={(newTime) => setSelectedTime(newTime)}
            logTime={() => logTimeToAnalytics()} 
          />
        </div>
        <Map
          mapboxAccessToken={MAPBOX_API_KEY}
          initialViewState={{
            longitude: -78.64117434142987,
            latitude: 35.773548310574924,
            zoom: 2
          }}
          maxBounds={[
            [-78.65855724798772, 35.769623580355734],
            [-78.62039725622377, 35.792861226084234]
          ]}
          style={{ width: '100%', height: '100%' }}
          pitch={45}
          mapStyle="mapbox://styles/sckakarla36/clrtwmjh800rh01o86wqfe7rx"
        >
          {spots.length !== 0 && (
            spots.map((spot: any) => (
              <Marker 
                key={spot.spotId}
                latitude={spot.latitude} 
                longitude={spot.longitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedSpot(spot);
                  setViewSpotActive(true);
                  logSpotClicked(userId, spot.spotId);
                }}
              >
                <SpotMarker 
                  size={spot.spotSize} 
                  availability={spot.availability} 
                  activity={spot.activity}
                  ideal={spot.isIdeal}
                />
              </Marker>
            ))
          )}
          {/* {selectedSpot && (
            <Popup 
              anchor="left" 
              latitude={selectedSpot.latitude} 
              longitude={selectedSpot.longitude}
              onClose={() => setSelectedSpot(null)}
            >
              <SpotPopup
                spotId={selectedSpot.spotId} 
                spotName={selectedSpot.name}
                region={selectedSpot.region}
                selectedTime={selectedTime}
                availability={selectedSpot.availability}
                activity={selectedSpot.activity}
              />
            </Popup>
          )} */}
        </Map>
      </main>
    </>
  )
};
