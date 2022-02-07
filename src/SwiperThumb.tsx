import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Picture, Video, Overlay} from './types';
import React from "react";

type SliderThumbProps = {
  items: Picture[];
  setThumbsSwiper?: (swiper: SwiperCore) => void;
  control?: SwiperCore;
  overlay: Overlay;
  setOverlay: (overlay: Overlay) => void;
  video?: Video;
  overlaySwiper?: SwiperCore;
};

const VideoIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 16 9.2'
    >
      <g id='Calque_2' data-name='Calque 2'>
        <g id='Calque_1-2' data-name='Calque 1'>
          <path
            id='camera-video-avec-bouton-de-lecture'
            className='cls-1'
            d='M15.3.6a1.06,1.06,0,0,0-1.2.2l-2,2.1V1.6A1.58,1.58,0,0,0,10.5,0H1.6A1.64,1.64,0,0,0,0,1.6v6A1.58,1.58,0,0,0,1.6,9.2h8.9a1.58,1.58,0,0,0,1.6-1.6V6.4l2,2.1a1.06,1.06,0,0,0,1.2.2,1.2,1.2,0,0,0,.7-1V1.6A1.2,1.2,0,0,0,15.3.6ZM7.6,5.1,5.4,6.8a.45.45,0,0,1-.5,0c-.2-.1-.3-.2-.3-.4V2.9a.55.55,0,0,1,.3-.5.47.47,0,0,1,.6.1L7.7,4.2a.77.77,0,0,1-.1.9c.1-.1,0-.1,0,0Z'
          />
        </g>
      </g>
    </svg>
  )
}

const SwiperThumb: React.FC<SliderThumbProps> = ({items, video, overlay, setThumbsSwiper, setOverlay, control }) => {
  const onClickVideo = () =>{
    setOverlay({ isActive: true, isVideo: true });
  }
  const onClickThumbs = () => {
    if (!overlay.isActive) return
    // if video mode is active, close it
    if (overlay.isVideo) setOverlay({ isActive: true, isVideo: false });
  }
  return (
    <div className="thumbs-custom">
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        loopedSlides={items.length}
        onSwiper={setThumbsSwiper}
        controller={{ control }}
        onClick={onClickThumbs}
      >
        {items.map(({ filename, thumb }, index) => (
          <SwiperSlide
            key={'thumb-' + index}
            style={{
              backgroundImage: `url(${thumb + filename})`
            }}
          />
        ))}
      </Swiper>
      { Boolean(video) && (
        <div className="slide-video" onClick={onClickVideo}>
          <div>
            <VideoIcon />
            <span>Vidéo</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwiperThumb;
