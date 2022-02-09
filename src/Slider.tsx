import React, {useEffect, useMemo, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './styles.scss';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import SwiperCore, { Lazy, Pagination, Navigation, Controller, Thumbs } from 'swiper';
import SwiperThumb from './SwiperThumb';
import SliderOverlay from './SliderOverlay';
import SliderImg from "./SliderImg";
import { Slider, Overlay, Picture } from "src/types";

const VideoIcon = (
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

const ProductSlider = ({
  pictures,
  productName,
  videos,
  thumb,
  hd,
  medium,
  allowFs,
  setAllowFs
}: Slider): JSX.Element => {
  const [swiper, setSwiper] = useState<SwiperCore | undefined>();
  const [overlaySwiper, setOverlaySwiper] = useState<SwiperCore | undefined>();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | undefined>();
  const [overlay, setOverlay] = useState<Overlay>({ isActive: false, isVideo: false });

  if (!pictures?.length) return <></>;

  const items = useMemo(() => {
    return pictures.reduce((acc, curr) => {
      acc.push({
        name: productName,
        thumb: thumb,
        hd: hd,
        medium: medium,
        filename: curr,
      });
      return acc;
    }, [] as Picture[]);
  }, [pictures, thumb, hd, medium, productName]);

  const video = useMemo(() => {
    if (!videos.length) return
    return {
      name: productName,
      embed: videos[0].embedUrl,
      thumb: videos[0].picture
    }
  }, [videos, productName]);

  const onClickImage = () => {
    setOverlay({isActive: true, isVideo: false });
  };

  const onClickVideo = () => {
    console.log('video');
    setOverlay({isActive: true, isVideo: true });
  };

  const appHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  useEffect(() => {
    swiper && console.log(swiper);
    window.addEventListener('load', appHeight)
    window.addEventListener('resize', appHeight)

    return () => {
      window.removeEventListener('load', appHeight)
      window.removeEventListener('resize', appHeight)
    }
  }, []);


  return (
    <>
      <div className="alltricks-slider">
        <Swiper
          loop
          watchSlidesProgress
          lazy
          preloadImages={false}
          navigation
          pagination={{ clickable: false }}
          preventInteractionOnTransition
          loopedSlides={items?.length}
          slidesPerView={1}
          modules={[Lazy, Pagination, Navigation, Controller, Thumbs]}
          onSwiper={setSwiper}
          controller={{ control: overlaySwiper }}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {items?.map((picture, index) => (
            <SwiperSlide key={'slider-' + index}>
              <SliderImg picture={picture} onClick={onClickImage} />
            </SwiperSlide>
          ))}
          { video && (
              <div className="video-bullet" onClick={onClickVideo}>
                {VideoIcon}
              </div>
          )}
        </Swiper>

        <SwiperThumb
            setThumbsSwiper={setThumbsSwiper}
            items={items}
            overlay={overlay}
            setOverlay={setOverlay}
            video={video}
            thumbsInstance={thumbsSwiper}
        />
        <SliderOverlay
          items={items}
          video={video}
          control={swiper}
          setOverlaySwiper={setOverlaySwiper}
          overlay={overlay}
          setOverlay={setOverlay}
          overlaySwiper={overlaySwiper}
          allowFs={allowFs}
          setAllowFs={setAllowFs}
        />
      </div>
    </>
  );
}

export default ProductSlider;
