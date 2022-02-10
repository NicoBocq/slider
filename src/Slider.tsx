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
import VideoIcon from "./VideoIcon";
import { Slider, Overlay, Picture } from "src/types";
import useDeviceDetect from "./hooks/useDeviceDetect";
import swiperThumb from "./SwiperThumb";

const ProductSlider = ({
  pictures,
  productName,
  videos,
  thumb,
  hd,
  medium
}: Slider): JSX.Element => {
  const [swiper, setSwiper] = useState<SwiperCore | undefined>();
  const [overlaySwiper, setOverlaySwiper] = useState<SwiperCore | undefined>();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | undefined>();
  const [overlay, setOverlay] = useState<Overlay>({ isActive: false, isVideo: false });
  const isMobile = useDeviceDetect();
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
    setOverlay({isActive: true, isVideo: true });
  };

  const appHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  const updateSwiperInstance = () => {
      swiper?.update();
      overlaySwiper?.update();
      thumbsSwiper?.update();
  };

  useEffect(
    () => {
      window.addEventListener('resize', updateSwiperInstance);

      return () => {
        window.removeEventListener('resize', updateSwiperInstance);
      };
    },
      []
  );

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
          observer
        >
          {items?.map((picture, index) => (
            <SwiperSlide key={'slider-' + index}>
              <SliderImg picture={picture} onClick={onClickImage} />
            </SwiperSlide>
          ))}
          { video && (
              <div className="swiper-pagination-video" onClick={onClickVideo}>
                {VideoIcon}
              </div>
          )}
        </Swiper>
        {/*{!isMobile && (*/}
        <div style={{ display: isMobile ? 'none' : 'block' }}>
          <SwiperThumb
              setThumbsSwiper={setThumbsSwiper}
              items={items}
              overlay={overlay}
              setOverlay={setOverlay}
              video={video}
              thumbsInstance={thumbsSwiper}
          />
        </div>

        {/*)}*/}
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
