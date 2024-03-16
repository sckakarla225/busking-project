'use client'

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { IoEyeSharp } from 'react-icons/io5';

import { auth } from '../../firebase/firebaseConfig';
import { AppDispatch } from '@/redux/store';
import { login, logout } from '@/redux/reducers/auth';
import { loadUser, resetUser } from '@/redux/reducers/performer';
import { loadSpots, resetSpots } from '@/redux/reducers/spots';
import { getUser, getSpots } from '@/api';
import { Loading } from '@/components';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCred.user;

      if (loggedInUser.email && loggedInUser.uid) {
        dispatch(login({ userId: loggedInUser.uid, email: loggedInUser.email }));
        const userInfo = await getUser(loggedInUser.uid);
        if (userInfo.success) {
          const name = userInfo.data.name;
          const dateJoined = userInfo.data.dateJoined;
          const performanceStyles = userInfo.data.performanceStyles;
          const recentSpots = userInfo.data.recentSpots;
          const currentSpot = userInfo.data.currentSpot;
          dispatch(loadUser({
            name: name,
            dateJoined: dateJoined,
            performanceStyles: performanceStyles,
            recentSpots: recentSpots,
            currentSpot: currentSpot
          }));
        }
        const spots = await getSpots();
        if (spots.success) {
          dispatch(loadSpots({ spots: spots.data }));
        }
      };

      setLoading(false);
      router.push('/');
    } catch (error: any) {
      setLoading(false);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email.');
          break;
        case 'auth/missing-password':
          setError('Please enter a password.');
          break;
        case 'auth/invalid-password':
          setError('Please enter a valid password.');
          break;
        case 'auth/invalid-credential':
          setError('Incorrect email or password.');
          break;
        default:
          setError('Unknown error.');
      }
      dispatch(logout());
      dispatch(resetUser());
      dispatch(resetSpots());
    }
  };

  return (
    <>
      <Loading isLoading={loading} />
      <main className={`flex min-h-screen flex-col ${loading ? 'opacity-40' : ''}`}>
        <nav className= "border-gray-200 bg-zinc-800">
          <div className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl p-3">
            <div className="flex flex-row items-center">
              <Link href="/" className="flex items-center">
                <Image src={'/logos/spotlite-icon.PNG'} alt="logo" width={30} height={30} />
              </Link>
            </div>
          </div>
        </nav>
        <section className="px-16 py-8">
          <h1 className="justify-center text-black text-2xl font-eau-bold pt-24">
            Welcome Back!
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col mx-auto mt-8">
            <h1 className=" text-black mb-2 text-sm font-eau-medium">Email</h1>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm mb-4 shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
              placeholder="Your Email"
            />
            <h1 className=" text-black mb-2 mt-2 text-sm font-eau-medium">Password</h1>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm shadow-sm appearance-none border border-gray-200 bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your Password"
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
              className="text-base hover:bg-opacity-80 bg-spotlite-dark-purple text-white py-3 px-4 rounded focus:outline-none focus:shadow-outline mt-10 font-eau-bold"
            >
              Login
            </button>
            {error && <p className="text-red-600 font-medium mt-4 text-center">{error}</p>}
            <div className="flex flex-row items-center justify-center mb-2 mt-10">
              <p className=" text-gray-700 text-sm font-eau-light">Not a performer yet?</p>
              <Link href="/register">
                <p className="text-gray-700 text-sm font-eau-medium ml-2">Get Started</p>
              </Link>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}