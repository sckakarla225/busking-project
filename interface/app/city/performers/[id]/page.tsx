import Image from 'next/image';
import Link from 'next/link';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import { Performer, samplePerformerData } from '../../types';
import logo from '../../../logo.png';

export default function CityPerformers(
  { params }: { params: { id: string } }
) {
  const performer: Performer | undefined = samplePerformerData.find((performer: Performer) => performer.performerId === params.id);
  
  return (
    <main className="flex min-h-screen flex-col">
      <nav className= "border-gray-200 bg-zinc-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 px-8">
          <div className="flex flex-row items-center">
            <a href="/city/home" className="flex items-center">
              <Image src={logo} alt="logo" width={35} height={35} />
            </a>
          </div>
          <h1 className="text-white font-medium text-sm">Logout</h1>
        </div>
      </nav>
      <section className="px-12 py-10">
        <div className="flex flex-row mt-10">
          <div className="bg-gray-100 border-2 border-gray-200 w-full rounded-md ml-2 pb-7">
            <div className="bg-zinc-700 px-6 py-10 flex flex-row items-center rounded-t-md">
              <Image src={logo} alt="logo" width={50} height={50} />
              <div className="flex flex-col ml-5">
                <h1 className="text-white font-semibold text-md">{performer?.name}</h1>
                <h1 className="text-white font-light text-xs mt-2">{performer?.email}</h1>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between mt-5 mx-3">
              <h1 className="text-black font-medium text-xs">Date Joined: {performer?.dateJoined}</h1>
              <div className="flex flex-row items-center">
                <h1 className="text-black font-medium text-xs">Activity Status: </h1>
                <div className={`
                  h-5 w-5 rounded-full border-2 ml-2
                  ${performer?.activityStatus === "high" && 'bg-green-500 border-green-600'}
                  ${performer?.activityStatus === "medium" && 'bg-yellow-300 border-yellow-400'}
                  ${performer?.activityStatus === "low" && 'bg-red-500 border-red-600'}
                `}></div>
              </div>
            </div>
            <div className="flex flex-col mt-6 mx-3">
              <h1 className="text-black font-medium text-xs">Performance Styles:</h1>
              <div className="flex flex-row flex-wrap mt-3">
                {performer?.performanceStyles.map((item: any) => (
                  <div className="rounded bg-purple-500 py-2 px-4 mr-2 w-auto">
                    <h1 className="text-xs text-white font-medium">{item}</h1>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row mx-3 mt-10">
              <div className="flex flex-col">
                <h1 className="text-black font-medium text-xs">Total Performances:</h1>
                <div className="rounded bg-purple-500 py-2 px-4 mr-2 w-auto text-center mt-3">
                  <h1 className="text-2xl text-white font-medium">{performer?.totalPerformances}</h1>
                </div>
              </div>
              <div className="flex flex-col ml-5">
                <h1 className="text-black font-medium text-xs">Avg Performance Time:</h1>
                <div className="rounded bg-purple-500 py-2 px-4 mr-2 w-auto text-center mt-3">
                  <h1 className="text-2xl text-white font-medium">{performer?.avgPerformanceTime} hrs</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}