import React, { useState, useEffect, useRef } from 'react';

import Loading from './Loading';
import './styles.css';

interface SpotGraphicsProps {
  spotId: string,
};

const SpotGraphics: React.FC<SpotGraphicsProps> = ({
  spotId
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const video = videoRef.current;

    const setVideoData = () => {
      const videoDuration = video?.duration || 0;
      setDuration(videoDuration);
      const midTime = videoDuration / 2;
      setCurrentFrame(midTime);
      if (video) {
        video.currentTime = midTime;
      }
    };

    video?.addEventListener('loadedmetadata', setVideoData);
    setLoading(false);

    return () => {
      video?.removeEventListener('loadedmetadata', setVideoData);
      setLoading(false);
    };
  }, [videoRef]);

  const handleScroll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (event.target.valueAsNumber * duration) / 100;
    setCurrentFrame(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <>
      <Loading isLoading={loading} />
      <div className={`
        relative h-screen w-screen overflow-hidden 
        ${loading ? 'opacity-50' : ''}
      `}>
        <video
          ref={videoRef} 
          src={`/videos/${spotId}.mp4`}
          className="absolute top-0 left-0 w-full h-full object-cover"
          muted
          autoPlay
        />
        <div className={`
          absolute top-5 z-30 left-1/2 transform -translate-x-1/2 w-3/4
          ${loading ? 'opacity:50': ''}
        `}>
          <input
            type="range"
            min="0"
            max="100"
            value={(currentFrame / duration) * 100 || 0}
            onChange={handleScroll}
            className="w-full h-4 bg-zinc-700 rounded-md appearance-none cursor-pointer video-slider"
          />
        </div>
      </div>
    </>
  );
};

export default SpotGraphics;