'use client'

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { IoEyeSharp } from 'react-icons/io5';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { auth } from '../../firebase/firebaseConfig';
import { AppDispatch } from '@/redux/store';
import { login, logout } from '@/redux/reducers/auth';
import { loadUser, resetUser } from '@/redux/reducers/performer';
import { loadSpots, resetSpots } from '@/redux/reducers/spots';
import { createUser, getSpots } from '@/api';
import { Loading } from '@/components';
import logo from '../logo.png';

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const options: string[] = [
    'Singing', 
    'Guitar', 
    'Drums',
    'Keyboard',
    'Violin',
    'Saxophone',
    'Harmonica',
    'Banjo',
    'Fiddle',
    'Organ',
    'Jazz',
    'Mandola',
    'Sound Mixing',
    'Looping',
    'Painting & Art',
    'Games'
  ]

  const handleSelection = (item: string) => {
    setSelectedItems((prevSelectedItems: any) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((currentItem: any) => currentItem !== item);
      } 
      else if (prevSelectedItems.length < 3) {
        return [...prevSelectedItems, item];
      } 
      else {
        return prevSelectedItems;
      }
    });
  }

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
          name,
          selectedItems
        );
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
        };
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
  }

  return (
    <>
      <Loading isLoading={loading} />
      <main className={`flex min-h-screen flex-col ${loading ? 'opacity-40' : ''}`}>
        <nav className= "border-gray-200 bg-zinc-800">
          <div className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl p-4">
            <div className="flex flex-row items-center">
              <Link href="/" className="flex items-center">
                <Image src={logo} alt="logo" width={35} height={35} />
              </Link>
            </div>
          </div>
        </nav>
        <section className="px-16 py-10">
          <h1 className="justify-center text-black text-xl font-bold pt-24">
            Start your Busking Journey!
          </h1>
          <form onSubmit={handleRegister} className="flex flex-col mx-auto mt-10">
            <h1 className="font-semibold text-black mb-2">Your Name</h1>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="mb-4 shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
              placeholder="Name"
            />
            <h1 className="font-semibold text-black mb-2 mt-2">Your Email</h1>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
              placeholder="Email"
            />
            <h1 className="font-semibold text-black mb-2 mt-2">Set a Password</h1>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"
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
            <div className="flex flex-row mb-2 mt-2 items-end">
              <h1 className="font-semibold text-black">What do you perform?</h1>
              <p className="font-normal text-black text-xs ml-2 mb-1">(Select up to 3)</p>
            </div>
            <div className="relative">
              <div className="shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline">
                {selectedItems.length !== 0 ? (
                  <div className="flex flex-row flex-wrap w-3/4">
                    {selectedItems.map((item: any) => (
                      <div className="rounded bg-purple-500 py-2 px-4 ml-2 w-auto mb-2">
                        <h1 className="text-xs text-white font-medium">{item}</h1>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <h1 className="text-gray-700 italic text-xs">None Selected</h1>
                  </>
                )}
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                  onClick={() => setShowDropdown(!showDropdown)}
                  data-dropdown-toggle="dropdownDefaultCheckbox"
                >
                  <MdKeyboardArrowDown size={20} />
                </button>
              </div>
              <div 
                className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                hidden={!showDropdown}
              >
                <div className="px-4 flex flex-col" role="menu" aria-orientation="vertical">
                  {options.map((option: string) => (
                    <div className="flex flex-row justify-between items-center py-3">
                      <div className="block text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        {option}
                      </div>
                      <input 
                        type="checkbox"
                        checked={selectedItems.includes(option)}
                        onChange={() => handleSelection(option)}
                        className="form-checkbox h-4 w-4 text-purple-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              type="submit"
              className=" hover:bg-purple-600 bg-purple-500 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline mt-10"
            >
              Get Started
            </button>
            {error && <p className="text-red-600 font-medium mt-4 text-center">{error}</p>}
            <div className="flex flex-row items-center justify-center mt-10 mb-2">
              <p className=" text-gray-700 text-sm font-light">Already a performer?</p>
              <Link href="/login">
                <p className="text-gray-700 text-sm font-semibold ml-2">Login</p>
              </Link>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}