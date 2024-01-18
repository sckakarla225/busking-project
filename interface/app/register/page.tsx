import Image from 'next/image';
import logo from '../logo.png';

export default function Register() {
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
      <h1 className="mx-auto justify-center text-purple-800 text-xl font-bold">REGISTER</h1>
    </main>
  )
}