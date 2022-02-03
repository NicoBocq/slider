import React, { useMemo, useState } from 'react';
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

export type Picture = {
  name: string;
  thumb: string;
  hd: string;
  medium: string;
  filename: string;
};

export type Video = {
  name: string;
  embed: string;
  thumb: string;
};

export type Overlay = {
  isActive: boolean;
  isVideo: boolean;
}

type SliderBasicProps = {
  pictures: string[];
  productName: string;
  videos: { picture: string, embedUrl: string }[];
  thumb: string;
  medium: string;
  hd: string;
};

export default function Slider({
  pictures,
  productName,
  videos,
  thumb,
  hd,
  medium,
}: SliderBasicProps): JSX.Element {
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
  }, [videos]);

  const onClickImage = () => {
    setOverlay({isActive: true, isVideo: false });
  };

  const onClose = () => {
    setOverlay({isActive: false, isVideo: false });
    overlaySwiper?.zoom.out();
  };

  const appHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  window.addEventListener('load', appHeight)
  window.addEventListener('resize', appHeight)

  return (
    <>
      <div className="alltricks-slider">
        <Swiper
          loop
          watchSlidesProgress
          lazy
          preloadImages={false}
          navigation
          preventInteractionOnTransition
          loopedSlides={items?.length}
          slidesPerView={1}
          modules={[Lazy, Pagination, Navigation, Controller, Thumbs]}
          onSwiper={setSwiper}
          controller={{ control: overlaySwiper }}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {items?.map(({ name, medium, filename }, index) => (
            <SwiperSlide key={'slider-' + index}>
              <div className="swiper-zoom-container">
                <img
                  data-src={medium + filename}
                  alt={name}
                  onClick={onClickImage}
                  onKeyDown={onClickImage}
                  role="presentation"
                  className="swiper-lazy"
                />
                <div className="swiper-lazy-preloader" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <SwiperThumb setThumbsSwiper={setThumbsSwiper} items={items} overlay={overlay} setOverlay={setOverlay} video={video} />
      </div>

      <SliderOverlay
        items={items}
        video={video}
        control={swiper}
        setOverlaySwiper={setOverlaySwiper}
        onClose={onClose}
        overlay={overlay}
        setOverlay={setOverlay}
        overlaySwiper={overlaySwiper}
      />
    </>
  );
}
