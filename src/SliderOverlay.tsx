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
import { Picture, Overlay, Video } from './Slider';
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
  isHidden: boolean;
};

const PinchIndicator: React.FC<PinchIndicatorProps> = ({ isHidden }) => {
  if (isHidden) return null;

  return (
    <div className="pinch-icon">
      <span>Appuyez 2 fois ou pincez pour zoomer</span>
      <PinchIcon />
    </div>
  );
};

type SliderOverlayProps = {
  overlay: Overlay;
  items: Picture[];
  control?: SwiperCore;
  setOverlaySwiper: (swiper: SwiperCore) => void;
  onClose: () => void;
  setOverlay: (overlay: Overlay) => void;
  video?: Video;
  overlaySwiper?: SwiperCore;
};

const SliderOverlay = ({
  items,
  control,
  setOverlaySwiper,
  overlay,
  setOverlay,
  overlaySwiper,
  onClose,
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
        // 34 : margin + spacing bottom
        height: isZoomed ? `${dialogHeight}px` : `${dialogHeight - thumbsHeight - 34}px`,
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
        <div className="overlay" onClick={onClose} style={{  visibility: overlay.isActive ? 'visible' : 'hidden' }}>
          <animated.div className="dialog" style={dialogAnimation} ref={dialogRef} onClick={stopPropagation}>
            <button onClick={onClose} className="close">
              <CloseIcon />
            </button>

            <PinchIndicator isHidden={isZoomed || overlay.isVideo} />
            <div style={{  visibility: overlay.isVideo ? 'visible' : 'hidden', height: overlay.isVideo ? 'auto' : '0' }}>
              <iframe
                  style={slideHeight}
                  src={video?.embed}
                  width="100%"
                  title={video?.name}
                  frameBorder="0"
                  allowFullScreen
              />
            </div>
            <Swiper
                style={{ visibility: !overlay.isVideo ? 'visible' : 'hidden', height: !overlay.isVideo ? 'auto' : '0' }}
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
              <SwiperThumb setThumbsSwiper={setThumbsSwiper} items={items} setOverlay={setOverlay} overlay={overlay} video={video} overlaySwiper={overlaySwiper} />
            </div>
          </animated.div>
        </div>
  );
}

export default SliderOverlay;
