'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { IoEyeSharp } from 'react-icons/io5';

import { auth } from '../../firebase/firebaseConfig';
import { AppDispatch } from '@/redux/store';
import { login, logout } from '@/redux/reducers/auth';
import { loadUser, resetUser } from '@/redux/reducers/performer';
import { loadSpots, resetSpots } from '@/redux/reducers/spots';
import { createUser, getSpots } from '@/api';
import { Loading } from '@/components';
import { logViewRegisterPage } from '@/firebase/analytics';

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCred.user;

      if (newUser.email && newUser.uid) {
        dispatch(login({ userId: newUser.uid, email: newUser.email }));
        const userInfo = await createUser(
          newUser.uid,
          newUser.email,
          name
        );
        if (userInfo.success) {
          const name = userInfo.data.name;
          const dateJoined = userInfo.data.dateJoined;
          const recentSpots = userInfo.data.recentSpots;
          const currentSpot = userInfo.data.currentSpot;
          const setupComplete = userInfo.data.setupComplete;
          dispatch(loadUser({
            name: name,
            dateJoined: dateJoined,
            setupComplete: setupComplete,
            recentSpots: recentSpots,
            currentSpot: currentSpot
          }));
          const spots = await getSpots();
          if (spots.success) {
            dispatch(loadSpots({ spots: spots.data }));
          };
          if (!setupComplete) {
            setLoading(false);
            router.push('/setup');
          } else {
            setLoading(false);
            router.push('/');
          }
        } else {
          setLoading(false);
          setError('Unknown error. Please try again later.');
          dispatch(logout());
          dispatch(resetUser());
          dispatch(resetSpots());
        }
      };
    } catch (error: any) {
      setLoading(false);
      switch (error.code) {
        case 'auth/missing-email':
          setError('Please enter an email.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email.');
          break;
        case 'auth/missing-password':
          setError('Please enter a password.');
          break;
        case 'auth/invalid-password':
          setError('Please enter a valid password.');
          break;
        case 'auth/email-already-in-use':
          setError('User already exists. Please login.');
          break;
        default:
          setError('Unknown error.');
      };
      dispatch(logout());
      dispatch(resetUser());
      dispatch(resetSpots());
    }
  };

  useEffect(() => {
    logViewRegisterPage();
  }, []);

  return (
    <>
      <Loading isLoading={loading} />
      <main className={`flex min-h-screen flex-col ${loading ? 'opacity-40' : ''}`}>
        <nav className= "border-gray-200 bg-zinc-800">
          <div className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl p-3">
            <div className="flex flex-row items-center">
              <Link href="/" className="flex items-center">
                <Image src={'/logos/spotlite-icon.png'} alt="logo" width={30} height={30} />
              </Link>
            </div>
          </div>
        </nav>
        <section className="px-16 py-6 md:px-96">
          <h1 className="justify-center text-black text-2xl font-eau-bold pt-20">
            Start Busking!
          </h1>
          <form onSubmit={handleRegister} className="flex flex-col mx-auto mt-8">
            <h1 className="font-eau-medium text-black mb-2 text-sm">Your Name</h1>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="text-base mb-4 shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
              placeholder="Name"
            />
            <h1 className="font-eau-medium text-black mb-2 mt-2 text-sm">Your Email</h1>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="text-base mb-4 shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
              placeholder="Email"
            />
            <h1 className="font-eau-medium text-black mb-2 mt-2 text-sm">Set a Password</h1>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="text-base shadow-sm appearance-none border border-gray-200 bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IoEyeSharp size={20} />
                </button>
              </div>
            </div>
            <button 
              type="submit"
              className=" hover:bg-opacity-80 bg-spotlite-dark-purple text-base text-white font-eau-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline mt-10"
            >
              Get Started
            </button>
            {error && <p className="text-red-600 font-medium mt-4 text-center">{error}</p>}
            <div className="flex flex-row items-center justify-center mt-7 mb-2">
              <p className=" text-gray-700 text-sm font-eau-light">Already a performer?</p>
              <Link href="/login">
                <p className="text-gray-700 text-sm font-eau-medium ml-2">Login</p>
              </Link>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}