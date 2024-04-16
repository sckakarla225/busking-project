import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { HiMiniUserCircle } from 'react-icons/hi2';
import { MdLogout } from 'react-icons/md';
import { FaListUl } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { signOut } from 'firebase/auth';

import { auth } from '@/firebase/firebaseConfig';
import { AppDispatch } from '@/redux/store';
import { logout } from '@/redux/reducers/auth';
import { resetUser } from '@/redux/reducers/performer';
import { resetSpots } from '@/redux/reducers/spots'; 

interface NavbarProps {};

const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const logoutUser = async () => {
    await signOut(auth);
    dispatch(logout());
    dispatch(resetUser());
    dispatch(resetSpots());
    router.push('/login');
  };

  return (
    <nav className="absolute top-0 left-0 z-10 w-full border-gray-200 bg-zinc-800">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-3 px-8">
        <div className="flex flex-row items-center">
          <Link href="/" className="flex items-center cursor-pointer">
            <Image src={'/logos/spotlite-icon.png'} alt="logo" width={30} height={30} />
          </Link>
          <FaStar 
            size={20}
            className={`
              ml-4 cursor-pointer
              ${pathname == '/picks' ? 'text-spotlite-orange' : 'text-white'}
            `}
            onClick={() => router.push('/picks')}
          />
          <FaListUl 
            size={20}
            className={`
              ml-4 cursor-pointer
              ${pathname == '/timings' ? 'text-spotlite-orange' : 'text-white'}
            `}
            onClick={() => router.push('/timings')}
          />
        </div>
        <div className="flex flex-row items-center">
          <HiMiniUserCircle 
            size={25} 
            className={`
              cursor-pointer
              ${pathname == '/profile' ? 'text-spotlite-orange' : 'text-white'}
            `}
            onClick={() => router.push('/profile')} 
          />
          <MdLogout 
            size={20} 
            color="white" 
            className="ml-4 cursor-pointer"
            onClick={() => logoutUser()} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;