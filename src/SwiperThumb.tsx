import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Picture, Video, Overlay} from './types';
import React, {useEffect, useMemo, useRef, useState} from "react";

type SliderThumbProps = {
  items: Picture[];
  setThumbsSwiper?: (swiper: SwiperCore) => void;
  control?: SwiperCore;
  overlay: Overlay;
  setOverlay: (overlay: Overlay) => void;
  video?: Video;
  overlaySwiper?: SwiperCore;
  thumbsInstance?: SwiperCore;
  isZoomed: boolean;
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

const SwiperThumb: React.FC<SliderThumbProps> = ({items, video, isZoomed, overlay, setThumbsSwiper, setOverlay, control }) => {

  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  const onClickVideo = () =>{
    setOverlay({ isActive: true, isVideo: true });
  }
  const onClickThumbs = () => {
    if (!overlay.isActive) return
    // if video mode is active, close it
    if (overlay.isVideo) setOverlay({ isActive: true, isVideo: false });
  }

  // const thumbWidth = useMemo(() => {
  //   const thumbsWidth = thumbsRef.current?.clientWidth || 0;
  //   const width = video ? thumbsWidth - 98 : thumbsWidth
  //   console.log(width)
  //   return width
  // }, [items, thumbsRef]);

  useEffect(() => {
    console.log(width)
  }, [setWidth]);



  return (
    <div className="thumbs-custom" ref={thumbsRef}>
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        loopedSlides={items.length}
        onInit={(swiper) => {
          console.log(swiper)
        }}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        controller={{ control }}
        onClick={onClickThumbs}
        centeredSlidesBounds
        observer
      >
        {items.map(({ filename, thumb }, index) => (
          <SwiperSlide
            key={'thumb-' + index}
            className={overlay.isVideo ? 'no-border' : '' }
            style={{
              // width: '100%',
              backgroundImage: `url(${thumb + filename})`
            }}
          />
        ))}
      </Swiper>
      { video && (
          <>
            <div className={`slide-video ${overlay.isVideo || isZoomed ? 'hide-on-mobile' : ''}`} onClick={onClickVideo}>
              <div className="btn">
                <VideoIcon />
                <span>Vidéo</span>
              </div>
            </div>
          </>
      )}
    </div>
  );
};

export default SwiperThumb;
