import React, {useEffect, useRef, useState, useMemo} from 'react';
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
import {createPortal} from 'react-dom';
import SliderImg from "./SliderImg";
import Dialog from "./Dialog";

// Render the slider in fullscreen.
// Ugly display management : necessity to use 'visibility: hidden' to hide the slider.
// At the moment, don't know how to don't render the slider and allow sync between the 4 instances of swiper
// (even with adding props : observer and observeParents).
// Positioning the dialog's components : unable to use flex (strange behavior of Swiper with flex positioning).

const PinchIcon = () => {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <g id="Groupe_55" data-name="Groupe 55" transform="translate(-141 -560)">
          <g id="Groupe_54" data-name="Groupe 54" transform="translate(0 6)">
            <rect id="Rectangle_1" data-name="Rectangle 1" width="40" height="40" rx="20" transform="translate(141 554)" fill="#e6e6e6"/>
          </g>
          <path id="zoom-out" d="M92.845,13.68,91.9,17.357a6.107,6.107,0,0,1-2.385,3.5,3.429,3.429,0,0,0-1.4,2.067l-.2.8a.361.361,0,0,1-.346.281.342.342,0,0,1-.09-.012.377.377,0,0,1-.256-.457l.2-.8a4.2,4.2,0,0,1,1.7-2.5,5.358,5.358,0,0,0,2.092-3.071l.944-3.678a.862.862,0,0,0-.543-1.143c-.351-.1-.823.027-1,.708a.356.356,0,0,1-.438.265.377.377,0,0,1-.252-.459h0l.325-1.273a.837.837,0,0,0-.181-.832.932.932,0,0,0-.9-.255.791.791,0,0,0-.553.624l-.008,0v0l-.325,1.274a.361.361,0,0,1-.345.278.343.343,0,0,1-.093-.013.377.377,0,0,1-.253-.459l.325-1.274a.873.873,0,0,0-.083-.707.9.9,0,0,0-.517-.374.863.863,0,0,0-.626.051.833.833,0,0,0-.41.568l-.324,1.252a.356.356,0,0,1-.438.265.377.377,0,0,1-.253-.46L87.23,3.826a.921.921,0,0,0-.086-.675.85.85,0,0,0-.514-.416.807.807,0,0,0-.643.09.879.879,0,0,0-.4.538l-2.543,9.931a.363.363,0,0,1-.3.275.353.353,0,0,1-.356-.2l-1.309-2.562c-.616-.969-1.446-1.2-1.916-.921-.419.247-.489.824-.183,1.507a28.159,28.159,0,0,1,1.59,4.4,13.186,13.186,0,0,0,.784,2.247,4.4,4.4,0,0,1,.277,3.059l-.209.792a.361.361,0,0,1-.344.275.342.342,0,0,1-.1-.014.378.378,0,0,1-.249-.462l.209-.792a3.589,3.589,0,0,0-.23-2.529,13.989,13.989,0,0,1-.829-2.366,27.145,27.145,0,0,0-1.551-4.3,1.841,1.841,0,0,1,.48-2.481c.773-.455,2.008-.2,2.872,1.177q.009.014.017.029l.891,1.743L84.9,3.168a1.621,1.621,0,0,1,.73-.994,1.488,1.488,0,0,1,1.185-.164,1.566,1.566,0,0,1,.948.766,1.7,1.7,0,0,1,.157,1.244l-1.306,5.1a1.566,1.566,0,0,1,.883,0,1.606,1.606,0,0,1,.927.684,1.552,1.552,0,0,1,.1.188,1.419,1.419,0,0,1,.455-.22,1.623,1.623,0,0,1,1.593.45,1.6,1.6,0,0,1,.4,1.411,1.432,1.432,0,0,1,.827-.014,1.61,1.61,0,0,1,1.048,2.062ZM81.049,3.292h1.6a.376.376,0,0,0,0-.75h-.739L83.724.64a.388.388,0,0,0,0-.53.346.346,0,0,0-.506,0l-1.812,1.9V1.236a.358.358,0,1,0-.715,0V2.917A.367.367,0,0,0,81.049,3.292ZM79.337,6.02a.358.358,0,1,0,.715,0V4.339a.367.367,0,0,0-.357-.375h-1.6a.376.376,0,0,0,0,.75h.74l-1.812,1.9a.388.388,0,0,0,0,.53.346.346,0,0,0,.506,0l1.812-1.9Z" transform="translate(76.585 568.5)" fill="#707070"/>
          <path id="zoom-out_-_Contour" data-name="zoom-out - Contour" d="M87.572,24.2a.543.543,0,0,1-.143-.019.579.579,0,0,1-.4-.7l.2-.8A4.4,4.4,0,0,1,89,20.07a5.158,5.158,0,0,0,2.014-2.956l.944-3.678c.139-.541-.131-.824-.4-.9a.587.587,0,0,0-.159-.022c-.284,0-.493.209-.59.588a.561.561,0,0,1-.539.428.542.542,0,0,1-.147-.021.579.579,0,0,1-.392-.7l.325-1.273a.647.647,0,0,0-.132-.645.742.742,0,0,0-.529-.224.649.649,0,0,0-.175.023.6.6,0,0,0-.413.481l-.051.2-.008,0-.275,1.078a.561.561,0,0,1-.539.429.544.544,0,0,1-.147-.02.579.579,0,0,1-.393-.7l.325-1.274a.673.673,0,0,0-.059-.551.7.7,0,0,0-.4-.288.671.671,0,0,0-.48.036.635.635,0,0,0-.309.44l-.324,1.252a.561.561,0,0,1-.539.428.543.543,0,0,1-.147-.02.579.579,0,0,1-.392-.7l1.969-7.695a.722.722,0,0,0-.067-.529.652.652,0,0,0-.393-.32A.612.612,0,0,0,86.091,3a.68.68,0,0,0-.307.417l-2.543,9.93a.56.56,0,0,1-.474.424.543.543,0,0,1-.065,0,.554.554,0,0,1-.493-.307l-1.3-2.554a1.734,1.734,0,0,0-1.316-.93.632.632,0,0,0-.325.082c-.324.191-.363.671-.1,1.253a28.335,28.335,0,0,1,1.6,4.43,13.03,13.03,0,0,0,.773,2.216,4.594,4.594,0,0,1,.289,3.195l-.209.793a.562.562,0,0,1-.538.424.543.543,0,0,1-.151-.022.579.579,0,0,1-.387-.7l.209-.792a3.4,3.4,0,0,0-.217-2.393,14.148,14.148,0,0,1-.84-2.4A26.972,26.972,0,0,0,78.15,11.8a2.03,2.03,0,0,1,.561-2.735,1.741,1.741,0,0,1,.884-.234,2.781,2.781,0,0,1,2.259,1.476q.014.022.025.045l.65,1.273,2.177-8.5A1.819,1.819,0,0,1,85.528,2a1.7,1.7,0,0,1,1.343-.186,1.764,1.764,0,0,1,1.069.862,1.9,1.9,0,0,1,.175,1.39l-1.227,4.8a1.834,1.834,0,0,1,1.707.831l.007.012a1.625,1.625,0,0,1,.325-.13,1.733,1.733,0,0,1,.468-.064,1.836,1.836,0,0,1,1.324.568,1.773,1.773,0,0,1,.479,1.294,1.644,1.644,0,0,1,.654.048,1.8,1.8,0,0,1,1.187,2.3L92.1,17.406a6.306,6.306,0,0,1-2.463,3.614,3.236,3.236,0,0,0-1.323,1.951l-.2.8A.56.56,0,0,1,87.572,24.2ZM91.4,12.112a.986.986,0,0,1,.268.037,1.063,1.063,0,0,1,.682,1.385l-.944,3.678A5.558,5.558,0,0,1,89.234,20.4a4.008,4.008,0,0,0-1.617,2.386l-.2.8a.177.177,0,0,0,.114.216.158.158,0,0,0,.189-.124l.2-.8A3.621,3.621,0,0,1,89.4,20.693a5.906,5.906,0,0,0,2.306-3.385l.944-3.677a1.426,1.426,0,0,0-.908-1.82,1.237,1.237,0,0,0-.712.012l-.316.1.058-.327a1.394,1.394,0,0,0-.344-1.238,1.434,1.434,0,0,0-1.035-.444,1.333,1.333,0,0,0-.36.049,1.221,1.221,0,0,0-.391.189l-.2.145-.1-.224a1.352,1.352,0,0,0-.088-.164,1.407,1.407,0,0,0-.813-.6,1.372,1.372,0,0,0-.77,0l-.34.1,1.394-5.448a1.5,1.5,0,0,0-.138-1.1,1.367,1.367,0,0,0-.827-.67,1.3,1.3,0,0,0-1.028.143,1.422,1.422,0,0,0-.64.872l-2.44,9.529-1.131-2.215-.008-.014A2.4,2.4,0,0,0,79.6,9.229a1.341,1.341,0,0,0-.681.179,1.653,1.653,0,0,0-.4,2.226,27.319,27.319,0,0,1,1.561,4.323,13.827,13.827,0,0,0,.817,2.335,3.781,3.781,0,0,1,.242,2.664l-.209.792a.177.177,0,0,0,.112.218.158.158,0,0,0,.191-.12l.209-.792a4.2,4.2,0,0,0-.265-2.923,13.345,13.345,0,0,1-.8-2.278,27.982,27.982,0,0,0-1.58-4.375c-.351-.784-.25-1.459.264-1.761a1.04,1.04,0,0,1,.528-.137A2.122,2.122,0,0,1,81.248,10.7l.009.016,1.309,2.562a.154.154,0,0,0,.154.088.163.163,0,0,0,.135-.126L85.4,3.313a1.078,1.078,0,0,1,.487-.66,1.016,1.016,0,0,1,.8-.111,1.048,1.048,0,0,1,.635.512,1.121,1.121,0,0,1,.1.821L85.455,11.57a.177.177,0,0,0,.113.217.158.158,0,0,0,.19-.122l.324-1.252a1.024,1.024,0,0,1,.512-.695,1.073,1.073,0,0,1,.773-.066,1.1,1.1,0,0,1,.632.459,1.065,1.065,0,0,1,.108.863l-.325,1.274a.177.177,0,0,0,.113.217.158.158,0,0,0,.19-.122l.327-1.28.054-.193.019.005a.956.956,0,0,1,.628-.572,1.049,1.049,0,0,1,.283-.038,1.149,1.149,0,0,1,.819.348,1.049,1.049,0,0,1,.23,1.019l-.325,1.273a.177.177,0,0,0,.113.217A.158.158,0,0,0,90.42,13,1.036,1.036,0,0,1,91.4,12.112ZM77.272,7.456a.545.545,0,0,1-.4-.172.591.591,0,0,1,0-.806l1.49-1.564h-.273a.575.575,0,0,1,0-1.15h1.6a.567.567,0,0,1,.557.575V6.02a.558.558,0,1,1-1.115,0V5.744L77.67,7.284A.545.545,0,0,1,77.272,7.456Zm.819-3.292a.176.176,0,0,0,0,.35H79.3L77.164,6.753a.189.189,0,0,0,0,.254.149.149,0,0,0,.216,0l2.157-2.263V6.02a.158.158,0,1,0,.315,0V4.339a.167.167,0,0,0-.157-.175Zm4.56-.672h-1.6a.567.567,0,0,1-.557-.575V1.236a.558.558,0,1,1,1.115,0v.276l1.467-1.54a.546.546,0,0,1,.8,0,.591.591,0,0,1,0,.806l-1.49,1.564h.272a.575.575,0,0,1,0,1.15Zm-1.6-2.431a.167.167,0,0,0-.157.175V2.917a.167.167,0,0,0,.157.175h1.6a.176.176,0,0,0,0-.35H81.445L83.58.5a.189.189,0,0,0,0-.254.149.149,0,0,0-.216,0L81.207,2.511V1.236A.167.167,0,0,0,81.049,1.061Z" transform="translate(76.585 568.5)" fill="#707070"/>
        </g>
      </svg>
  );
};

type PinchIndicatorProps = {
  isHidden: boolean;
  overlay: Overlay;
};

const PinchIndicator: React.FC<PinchIndicatorProps> = ({ isHidden, overlay }) => {
  const [visible, setVisibility] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisibility(true), 5000);
    return () => clearTimeout(timeout);
  }, [overlay]);
  if (isHidden || visible) return null;
  return (
    <div className="pinch-icon">
      <PinchIcon />
      <span>Appuyez 2 fois ou pincez pour zoomer</span>
    </div>
  );
};

type SliderOverlayProps = {
  overlay: Overlay;
  items: Picture[];
  control?: SwiperCore;
  setOverlaySwiper: (swiper: SwiperCore) => void;
  setOverlay: (overlay: Overlay) => void;
  video?: Video;
  overlaySwiper?: SwiperCore;
  allowFs: boolean;
  setAllowFs: (allowFs: boolean) => void;
};

const SliderOverlay = ({
  items,
  control,
  setOverlaySwiper,
  overlay,
  setOverlay,
  overlaySwiper,
  video,
  allowFs = true
}: SliderOverlayProps): JSX.Element => {
  const [isZoomed, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | undefined>();

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

  const slideHeight = useMemo(() => {
    const dialogHeight = dialogRef.current?.clientHeight || 0;
    const thumbsHeight = thumbsRef.current?.clientHeight || 0;
      return {
        // 34 : margin + spacing bottom
        height: isZoomed ? `${dialogHeight}px` : `${dialogHeight - thumbsHeight - 24}px`,
      }
  }, [overlay.isActive, isZoomed, dialogRef, thumbsRef]);

  if (!control) {
    return <></>;
  }

  return (
        <Dialog isActive={overlay.isActive} onClose={onClose} propsRef={dialogRef}>
            <PinchIndicator isHidden={isZoomed || overlay.isVideo} />
            {overlay.isVideo && (
                <div style={{...slideHeight, overflow: 'hidden' }}>
                  <iframe
                      src={video?.embed}
                      width="100%"
                      height={slideHeight.height}
                      title={video?.name}
                      frameBorder="0"
                      allowFullScreen={allowFs}
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
                navigation={!isZoomed}
                // pagination={!isZoomed && { clickable: true }}
                controller={{ control }}
                onSwiper={setOverlaySwiper}
                thumbs={{ swiper: thumbsSwiper }}
            >
              {items.map((picture, index) => (
                  <SwiperSlide key={'slider-overlay-' + index} style={slideHeight}>
                    <SliderImg isOverlay picture={picture} />
                  </SwiperSlide>
              ))}
                {/*{ video && (*/}
                {/*    <div className="video-bullet" onClick={() => setOverlay({ isActive: true, isVideo: true })}>*/}
                {/*        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"*/}
                {/*             viewBox="0 0 16 16">*/}
                {/*            <path*/}
                {/*                d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>*/}
                {/*        </svg>*/}
                {/*    </div>*/}
                {/*)}*/}
            </Swiper>
            <div ref={thumbsRef}>
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
