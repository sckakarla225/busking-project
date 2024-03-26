'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MdLogout, MdKeyboardArrowLeft } from 'react-icons/md';
import { 
  FaInstagram, 
  FaFacebook, 
  FaTwitter, 
  FaSoundcloud, 
  FaYoutube, 
  FaSpotify 
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';

import { ProgressBar, Loading, Carousel } from '@/components';
import { auth } from '@/firebase/firebaseConfig';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { setupUser } from '@/api';
import { logout } from '@/redux/reducers/auth';
import { resetUser } from '@/redux/reducers/performer';
import { resetSpots } from '@/redux/reducers/spots';
import { 
  PERFORMANCE_STYLES,
  INSTRUMENTS,
  AUDIO_TOOLS,
  STAGING_AND_VISUALS 
} from '@/constants';

export default function SetupPerformer() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const userId = useAppSelector((state) => state.auth.userId);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [performerDescription, setPerformerDescription] = useState<string>('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedAudioTools, setSelectedAudioTools] = useState<string[]>([]);
  const [selectedStagings, setSelectedStagings] = useState<string[]>([]);
  const [noEquipmentCheck, setNoEquipmentCheck] = useState<boolean>(false);
  const [instagramHandle, setInstagramHandle] = useState<string>('');
  const [facebookHandle, setFacebookHandle] = useState<string>('');
  const [twitterHandle, setTwitterHandle] = useState<string>('');
  const [youtubeHandle, setYoutubeHandle] = useState<string>('');
  const [soundcloudHandle, setSoundcloudHandle] = useState<string>('');
  const [spotifyHandle, setSpotifyHandle] = useState<string>('');

  const formatSocialMediaHandles = () => {
    const socialMediaHandles: any[] = [];
    if (instagramHandle !== '') {
      const newHandle = {
        platform: 'Instagram',
        handle: instagramHandle
      };
      socialMediaHandles.push(newHandle);
    }
    if (facebookHandle !== '') {
      const newHandle = {
        platform: 'Facebook',
        handle: facebookHandle
      };
      socialMediaHandles.push(newHandle);
    }
    if (twitterHandle !== '') {
      const newHandle = {
        platform: 'Twitter',
        handle: twitterHandle
      };
      socialMediaHandles.push(newHandle);
    }
    if (youtubeHandle !== '') {
      const newHandle = {
        platform: 'Youtube',
        handle: youtubeHandle
      };
      socialMediaHandles.push(newHandle);
    }
    if (soundcloudHandle !== '') {
      const newHandle = {
        platform: 'Soundcloud',
        handle: soundcloudHandle
      };
      socialMediaHandles.push(newHandle);
    }
    if (spotifyHandle !== '') {
      const newHandle = {
        platform: 'Spotify',
        handle: spotifyHandle
      };
      socialMediaHandles.push(newHandle);
    }

    return socialMediaHandles;
  }

  const finishPerformerSetup = async () => {
    const socialMediaHandles = formatSocialMediaHandles();
    const setupUserInfo = await setupUser(
      userId,
      performerDescription,
      selectedStyles,
      selectedInstruments,
      selectedAudioTools,
      selectedStagings,
      socialMediaHandles
    );
    if (setupUserInfo.success) {
      const newUserInfo = setupUserInfo.data;
      // TODO: Store to redux here
    };
  };

  const goToNextStep = () => {
    if (currentStep == 1) {
      setCurrentStep(2);
    } else if (currentStep == 2) {
      setCurrentStep(3);
    } else if (currentStep == 3) {
      finishPerformerSetup().then(() => router.push('/'));
    };
  };

  const goToPreviousStep = () => {
    if (currentStep == 3) {
      setCurrentStep(2);
    } else if (currentStep == 2) {
      setCurrentStep(1);
    }
  }

  const handleSelection = (item: string) => {
    setSelectedStyles((prevSelectedItems: any) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((currentItem: any) => currentItem !== item);
      } 
      else if (prevSelectedItems.length < 3) {
        return [...prevSelectedItems, item];
      } 
      else {
        return prevSelectedItems;
      }
    });
  }

  const handleInstrumentSelection = (item: string) => {
    setSelectedInstruments((prevSelectedItems: any) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((currentItem: any) => currentItem !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  }

  const handleAudioToolsSelection = (item: string) => {
    setSelectedAudioTools((prevSelectedItems: any) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((currentItem: any) => currentItem !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  }

  const handleStagingSelection = (item: string) => {
    setSelectedStagings((prevSelectedItems: any) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((currentItem: any) => currentItem !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoEquipmentCheck(event.target.checked);
  };

  const checkCanProceed = () => {
    if (currentStep == 2) {
      if (noEquipmentCheck) {
        return true;
      } else {
        if (
          selectedInstruments.length !== 0 ||
          selectedAudioTools.length !== 0 ||
          selectedStagings.length !== 0
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else if (currentStep == 1) {
      // TODO: Handle this too
    } else {
      return true;
    }
  }

  const logoutUser = async () => {
    await signOut(auth);
    dispatch(logout());
    dispatch(resetUser());
    dispatch(resetSpots());
    router.push('/login');
  };

  return (
    <>
      <Loading isLoading={loading} />
      <main className={`flex min-h-screen flex-col ${loading ? 'opacity-40' : ''}`}>
        <nav className= " border-gray-200 bg-zinc-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-3 px-8">
            <div className="flex flex-row items-center">
              <Link href="/" className="flex items-center">
                <Image src={'/logos/spotlite-icon.png'} alt="logo" width={30} height={30} />
              </Link>
            </div>
            <MdLogout 
              size={20} 
              color="white" 
              className="ml-4"
              onClick={() => logoutUser()} 
            />
          </div>
        </nav>
        <section className="px-10 py-16">
          <div className="px-3">
            <ProgressBar currentStep={currentStep} />
          </div>
          <div className="w-full bg-slate-100 py-5 px-3 rounded-md border-2 border-slate-200 mt-10">
            {currentStep == 1 && (
              <>
                <h1 className="text-base font-eau-medium mr-10">Provide a short description of what you perform:</h1>
                <textarea 
                  rows={3} 
                  className="mt-3 block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-spotlite-light-purple focus:border-spotlite-light-purple" 
                  placeholder="Enter description here..."
                  value={performerDescription}
                  onChange={(e) => setPerformerDescription(e.target.value)}
                ></textarea>
                <div className="flex flex-row mb-2 mt-8 items-center">
                  <h1 className="font-eau-medium text-black text-sm">Select your performance styles:</h1>
                  <p className="font-eau-regular text-black text-xs ml-2">(Up to 3)</p>
                </div>
                <div className="flex flex-row flex-wrap mt-4">
                  {PERFORMANCE_STYLES.map((item: any, index) => (
                    <div 
                      key={index} 
                      className={`
                        rounded py-2 px-3 mr-2 w-auto mb-3
                        ${selectedStyles.includes(item) ? 'bg-spotlite-light-purple' : 'bg-slate-200'}
                      `}
                      onClick={() => handleSelection(item)}
                    >
                      <h1 className={`
                        text-xs font-medium
                        ${selectedStyles.includes(item) ? 'text-white' : 'text-gray-900'}
                      `}>
                        {item}
                      </h1>
                    </div>
                  ))}
                </div>
              </>
            )}
            {currentStep == 2 && (
              <>
                <h1 className="text-sm font-eau-medium mr-10">Select any equipment that you use:</h1>
                <h1 className="text-xs font-eau-regular mt-5">Instrument Types:</h1>
                <div className="mt-2 w-full">
                  <Carousel 
                    items={INSTRUMENTS} 
                    type="instruments"
                    selectedItems={selectedInstruments}
                    setSelectedItems={(item: string) => handleInstrumentSelection(item)} 
                  />
                </div>
                <h1 className="text-xs font-eau-regular mt-5">Audio Tools:</h1>
                <div className="mt-2 w-full">
                  <Carousel 
                    items={AUDIO_TOOLS} 
                    type="audio"
                    selectedItems={selectedAudioTools}
                    setSelectedItems={(item: string) => handleAudioToolsSelection(item)} 
                  />
                </div>
                <h1 className="text-xs font-eau-regular mt-5">Staging and Visuals:</h1>
                <div className="mt-2 w-full">
                  <Carousel 
                    items={STAGING_AND_VISUALS} 
                    type="staging"
                    selectedItems={selectedStagings}
                    setSelectedItems={(item: string) => handleStagingSelection(item)} 
                  />
                </div>
                <div className="flex items-center gap-2 mt-7">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={noEquipmentCheck}
                      onChange={handleCheckboxChange}
                      className="form-checkbox text-base h-6 w-6 text-spotlite-orange"
                    />
                    <span className="text-gray-700 text-sm font-eau-medium">I don&apos;t use any equipment</span>
                  </label>
                </div>
              </>
            )}
            {currentStep == 3 && (
              <>
                <h1 className="text-base font-eau-medium mr-10 mb-5">Any social media handles?</h1>
                <div className="flex flex-row items-center mt-3">
                  <div className="flex flex-row items-center justify-center bg-spotlite-light-purple px-2 py-2 rounded-md">
                    <FaInstagram size={25} color="white" />
                  </div>
                  <div className="relative flex items-center border-2 border-gray-200 rounded ml-4">
                    <div className="px-2 text-xs text-gray-500 bg-white">@</div>
                    <input 
                      type="text" 
                      value={instagramHandle} 
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="text-base shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
                      placeholder="your-handle"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mt-3">
                  <div className="flex flex-row items-center justify-center bg-spotlite-light-purple px-2 py-2 rounded-md">
                    <FaFacebook size={25} color="white" />
                  </div>
                  <div className="relative flex items-center border-2 border-gray-200 rounded ml-4">
                    <div className="px-2 text-xs text-gray-500 bg-white">@</div>
                    <input 
                      type="text" 
                      value={facebookHandle} 
                      onChange={(e) => setFacebookHandle(e.target.value)}
                      className="text-base shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
                      placeholder="your-handle"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mt-3">
                  <div className="flex flex-row items-center justify-center bg-spotlite-light-purple px-2 py-2 rounded-md">
                    <FaTwitter size={25} color="white" />
                  </div>
                  <div className="relative flex items-center border-2 border-gray-200 rounded ml-4">
                    <div className="px-2 text-xs text-gray-500 bg-white">@</div>
                    <input 
                      type="text" 
                      value={twitterHandle} 
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      className="text-base shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
                      placeholder="your-handle"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mt-3">
                  <div className="flex flex-row items-center justify-center bg-spotlite-light-purple px-2 py-2 rounded-md">
                    <FaYoutube size={25} color="white" />
                  </div>
                  <div className="relative flex items-center border-2 border-gray-200 rounded ml-4">
                    <div className="px-2 text-xs text-gray-500 bg-white">@</div>
                    <input 
                      type="text" 
                      value={youtubeHandle} 
                      onChange={(e) => setYoutubeHandle(e.target.value)}
                      className="text-base shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
                      placeholder="your-handle"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mt-3">
                  <div className="flex flex-row items-center justify-center bg-spotlite-light-purple px-2 py-2 rounded-md">
                    <FaSoundcloud size={25} color="white" />
                  </div>
                  <div className="relative flex items-center border-2 border-gray-200 rounded ml-4">
                    <div className="px-2 text-xs text-gray-500 bg-white">@</div>
                    <input 
                      type="text" 
                      value={soundcloudHandle} 
                      onChange={(e) => setSoundcloudHandle(e.target.value)}
                      className="text-base shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
                      placeholder="your-handle"
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center mt-3">
                  <div className="flex flex-row items-center justify-center bg-spotlite-light-purple px-2 py-2 rounded-md">
                    <FaSpotify size={25} color="white" />
                  </div>
                  <div className="relative flex items-center border-2 border-gray-200 rounded ml-4">
                    <div className="px-2 text-xs text-gray-500 bg-white">@</div>
                    <input 
                      type="text" 
                      value={spotifyHandle} 
                      onChange={(e) => setSpotifyHandle(e.target.value)}
                      className="text-base shadow-sm border border-gray-200 appearance-none bg-gray-100 rounded w-full px-3 text-gray-700 italic leading-tight focus:outline-none focus:shadow-outline"  
                      placeholder="your-handle"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={`
            flex flex-row w-full
            ${currentStep == 1 ? 'justify-end' : 'justify-between'}
          `}>
            <button 
              type="submit"
              className={`
                text-sm hover:bg-opacity-80 bg-spotlite-dark-purple text-white py-3 px-3 rounded focus:outline-none focus:shadow-outline mt-5 font-eau-bold
                ${currentStep == 1 ? 'hidden' : ''}
              `}
            >
              <MdKeyboardArrowLeft 
                size={20}
                onClick={goToPreviousStep} 
              />
            </button>
            <button 
              type="submit"
              className={`
                text-sm hover:bg-opacity-80 bg-spotlite-dark-purple text-white py-3 px-8 rounded focus:outline-none focus:shadow-outline mt-5 font-eau-bold
                ${!checkCanProceed() ? 'disabled': ''}
              `}
              onClick={goToNextStep}
            >
              {currentStep == 3 ? 'Finish' : 'Next'}
            </button>
          </div>
        </section>
      </main>
    </>
  );
};