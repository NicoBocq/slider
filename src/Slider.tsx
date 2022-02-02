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

export type Item = {
  name: string;
  isVideo: boolean;
  thumb: string;
  hd: string;
  medium: string;
  filename: string;
  embed?: string;
};

type SliderBasicProps = {
  pictures: string[];
  productName: string;
  videos: Array<{ picture: string, embedUrl: string }>;
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
  const [isOverlay, setOverlay] = useState({ active: false, isVideo: false });

  const items = useMemo(() => {

    const allItems: Item[] = [];
    const i: { isVideo: boolean; filename: string, embed?: string }[] = [];

    for (const picture of pictures) {
      i.push({
        isVideo: false,
        filename: picture
      });
    }

    // for (const video of videos) {
    //   i.push({
    //     isVideo: true,
    //     filename: video.picture,
    //     embed: video.embedUrl
    //   });
    // }

    for (const item of i) {
      allItems.push({ ...item, thumb, hd, medium, name: productName });
    }

    return allItems;
  }, [pictures, videos, thumb, hd, medium, productName]);

  const onClickImage = () => {
    setOverlay({active: true, isVideo: false });
  };

  const onClose = () => {
    setOverlay({active: false, isVideo: false });
    overlaySwiper?.zoom.out();
  };

  const appHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  window.addEventListener('load', appHeight)
  window.addEventListener('resize', appHeight)

  if (items.length <= 0) return <></>;

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
          loopedSlides={items.length}
          slidesPerView={1}
          modules={[Lazy, Pagination, Navigation, Controller, Thumbs]}
          onSwiper={setSwiper}
          controller={{ control: overlaySwiper }}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {items.map(({ name, isVideo, embed, medium, filename }, index) => (
            <SwiperSlide key={'slider-' + index}>
              { isVideo ? (
              <div className="video-container">
                <iframe
                    className="mfp-iframe"
                    src={embed}
                    height="300px"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen>
                </iframe>
              </div>
              ) : (
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
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <SwiperThumb setThumbsSwiper={setThumbsSwiper} items={items} setOverlay={setOverlay} />
      </div>

      <SliderOverlay
        items={items}
        control={swiper}
        setOverlaySwiper={setOverlaySwiper}
        onClose={onClose}
        isOverlay={isOverlay}
        setOverlay={setOverlay}
      />
    </>
  );
}
