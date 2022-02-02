import React, {useEffect, useRef, useState, useMemo, SyntheticEvent} from 'react';
import { animated, useSpring } from 'react-spring';
import { Swiper, SwiperSlide } from 'swiper/react';
import './styles.scss';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import Portal from './Portal';

import SwiperCore, { Lazy, Zoom, Pagination, Navigation, Controller, Thumbs } from 'swiper';
import SwiperThumb from './SwiperThumb';
import { Picture, Overlay } from './Slider';
import ReactDOM from 'react-dom';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PinchIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
};

type PinchIndicatorProps = {
  isZoomed: boolean;
};

const PinchIndicator: React.FC<PinchIndicatorProps> = ({ isZoomed }) => {
  if (isZoomed) return null;

  return (
    <div className="pinch-icon">
      <span>Appuyez 2 fois ou pincez pour zoomer</span>
      <PinchIcon />
    </div>
  );
};

type SliderOverlayProps = {
  overlay: { isActive: boolean, isVideo: boolean };
  items: Picture[];
  control?: SwiperCore;
  setOverlaySwiper: (swiper: SwiperCore) => void;
  onClose: () => void;
  setOverlay: (p: { isVideo: boolean; isActive: boolean }) => void;
  isVideo: boolean;
  video?: {
    embed: string;
    name: string;
  };
};

const SliderOverlay = ({
  overlay,
  items,
  control,
  setOverlaySwiper,
  setOverlay,
  onClose,
  isVideo,
  video
}: SliderOverlayProps): JSX.Element => {
  const [isZoomed, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | undefined>();

  const onZoomChange = (swiperCore: SwiperCore) => {
    // onZoomChange return initial zoom value on desktop
    // onDoubleClick return zoom value after double tap / click
    // onDoubleClick is fired last and set the right value
    const procZoom = swiperCore.zoom.scale !== 1;
    setZoom(procZoom);
  };

  const slideHeight = useMemo(() => {
    const dialogHeight = dialogRef.current?.clientHeight || 0;
    const thumbsHeight = thumbsRef.current?.clientHeight || 0;
      return {
        // 20 : margin + spacing bottom
        height: isZoomed ? `${dialogHeight}px` : `${dialogHeight - thumbsHeight - 58}px`,
      }
  }, [overlay.isActive, isZoomed, dialogRef, thumbsRef]);

  const dialogAnimation = useSpring({
    transform: overlay.isActive ? 'scale(1)' : 'scale(0.5)',
    opacity: overlay.isActive ? 1 : 0
  });

  const stopPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [overlay.isActive]);

  useEffect(() => {
    // no scroll on overlay.isActive dialog
    if (overlay.isActive){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [overlay.isActive]);

  if (!control) {
    return <></>;
  }

  return (
        <div className={`overlay ${overlay.isActive && 'visible'}`} onClick={onClose}>
          <animated.div className="dialog" style={{ ...dialogAnimation, padding: isZoomed ? '0' : '0' }} ref={dialogRef} onClick={stopPropagation}>
            <button onClick={onClose} className="close">
              <CloseIcon />
            </button>

            <PinchIndicator isZoomed={isZoomed} />
            {isVideo && (
                <div style={{ display: overlay.isVideo ? 'block' : 'none' }}>
                  <iframe
                      className="mfp-iframe"
                      src={video?.embed}
                      style={slideHeight}
                      width="100%"
                      title={video?.name}
                      frameBorder="0"
                      allowFullScreen
                  />
                </div>
            )}
            <Swiper
                style={{ display: !overlay.isVideo ? 'block' : 'none' }}
                zoom
                loop
                watchSlidesProgress
                lazy
                preloadImages={false}
                preventInteractionOnTransition
                modules={[Lazy, Zoom, Pagination, Navigation, Controller, Thumbs]}
                loopedSlides={items.length}
                slidesPerView={1}
                allowSlideNext={!isZoomed}
                allowSlidePrev={!isZoomed}
                navigation={!isZoomed}
                controller={{ control }}
                onSwiper={setOverlaySwiper}
                onZoomChange={onZoomChange}
                onDoubleClick={onZoomChange}
                thumbs={{ swiper: thumbsSwiper }}
            >
              {items.map(({ name, hd, filename }, index) => (
                  <SwiperSlide key={'slider-overlay-' + index} style={slideHeight}>
                    <div className="swiper-zoom-container">
                      <img
                          data-src={hd + filename}
                          alt={name}
                          className="swiper-lazy"
                      />
                      <div className="swiper-lazy-preloader" />
                    </div>
                  </SwiperSlide>
              ))}
            </Swiper>
            <div ref={thumbsRef}>
              <SwiperThumb setThumbsSwiper={setThumbsSwiper} items={items} setOverlay={setOverlay} overlay isVideo={isVideo} />
            </div>
          </animated.div>
        </div>
  );
}

export default SliderOverlay;
