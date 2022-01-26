import React, { useState } from 'react'
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
  Lazy, Zoom, Pagination, Navigation, Keyboard, Controller, Thumbs
} from 'swiper'

SwiperCore.use([Lazy, Zoom, Pagination, Navigation, Keyboard, Controller, Thumbs])

export default function Slider ({ items }) {
  const [swiper, setSwiper] = useState(null)
  const [swiperOverlay, setSwiperOverlay] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [thumbsSwiperOverlay, setThumbsSwiperOverlay] = useState(null)
  const [isOverlay, setOverlay] = useState(false)
  const [isZoomed, setZoom] = useState(false)

  const toggleOverlay = () => {
    setOverlay(!isOverlay)
  }

  const watchZoom = (e) => {
    setZoom(e.zoom.scale < 3)
  }

  const onClose = () => {
    toggleOverlay()
    swiperOverlay.zoom.out()
  }

  const onClickImage = (id) => {
    if (isOverlay) return
    toggleOverlay()
  }

  const Close = () => {
    if (!isOverlay) return null
    return (
      <button onClick={() => onClose()} className="close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )
  }

  const overlayAnimation = useSpring(() => ({
    transform: isOverlay ? 'translate3d(0,0%,0)' : 'translate3d(0,-85%,0)',
    opacity: isOverlay ? 1 : 0
  }))

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

  const thumbItems = []
  for (const item of items) {
    thumbItems.push(
      <SwiperSlide key={`thumb-${item.id}`} tag="div" style={{ backgroundImage: `url(${item.url_thumb}`, height: '48px', width: '48px', backgroundSize: 'cover', backgroundPosition: 'center' }} />
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
          loop={true}
          zoom={false}
          lazy={true}
          preventInteractionOnTransition={true}
          keyboard={{
            enabled: true
          }}
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
            <animated.div className="dialog" style={{ overlayAnimation }}>
              <Close />
              <PinchIcon />
              <Swiper
                onSwiper={setSwiperOverlay}
                spaceBetween={0}
                slidesPerView={1}
                controller={ { control: swiper } }
                thumbs={{ swiper: thumbsSwiperOverlay }}
                loop={true}
                zoom={true}
                lazy={true}
                allowSlideNext={!isZoomed}
                allowSlidePrev={!isZoomed}
                preventInteractionOnTransition={true}
                keyboard={{
                  enabled: true
                }}
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
                            frameBorder="0"
                            allowFullScreen="">
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
              >
                {thumbItems}
              </Swiper>
            </animated.div>
          </div>
      </div>
    </>
  )
}
