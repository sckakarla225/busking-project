'use client'

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { IoEyeSharp } from 'react-icons/io5';

import { auth } from '../../firebase/firebaseConfig';
import { useAuth } from '../../firebase/useAuth';
import { AppDispatch } from '@/redux/store';
import { login, logout } from '@/redux/reducers/auth';
import { loadUser, resetUser } from '@/redux/reducers/performer';
import { loadSpots, resetSpots } from '@/redux/reducers/spots';
import { getUser, getSpots } from '@/api';
import logo from '../logo.png';

export default function Login() {
  const user = useAuth();
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
      await signInWithEmailAndPassword(auth, email, password);
      console.log(user?.email + 'is logged in');
      if (user?.email && user?.uid) {
        dispatch(login({ userId: user?.uid, email: user?.email }));
        console.log("loaded to state");
        const userInfo = await getUser(user?.uid);
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
      router.push('/');
      setLoading(false);
    } catch (error: any) {
      console.log(error.code);
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
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <nav className= "border-gray-200 bg-zinc-800">
        <div className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl p-4">
          <div className="flex flex-row items-center">
            <a href="/" className="flex items-center">
              <Image src={logo} alt="logo" width={35} height={35} />
            </a>
          </div>
        </div>
      </nav>
      <section className="px-16 py-10">
        <h1 className="justify-center text-black text-3xl font-bold pt-24">
          Welcome Back!
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col mx-auto mt-16">
          <h1 className="font-semibold text-black mb-2">Email</h1>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
            placeholder="Your Email"
          />
          <h1 className="font-semibold text-black mb-2 mt-2">Password</h1>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"
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
            className=" hover:bg-purple-600 bg-purple-500 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline mt-10"
          >
            Login
          </button>
          {error && <p className="text-red-600 font-medium mt-4 text-center">{error}</p>}
          <div className="flex flex-row items-center justify-center mb-2 mt-10">
            <p className=" text-gray-700 text-sm font-light">Not a performer yet?</p>
            <Link href="/register">
              <p className="text-gray-700 text-sm font-semibold ml-2">Get Started</p>
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}