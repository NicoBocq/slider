import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Picture, Video, Overlay} from './types';
import React, { useMemo, useRef } from "react";
import ThumbVideo from "./ThumbVideo";
import useDeviceDetect from "./hooks/useDeviceDetect";

type SliderThumbProps = {
  items: Picture[];
  setThumbsSwiper?: (swiper: SwiperCore) => void;
  control?: SwiperCore;
  overlay: Overlay;
  setOverlay: (overlay: Overlay) => void;
  video?: Video;
  overlaySwiper?: SwiperCore;
  thumbsInstance?: SwiperCore;
  isZoomed?: boolean;
};

const SwiperThumb: React.FC<SliderThumbProps> = ({items, video, isZoomed, overlay, setThumbsSwiper, setOverlay, control }) => {

  const isMobile = useDeviceDetect();
  const onClickVideo = () =>{
    setOverlay({ isActive: true, isVideo: true });
  }
  const onClickThumbs = () => {
    if (!overlay.isActive) return
    // if video mode is active, close it
    if (overlay.isVideo) setOverlay({ isActive: true, isVideo: false });
  }

  const slideOffset = useMemo(() => {
    // add horizontal offset to thumb only in mobile
    return isMobile && items.length > 4 ? 24 : 0
  }, [items, isMobile])

  return (
    <div className="swiper-thumbs-custom">
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        loopedSlides={items.length}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        controller={{ control }}
        onClick={onClickThumbs}
        observer
        // add horizontal margin
        slidesOffsetAfter={slideOffset}
        slidesOffsetBefore={slideOffset}
      >
        {items.map(({ filename, thumb }, index) => (
          <SwiperSlide
            key={'thumb-' + index}
            className={overlay.isVideo ? 'inactive' : '' }
            style={{
              backgroundImage: `url(${thumb + filename})`
            }}
          />
        ))}
      </Swiper>
      { video && (
          <ThumbVideo onClick={onClickVideo} isZoomed={isZoomed} overlay={overlay} />
      )}
    </div>
  );
};

export default SwiperThumb;
