'use client';

import React from 'react';

export default function Performance(
  { params }: { params: { id: string } }
) {
  return (
    <>
      <main className={`
        relative w-screen h-screen 
      `}>
        <section className="px-10 md:px-96 py-28">
          <h1>PERFORMANCE {params.id}</h1>
        </section>
      </main>
    </>
  );
};