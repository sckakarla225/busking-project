'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoEyeSharp } from 'react-icons/io5';

import logo from '../logo.png';

export default function CityLogin() {
  const [cityID, setCityID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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
        <form className="flex flex-col mx-auto mt-40">
          <h1 className="font-semibold text-black mb-2">City ID</h1>
          <input 
            type="text" 
            value={cityID} 
            onChange={(e) => setCityID(e.target.value)}
            className="mb-4 shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
            placeholder="Enter ID"
          />
          <h1 className="font-semibold text-black mb-2 mt-2">City Password</h1>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Password"
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
            className=" hover:bg-purple-600 bg-purple-500 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline mb-10 mt-10"
          >
            Enter
          </button>
          {error && <p>{error}</p>}
        </form>
      </section>
    </main>
  )
}