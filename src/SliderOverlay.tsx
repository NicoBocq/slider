import React, {useRef, useState, useMemo, useEffect} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './styles.scss';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

import SwiperCore, { Lazy, Zoom, Pagination, Navigation, Controller, Thumbs } from 'swiper';
import SwiperThumb from './SwiperThumb';
import { Picture, Overlay, Video } from './types';
import SliderImg from "./SliderImg";
import Dialog from "./Dialog";
import PinchToolTip from "./PinchToolTip";
import useDeviceDetect from "./hooks/useDeviceDetect";

type SliderOverlayProps = {
  overlay: Overlay;
  items: Picture[];
  control?: SwiperCore;
  setOverlaySwiper: (swiper: SwiperCore) => void;
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
  video
}: SliderOverlayProps): JSX.Element => {
  const [isZoomed, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | undefined>();
  const [slideHeight, setSlideHeight] = useState<{ height: string }>();
  const isMobile = useDeviceDetect();

  const onZoomChange = (swiperCore: SwiperCore) => {
    // onZoomChange return initial zoom value on desktop, the actual value on mobile
    // onDoubleClick return zoom value after double tap / click
    // onDoubleClick is fired last and set the right value
    const procZoom = swiperCore.zoom.scale > 1;
    setZoom(procZoom);
  };

  const onClose = () => {
    setOverlay({isActive: false, isVideo: false });
    if (isZoomed) {
      overlaySwiper?.zoom.out();
      setZoom(false);
    }
  };

  const SlideList: JSX.Element[] = []
  items.map((picture) => {
    SlideList.push(
        <SwiperSlide key={`slide-overlay-${picture.filename}`} style={slideHeight}>
          <SliderImg picture={picture} isOverlay />
        </SwiperSlide>
    );
  });

  useEffect(() => {
    const dialogHeight = dialogRef.current?.clientHeight || 0;
    setSlideHeight({ height: overlay.isVideo ? `${dialogHeight - 96}px` : `${dialogHeight}px` });
  }, [overlay, dialogRef.current]);


  if (!control) {
    return <></>;
  }

  return (
        <Dialog isActive={overlay.isActive} onClose={onClose} propsRef={dialogRef}>
            <PinchToolTip overlay={overlay} active={overlay.isActive}/>
            {overlay.isVideo && (
                <div style={{...slideHeight, overflow: 'hidden' }}>
                  <iframe
                      src={video?.embed}
                      width="100%"
                      height={slideHeight?.height}
                      title={video?.name}
                      frameBorder="0"
                      allowFullScreen
                  />
                </div>
            )}
            <Swiper
                style={{
                  visibility: !overlay.isVideo ? 'visible' : 'hidden',
                  height: !overlay.isVideo ? 'auto' : '0'
                }}
                zoom
                loop
                watchSlidesProgress
                lazy
                preloadImages={false}
                preventInteractionOnTransition
                modules={[Lazy, Zoom, Pagination, Navigation, Controller, Thumbs]}
                loopedSlides={items.length}
                slidesPerView={1}
                // watch zoom scale
                onZoomChange={onZoomChange}
                onDoubleClick={onZoomChange}
                // prevent navigation when zoomed
                allowSlideNext={!isZoomed}
                allowSlidePrev={!isZoomed}
                navigation={!isZoomed && !isMobile}
                controller={{ control }}
                onSwiper={setOverlaySwiper}
                thumbs={{ swiper: thumbsSwiper, autoScrollOffset: 1 }}
                observer
                observeParents
                observeSlideChildren
            >
              {SlideList}
            </Swiper>
          <div style={{ display: isZoomed ? 'none' : 'block'}}>
            <SwiperThumb
                setThumbsSwiper={setThumbsSwiper}
                items={items}
                setOverlay={setOverlay}
                overlay={overlay}
                video={video}
                overlaySwiper={overlaySwiper}
                isZoomed={isZoomed}
            />
          </div>
        </Dialog>
  );
}

export default SliderOverlay;
