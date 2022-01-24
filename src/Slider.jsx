import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { animated, useSpring } from 'react-spring'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/zoom'
import 'swiper/css/effect-fade'
import SwiperCore, {
  Lazy, Zoom, Pagination, Navigation, Keyboard
} from 'swiper'

SwiperCore.use([Lazy, Zoom, Pagination, Navigation, Keyboard])

export default function Slider ({ items }) {
  const [isOverlay, setOverlay] = useState(false)
  const [isZoomed, setZoom] = useState(false)
  const sliderRef = useRef(null)

  const toggleOverlay = () => {
    setOverlay(!isOverlay)
  }

  const watchZoom = (e) => {
    setZoom(e.zoom.scale < 3)
  }

  const imgKey = useMemo(() => {
    return isOverlay ? 'url_hd' : 'url'
  }, [isOverlay])

  const onClose = () => {
    if (!isOverlay) return
    setOverlay(false)
    sliderRef.current.swiper.zoom.out()
  }

  const onClickImage = () => {
    if (isOverlay) return
    toggleOverlay()
  }

  // const isIdVideo = (item) => {
  //   return items
  // }

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

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      // if (isOverlay) {
      //   return `<span class="${className}"></span>`
      // } else {
      return `<div class="${className}" style="background-image:url(${items[index].url_thumb})">
<!--        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9.2"><defs><style>.cls-1{fill:#188acb;}</style></defs><g id="Calque_2" data-name="Calque 2"><g id="Calque_1-2" data-name="Calque 1"><path id="camera-video-avec-bouton-de-lecture" class="cls-1" d="M15.3.6a1.06,1.06,0,0,0-1.2.2l-2,2.1V1.6A1.58,1.58,0,0,0,10.5,0H1.6A1.64,1.64,0,0,0,0,1.6v6A1.58,1.58,0,0,0,1.6,9.2h8.9a1.58,1.58,0,0,0,1.6-1.6V6.4l2,2.1a1.06,1.06,0,0,0,1.2.2,1.2,1.2,0,0,0,.7-1V1.6A1.2,1.2,0,0,0,15.3.6ZM7.6,5.1,5.4,6.8a.45.45,0,0,1-.5,0c-.2-.1-.3-.2-.3-.4V2.9a.55.55,0,0,1,.3-.5.47.47,0,0,1,.6.1L7.7,4.2a.77.77,0,0,1-.1.9c.1-.1,0-.1,0,0Z"/></g></g></svg>-->
      </div>`
      // }
    }
  }

  return (
    <>
      <div className={`alltricks-slider ${isOverlay ? 'overlay' : ''}`}>
        <div className={ isOverlay ? 'dialog' : 'default'}>
          <Close />
          <PinchIcon />
          <Swiper
            spaceBetween={0}
            ref={sliderRef}
            slidesPerView={1}
            loop={true}
            zoom={true}
            lazy={true}
            preventInteractionOnTransition={true}
            keyboard={{
              enabled: true
            }}
            allowSlideNext={!isZoomed}
            allowSlidePrev={!isZoomed}
            pagination={pagination}
            navigation={true}
            onZoomChange={(e) => watchZoom(e)}
          >
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                {item.vid
                  ? (
                    <div className="video-container">
                      <div className="yt-player" data-id="pQNnjuYQVtg"></div>
                    </div>
                    )
                  : (
                    <>
                      <div className="swiper-zoom-container">
                        <img
                          data-src={item[imgKey]}
                          alt=""
                          onClick={() => onClickImage()}
                          className="swiper-lazy"
                          key={'image' + index}
                        />
                        <div className="swiper-lazy-preloader"/>
                      </div>
                    </>
                    )
                }
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
      </div>
    </>
  )
}
