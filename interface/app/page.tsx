"use client";

import { AppState } from '@/redux/store';
import Image from 'next/image'
import { useSelector } from 'react-redux';

export default function Home() {
  const userId = useSelector((state: AppState) => state.auth.userId);
  const userEmail = useSelector((state: AppState) => state.auth.email);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="mx-auto justify-center text-purple-800 text-xl font-bold">HOME</h1>
      <h1 className="mx-auto justify-center text-purple-800 text-xl font-bold">{userId !== '' ? userId : 'not loaded'}</h1>
      <h1 className="mx-auto justify-center text-purple-800 text-xl font-bold">{userEmail}</h1>
    </main>
  )
}
