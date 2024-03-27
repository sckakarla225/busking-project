'use client';

import React from 'react';

import { Navbar } from '@/components';

export default function Profile() {
  return (
    <>
      <main className={`relative w-screen h-screen `}>
        <Navbar />
        <section className="px-10 py-16">
          <h1>Profile Screen</h1>
        </section>
      </main>
    </>
  );
};