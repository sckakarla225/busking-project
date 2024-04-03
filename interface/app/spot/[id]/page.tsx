'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, redirect } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MdLogout, 
  MdKeyboardArrowLeft 
} from 'react-icons/md';

import { 
  SpotInfo, 
  SpotGraphics,
  ReserveError,
  ReserveSuccess,
  Loading 
} from '@/components';
import { auth } from '@/firebase/firebaseConfig';
import { predictSpot, getTimeSlots } from '@/api';
import { useAppSelector, AppDispatch } from '@/redux/store';
import { logout } from '@/redux/reducers/auth';
import { resetUser } from '@/redux/reducers/performer';
import { resetSpots } from '@/redux/reducers/spots';

export default function Spot(
  { params }: { params: { id: string } }
) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const allSpots = useAppSelector((state) => state.spots.spots);
  const selectedTime = useAppSelector((state) => state.spots.selectedTime);
  const selectedDate = useAppSelector((state) => state.spots.selectedDate);
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

  function reformatDateString(dateStr: string): string {
    const dateParts = dateStr.split('/').map(part => parseInt(part, 10));
    const yearShort = dateParts[2] % 100;
    return `${dateParts[0]}/${dateParts[1]}/${yearShort < 10 ? '0' + yearShort : yearShort}`;
  }

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

    const checkTimeSlots = async (spotId: string) => {
      const timeSlots = await getTimeSlots();
      let isAvailable = false;

      if (timeSlots.success) {
        const slots = timeSlots.data;
        slots.map((slot: any) => {
          let convertedTime = new Date(slot.startTime);
          convertedTime = new Date(convertedTime.getTime() + 0 * 60 * 60 * 1000);
          const formattedTime = convertedTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          const formattedDate = selectedDate;
          if (
            spotId === slot.spotId &&
            selectedTime === formattedTime &&
            formattedDate === slot.date
          ) {
            console.log(isAvailable);
            if (!slot.performerId) {
              isAvailable = true;
            }
          };
        });
      };
      return isAvailable;
    }

    const getPrediction = async (spotInfo: any) => {
      const dateString = reformatDateString(selectedDate);
      const dayOfWeek = getDayOfWeek(selectedDate);
      const predictionInput = {
        spotId: spotInfo.spotId,
        latitude: spotInfo.latitude,
        longitude: spotInfo.longitude,
        date: dateString,
        time: selectedTime,
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

    if (allSpots.length !== 0) {
      const spotInfo = allSpots.find((spot) => spot.spotId === params.id);
      if (spotInfo) {
        setSpotId(spotInfo.spotId);
        setSpotName(spotInfo.name);
        setSpotRegion(spotInfo.region);
        setSpotLatitude(spotInfo.latitude);
        setSpotLongitude(spotInfo.longitude);

        getPrediction(spotInfo)
          .then((activityLevelNum: number) => {
            if (activityLevelNum == 1) {
              setSpotAvailability(false);
            } else {
              checkTimeSlots(spotInfo.spotId)
                .then((isAvailable: boolean) => {
                  setSpotAvailability(isAvailable);
                })
                .catch(() => {
                  setActivityLevel(activityLevelNum);
                  setLoading(false);
                });
            }
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
              <MdKeyboardArrowLeft 
                size={30} 
                color="white"
                onClick={() => router.back()} 
              />
              <Link href="/" className="flex items-center ml-5">
                <Image src={'/logos/spotlite-icon.png'} alt="logo" width={30} height={30} />
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