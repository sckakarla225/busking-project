import Image from 'next/image';
import Link from 'next/link';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { Performer, samplePerformerData } from '../types';
import logo from '../../logo.png';

export default function CityHome() {
  const numPerformers = samplePerformerData.length; // set to actual amount through query

  return (
    <main className="flex min-h-screen flex-col">
      <nav className= "border-gray-200 bg-zinc-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 px-8">
          <div className="flex flex-row items-center">
            <a href="/" className="flex items-center">
              <Image src={logo} alt="logo" width={35} height={35} />
            </a>
          </div>
          <h1 className="text-white font-medium text-sm">Logout</h1>
        </div>
      </nav>
      <section className="px-16 py-10">
        <h1 className="text-black font-bold text-xl mt-20 mb-10">Performers in Raleigh ({numPerformers})</h1>
        <div className="flex flex-col w-full h-96 overflow-y-auto">
          {samplePerformerData.map((performer: Performer, index) => (
            <div key={index} className="rounded-md bg-purple-500 px-5 py-4 mb-5 flex flex-row justify-between items-center">
              <div className="flex flex-row items-center">
                <div className={`
                  h-5 w-5 rounded-full border-2
                  ${performer.activityStatus === "high" && 'bg-green-500 border-green-600'}
                  ${performer.activityStatus === "medium" && 'bg-yellow-300 border-yellow-400'}
                  ${performer.activityStatus === "low" && 'bg-red-500 border-red-600'}
                `}></div>
                <h1 className="text-white font-medium text-sm ml-3">{performer.name}</h1>
              </div>
              <Link href={`/city/performers/${performer.performerId}`}>
                <div className="rounded-md p-1 bg-slate-200 border-2 border-slate-300">
                  <MdKeyboardArrowRight size={15} />
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center mt-10">
          <div className="flex flex-row items-center">
            <div className="h-5 w-5 rounded-full bg-green-500 border-2 border-green-600"></div>
            <div className="h-5 w-5 rounded-full ml-2 bg-yellow-300 border-2 border-yellow-400"></div>
            <div className="h-5 w-5 rounded-full ml-2 bg-red-500 border-2 border-red-600"></div>
          </div>
          <h1 className="ml-3 text-black text-md font-medium">Activity Status</h1>
        </div>
      </section>
    </main>
  )
}