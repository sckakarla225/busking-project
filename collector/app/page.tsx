'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { MdLocationOn, MdFileUpload } from 'react-icons/md'

import { Spot } from './types';
import { createSpot, uploadSpotMedia } from '../firebase';
import logo from './logo.png';

export default function Home() {
  const [spotName, setSpotName] = useState('');
  const [coordLat, setCoordLat] = useState<number | null>(null);
  const [coordLong, setCoordLong] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [locationError, setLocationError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const getLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        setCoordLat(position.coords.latitude);
        setCoordLong(position.coords.longitude);
      });
      setLocationError('');
    } else {
      console.log("error getting location");
      setLocationError('Location unavailable. Try again.');
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const sendSpot = async () => {
    try {
      if (coordLat && coordLong && spotName !== '') {
        const spot: Spot = {
          name: spotName,
          latitude: coordLat,
          longitude: coordLong,
        };
        const spotId = await createSpot(spot);
        if (files.length !== 0) {
          const result = await uploadSpotMedia(spotId, files);
          if (result == "Fail") {
            setUploadError('Invalid data. Try again.');
          } 
        };
        setSpotName('');
        setCoordLat(null);
        setCoordLong(null);
        setFiles([]);
      } else {
        setUploadError('Invalid data. Try again.');
      }
    } catch (error) {
      console.log(error);
      setUploadError('Error uploading spot. Try again.');
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
        <div className="flex flex-col mx-auto mt-10">
          <h1 className="font-semibold text-black mb-2">Spot Name</h1>
          <input 
            type="text" 
            value={spotName} 
            onChange={(e) => setSpotName(e.target.value)}
            className="mb-4 shadow appearance-none border bg-gray-100 rounded w-full py-3 px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
            placeholder="Enter Spot Name"
          />
          <div className="flex flex-row items-center mb-2 mt-5">
            <h1 className="font-semibold text-black mr-5">Get Coordinates</h1>
            <button onClick={getLocation} className="p-1 rounded-md border-2 border-purple-700 bg-purple-600">
              <MdLocationOn size={20} color="white" />
            </button>
          </div>
          <div className="flex flex-row items-center mt-3 w-full">
            <div className="w-1/2 bg-gray-100 border-2 border-gray-200 text-center py-3 mr-2 rounded-md">
              {coordLat ? (
                <h1 className="text-gray-700 font-light text-md">{coordLat}</h1>
              ) : (
                <h1 className="text-gray-700 font-light text-md">{0.0}</h1>
              )}
            </div>
            <div className="w-1/2 bg-gray-100 border-2 border-gray-200 text-center py-3 ml-2 rounded-md">
              {coordLong ? (
                <h1 className="text-gray-700 font-light text-md">{coordLong}</h1>
              ) : (
                <h1 className="text-gray-700 font-light text-md">{0.0}</h1>
              )}
            </div>
          </div>
          {locationError && <p className="text-red-600 font-medium mt-3 text-center">{locationError}</p>}
          <div className="flex flex-row items-center mb-4 mt-10">
            <h1 className="font-semibold text-black mr-5">Upload Media</h1>
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange} 
              ref={fileInputRef} 
              className="hidden" 
            />
            <button onClick={handleClick} className="p-1 rounded-md border-2 border-purple-700 bg-purple-600">
              <MdFileUpload size={20} color="white" />
            </button>
          </div>
          {files.length == 0 && (
            <p className="text-sm font-medium text-black">No media uploaded.</p>
          )}
          {files.map((file, index) => (
            <p key={index} className="text-sm font-medium text-black">
              {file.type + "- " + file.name}
            </p>
          ))}
          <button 
            className=" hover:bg-purple-600 bg-purple-500 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline mt-10"
            onClick={sendSpot}
          >
            Send Spot
          </button>
          {uploadError && <p className="text-red-600 font-medium mt-3 text-center">{uploadError}</p>}
        </div>
      </section>
    </main>
  )
}