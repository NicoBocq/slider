import React, { useRef, useCallback, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/zoom'
import 'swiper/css/effect-fade'
import SwiperCore, {
  Lazy, Zoom, Pagination, Navigation, EffectFade
} from 'swiper'

SwiperCore.use([Lazy, Zoom, Pagination, Navigation, EffectFade])

export default function Slider ({ items }) {
  const [isOverlay, setOverlay] = useState(false)

  const sliderRef = useRef(null)

  const toggleOverlay = () => {
    setOverlay(!isOverlay)
  }

  const onClickImage = () => {
    if (isOverlay) return
    toggleOverlay()
  }

  const { opacity } = useSpring({
    opacity: isOverlay ? 1 : 0,
    // transform: isActive ? 'translate(0,0)' : 'translate(0,150px)',
    config: { mass: 5, tension: 500, friction: 80 }
  })

  return (
    <>
      <animated.div className="alltricks-slider">
        {isOverlay && (
          <>
            <button onClick={() => toggleOverlay()} className="close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="pinch-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </div>
          </>
        )}
        <Swiper
          spaceBetween={0}
          ref={sliderRef}
          slidesPerView={1}
          loop={true}
          zoom={true}
          lazy={true}
          effect={'fade'}
          pagination={{
            clickable: true
          }}
          navigation={true}
          className={ isOverlay ? 'overlay-slider' : '' }
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-zoom-container">
                <img data-src={item.url_hd} alt="" onClick={() => onClickImage()} className="swiper-lazy" />
              </div>
              <div className="swiper-lazy-preloader swiper-lazy-preloader-white" />
            </SwiperSlide>
          ))}
        </Swiper>
      </animated.div>
    </>
  )
}
