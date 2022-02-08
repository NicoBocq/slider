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

const ProductSlider = ({
  pictures,
  productName,
  videos,
  thumb,
  hd,
  medium,
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    viewBox="0 0 16 16">
                  <path
                      d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                </svg>
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
        />
      </div>
    </>
  );
}

export default ProductSlider;
