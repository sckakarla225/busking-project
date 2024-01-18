import Image from 'next/image';
import logo from '../../logo.png';

export default function CityHome() {
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
      <h1 className="mx-auto justify-center text-purple-800 text-xl font-bold">CITY HOME</h1>
    </main>
  )
}