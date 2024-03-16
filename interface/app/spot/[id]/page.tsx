'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, redirect } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { MdLogout } from 'react-icons/md';

import { 
  SpotInfo, 
  SpotGraphics,
  ReserveError,
  ReserveSuccess,
  Loading 
} from '@/components';
import { auth } from '@/firebase/firebaseConfig';
import { predictSpot } from '@/api';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { logout } from '@/redux/reducers/auth';
import { resetUser } from '@/redux/reducers/performer';
import { resetSpots } from '@/redux/reducers/spots';
import logo from '../../logo.png';

export default function Spot(
  { params }: { params: { id: string } }
) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const allSpots = useAppSelector((state) => state.spots.spots);
  const selectedTime = useAppSelector((state) => state.spots.selectedTime);
  const [spotId, setSpotId] = useState<string>('');
  const [spotName, setSpotName] = useState<string>('');
  const [spotRegion, setSpotRegion] = useState<string>('');
  const [spotLatitude, setSpotLatitude] =  useState<number | null>(null);
  const [spotLongitude, setSpotLongitude] = useState<number | null>(null);
  const [spotAvailability, setSpotAvailability] = useState<boolean | null>(null);
  const [activityLevel, setActivityLevel] = useState<number | null>(null);
  const [reserveErrorOpen, setReserveErrorOpen] = useState(false);
  const [reserveSuccessOpen, setReserveSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    setLoading(true);

    const getPrediction = async (spotInfo: any) => {
      const { dateString, dayOfWeek } = getCurrentDate();
      const predictionInput = {
        spotId: spotInfo.spotId,
        latitude: spotInfo.latitude,
        longitude: spotInfo.longitude,
        date: dateString,
        time: selectedTime,
        day: dayOfWeek
      };

      const activityLevel = await predictSpot(predictionInput);
      console.log(activityLevel);
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

    if (allSpots.length !== 0) {
      const spotInfo = allSpots.find((spot) => spot.spotId === params.id);
      if (spotInfo) {
        setSpotId(spotInfo.spotId);
        setSpotName(spotInfo.name);
        setSpotRegion(spotInfo.region);
        setSpotLatitude(spotInfo.latitude);
        setSpotLongitude(spotInfo.longitude);
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
        setSpotAvailability(!isReserved);
        getPrediction(spotInfo)
          .then((activityLevelNum: number) => {
            setActivityLevel(activityLevelNum);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      };
    }
  }, [selectedTime]);

  return (
    <>
      <Loading isLoading={loading} />
      <ReserveSuccess 
        isOpen={reserveSuccessOpen}
        onClose={() => setReserveSuccessOpen(false)}
      />
      <ReserveError 
        isOpen={reserveErrorOpen}
        onClose={() => setReserveErrorOpen(false)}
        availability={spotAvailability}
      />
      <main className={`
        relative w-screen h-screen 
        ${reserveSuccessOpen ? 'opacity-50' : ''}
        ${reserveErrorOpen ? 'opacity-50': ''}
        ${loading ? 'opacity-40': ''}
      `}>
        <nav className= " border-gray-200 bg-zinc-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-3 px-8">
            <div className="flex flex-row items-center">
              <Link href="/" className="flex items-center">
                <Image src={'/logos/spotlite-icon.PNG'} alt="logo" width={30} height={30} />
              </Link>
            </div>
            <MdLogout 
              size={20} 
              color="white" 
              className="ml-4"
              onClick={() => logoutUser()} 
            />
          </div>
        </nav>
        <div className="absolute bottom-20 z-10 px-16 w-full mx-auto">
          <SpotInfo
            spotId={spotId} 
            name={spotName}
            region={spotRegion}
            latitude={spotLatitude}
            longitude={spotLongitude}
            startTime={selectedTime}
            activity={activityLevel}
            availability={spotAvailability}
            openSuccessPopup={() => setReserveSuccessOpen(true)}
            openErrorPopup={() => setReserveErrorOpen(true)}
            startLoading={() => setLoading(true)}
            stopLoading={() => setLoading(false)}
          />
        </div>
        <SpotGraphics 
          spotId={params.id} 
        />
      </main>
    </>
  )
}