import React, { useEffect, useMemo, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { Swiper, SwiperSlide } from 'swiper/react'
import './styles.scss'
import 'swiper/css/bundle'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/zoom'
import 'swiper/css/effect-fade'
import SwiperCore, {
  Lazy, Zoom, Pagination, Navigation, Controller, Thumbs
} from 'swiper'

SwiperCore.use([Lazy, Zoom, Pagination, Navigation, Controller, Thumbs])

export default function Slider ({ items }) {
  const [swiper, setSwiper] = useState(null)
  const [swiperOverlay, setSwiperOverlay] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [thumbsSwiperOverlay, setThumbsSwiperOverlay] = useState(null)
  const [isOverlay, setOverlay] = useState(false)
  const [isZoomed, setZoom] = useState(false)
  const dialogRef = useRef(null)
  const [heightDialog, setHeightDialog] = useState(0)

  const toggleOverlay = () => {
    setOverlay(!isOverlay)
  }

  const watchZoom = (e) => {
    // get the scale when the event is triggered
    setZoom(e.zoom.scale === 1)
  }

  const onClose = (e) => {
    // e.stopPropagation()
    toggleOverlay()
    // reset zoom
    isOverlay && swiperOverlay.zoom.out()
  }

  const onClickImage = (id) => {
    if (isOverlay) return
    toggleOverlay()
  }

  const Close = () => {
    if (!isOverlay) return null
    return (
      <button onClick={(e) => onClose(e)} className="close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )
  }

  const overlayAnimation = useSpring({
    transform: isOverlay ? 'scale(1)' : 'scale(0.5)',
    opacity: isOverlay ? 1 : 0
  })

  const PinchIcon = () => {
    if (!isOverlay || isZoomed) return null
    return (
      <div className="pinch-icon">
        <span>Appuyez 2 fois ou pincez pour zoomer</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
        </svg>
      </div>
    )
  }

  useEffect(() => {
    // todo : moche
    setHeightDialog(dialogRef.current.clientHeight)
    if (isOverlay) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    // console.log(swiperOverlay)
  }, [isOverlay, dialogRef])

  // const styleHeight = useMemo(() => {
  //   // get height of dialoag ref
  //   let height = 0
  //   if (dialogRef.current) {
  //     height = dialogRef.current.clientHeight
  //   }
  //   console.log(height)
  //   return {
  //     height: `${height}px`
  //   }
  // }, [isOverlay, dialogRef])

  const thumbItems = []
  for (const item of items) {
    thumbItems.push(
      <SwiperSlide key={`thumb-${item.id}`} tag="div" style={{ backgroundImage: `url(${item.url_thumb}`, height: '48px', width: '48px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        { item.vid && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9.2" style={{ width: '28px', fill: '#188acb' }}>
            <g id="Calque_2" data-name="Calque 2">
              <g id="Calque_1-2" data-name="Calque 1">
                <path id="camera-video-avec-bouton-de-lecture" className="cls-1"
                      d="M15.3.6a1.06,1.06,0,0,0-1.2.2l-2,2.1V1.6A1.58,1.58,0,0,0,10.5,0H1.6A1.64,1.64,0,0,0,0,1.6v6A1.58,1.58,0,0,0,1.6,9.2h8.9a1.58,1.58,0,0,0,1.6-1.6V6.4l2,2.1a1.06,1.06,0,0,0,1.2.2,1.2,1.2,0,0,0,.7-1V1.6A1.2,1.2,0,0,0,15.3.6ZM7.6,5.1,5.4,6.8a.45.45,0,0,1-.5,0c-.2-.1-.3-.2-.3-.4V2.9a.55.55,0,0,1,.3-.5.47.47,0,0,1,.6.1L7.7,4.2a.77.77,0,0,1-.1.9c.1-.1,0-.1,0,0Z"/>
              </g>
            </g>
          </svg>
        )}
      </SwiperSlide>
    )
  }

  return (
    <>
      <div className="alltricks-slider">
        <Swiper
          onSwiper={setSwiper}
          spaceBetween={0}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          controller={{ control: swiperOverlay }}
          loop
          zoom={false}
          lazy={true}
          preventInteractionOnTransition={true}
          navigation={true}
          onZoomChange={(e) => watchZoom(e)}
        >
          {items.map((item, index) => (
            <SwiperSlide key={ index }>
              {item.vid
                ? (
                  <div className="video-container">
                    <iframe
                      className="mfp-iframe"
                      src="//www.youtube.com/embed/pQNnjuYQVtg?autoplay=1&amp;mute=1&amp;rel=0"
                      height="350px"
                      width="100%"
                      frameBorder="0"
                      allowFullScreen="">
                    </iframe>
                  </div>
                  )
                : (
                  <>
                    <div className="swiper-zoom-container">
                      <img
                        data-src={item.url}
                        alt=""
                        onClick={() => onClickImage(index)}
                        className="swiper-lazy"
                      />
                      <div className="swiper-lazy-preloader"/>
                    </div>
                  </>
                  )
              }
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          id="thumbs"
          spaceBetween={10}
          slidesPerView='auto'
          onSwiper={setThumbsSwiper}
        >
          {thumbItems}
        </Swiper>
          <div className="overlay" style={{ display: isOverlay ? 'flex' : 'none' }}>
            <animated.div className="dialog" style={overlayAnimation} ref={dialogRef}>
              <Close />
              <PinchIcon />
              <Swiper
                onSwiper={setSwiperOverlay}
                spaceBetween={0}
                slidesPerView={1}
                controller={{ control: swiper }}
                thumbs={{ swiper: thumbsSwiperOverlay }}
                loop
                zoom
                lazy
                allowSlideNext={!isZoomed}
                allowSlidePrev={!isZoomed}
                preventInteractionOnTransition
                navigation={!isZoomed}
                onZoomChange={(e) => watchZoom(e)}
              >
                {items.map((item, index) => (
                  <SwiperSlide key={ index } style={{ height: isZoomed ? heightDialog : `${heightDialog - 85}px` }}>
                    {item.vid
                      ? (
                        <div className="video-container">
                          <iframe
                            className="mfp-iframe"
                            height={`${heightDialog - 85}px`}
                            width="100%"
                            src="//www.youtube.com/embed/pQNnjuYQVtg?autoplay=1&amp;mute=1&amp;rel=0"
                            frameBorder="0"
                            allowFullScreen>
                          </iframe>
                        </div>
                        )
                      : (
                        <>
                          <div className="swiper-zoom-container">
                            <img
                              data-src={item.url_hd}
                              alt=""
                              className="swiper-lazy"
                            />
                            <div className="swiper-lazy-preloader"/>
                          </div>
                        </>
                        )
                    }
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                spaceBetween={10}
                slidesPerView='auto'
                onSwiper={setThumbsSwiperOverlay}
                style={{ display: isZoomed ? 'none' : 'block' }}
              >
                {thumbItems}
              </Swiper>
            </animated.div>
          </div>
      </div>
    </>
  )
}
