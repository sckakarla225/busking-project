"use client";

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, redirect } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image'
import Link from 'next/link';
import Map, { Marker, Popup } from 'react-map-gl';
import { HiMiniUserCircle } from 'react-icons/hi2';
import { TbMapPinPlus } from 'react-icons/tb';
import { MdLogout } from 'react-icons/md';

import { 
  TimeSlider, 
  Profile, 
  Key,
  SpotMarker,
  SpotPopup,
  Loading 
} from '../components';
import { auth } from '@/firebase/firebaseConfig';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { logout } from '@/redux/reducers/auth';
import { resetUser } from '@/redux/reducers/performer';
import { changeSelectedTime, resetSpots } from '@/redux/reducers/spots';
import { predictSpots } from '@/api';
import { MAPBOX_API_KEY } from '@/constants';
import { 
  logViewMapPage, 
  logSpotClicked,
  logTimeViewed,
  logKeyClicked,
  logProfileViewed 
} from '@/firebase/analytics';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [spots, setSpots] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isKeyOpen, setIsKeyOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userId = useAppSelector((state) => state.auth.userId);
  const email = useAppSelector((state) => state.auth.email);
  const name = useAppSelector((state) => state.performer.name);
  const dateJoined = useAppSelector((state) => state.performer.dateJoined);
  const performanceStyles = useAppSelector((state) => state.performer.performanceStyles);
  const currentSpot = useAppSelector((state) => state.performer.currentSpot);
  const recentSpots = useAppSelector((state) => state.performer.recentSpots);
  const spotsInfo = useAppSelector((state) => state.spots.spots);

  function convertTime12to24(time12h: string): [number, number] {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return [hours, minutes];
  }

  function checkTimeWithinReservation(startTime: Date, endTime: Date, givenTime: string): boolean {
      const givenDateTime = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        ...convertTime12to24(givenTime)
      );

      return givenDateTime >= startTime && givenDateTime <= endTime;
  }

  const getCurrentDate = (): { dateString: string, dayOfWeek: string } => {
    const currentDate = new Date();
    const daysOfWeek: string[] = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const dayOfWeek: string = daysOfWeek[currentDate.getDay()];
    const month = String(currentDate.getMonth() + 1);
    const day = String(currentDate.getDate());
    const year = String(currentDate.getFullYear()).slice(-2);

    const dateString = `${month}/${day}/${year}`;
    console.log(dateString);
    return { dateString, dayOfWeek };
  };

  const logoutUser = async () => {
    await signOut(auth);
    dispatch(logout());
    dispatch(resetUser());
    dispatch(resetSpots());
    router.push('/login');
  };

  const logTimeToAnalytics = () => {
    if (selectedTime) {
      logTimeViewed(userId, selectedTime);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    logViewMapPage();
  }, []);

  useEffect(() => {
    setLoading(true);

    const { dateString, dayOfWeek } = getCurrentDate();
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
          }
        })
      };

      console.log(processedSpots);
      return processedSpots;
    }

    const processedSpots: any[] = [];
    const predictionInputs: any[] = [];
    if (selectedTime) {
      dispatch(changeSelectedTime({ selectedTime: selectedTime }));
      spotsInfo.map((spotInfo) => {
        let isReserved = false;
        spotInfo.reservations.map((reservation) => {
          const startTime = new Date(reservation.startTime);
          const endTime = new Date(reservation.endTime);

          const spotReserved = checkTimeWithinReservation(
            startTime, 
            endTime, 
            selectedTime
          );
          if (spotReserved) {
            isReserved = true;
          }
        });

        const processedSpot = {
          ...spotInfo,
          availability: !isReserved,
        };
        const predictionInput = {
          spotId: spotInfo.spotId,
          latitude: spotInfo.latitude,
          longitude: spotInfo.longitude,
          date: dateString,
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
  }, [selectedTime]);

  return (
    <>
      <Loading isLoading={loading} />
      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        name={name}
        email={email}
        dateJoined={dateJoined}
        performanceStyles={performanceStyles}
        currentSpot={currentSpot}
        recentSpots={recentSpots}
        startLoading={() => setLoading(true)} 
        stopLoading={() => setLoading(false)}
      />
      <main className={`
        relative w-screen h-screen 
        ${isProfileOpen ? 'opacity-50' : ''}
        ${loading ? 'opacity-40' : ''}
      `}>
        <nav className="absolute top-0 left-0 z-10 w-full border-gray-200 bg-zinc-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-3 px-8">
            <div className="flex flex-row items-center">
              <Link href="/" className="flex items-center">
                <Image src={'/logos/spotlite-icon.png'} alt="logo" width={30} height={30} />
              </Link>
            </div>
            <div className="flex flex-row items-center">
              <HiMiniUserCircle 
                size={25} 
                color="white" 
                onClick={() => {
                  setIsProfileOpen(true);
                  logProfileViewed();
                }} 
              />
              <MdLogout 
                size={20} 
                color="white" 
                className="ml-4"
                onClick={() => logoutUser()} 
              />
            </div>
          </div>
        </nav>
        <div className="absolute top-20 left-5 z-10 px-3 py-2 border-4 border-opacity-80 border-spotlite-light-purple bg-spotlite-light-purple rounded-lg">
          <div className="flex flex-row items-center justify-center">
            <p className="text-white font-semibold text-xs">{selectedTime}</p>
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
        <Key isOpen={isKeyOpen} onClose={() => setIsKeyOpen(!isKeyOpen)} />
        <div className="absolute bottom-32 px-5 z-10 w-full">
          <TimeSlider 
            updateSelectedTime={(newTime) => setSelectedTime(newTime)}
            logTime={() => logTimeToAnalytics()} 
          />
        </div>
        <Map
          mapboxAccessToken={MAPBOX_API_KEY}
          initialViewState={{
            longitude: -78.63913983214495,
            latitude: 35.78055856250403,
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
                  logSpotClicked(userId, spot.spotId);
                }}
              >
                <SpotMarker 
                  size={spot.spotSize} 
                  availability={spot.availability} 
                  activity={spot.activity}
                />
              </Marker>
            ))
          )}
          {selectedSpot && (
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
          )}
        </Map>
      </main>
    </>
  )
};
