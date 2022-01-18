import React, { useRef, useState, useEffect } from 'react'
import { useGesture } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'

const Overlay = ({ setOverlay, isActive, data, currentIndex, setActive, moveSlider }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 })

  const imageRef = useRef()

  // V -> useCallback
  // const runCrop = useCallback((e) => {
  //   console.log(e.offset)
  //   const x = e.xy[0]
  //   const y = e.xy[1]
  //   const scale = e.offset
  //   setCrop({ x, y, scale })
  // }, [])
  // V -> reset useState ?
  const resetCrop = () => {
    setCrop({ x: 0, y: 0, scale: 1 })
  }

  const onClose = () => {
    resetCrop()
    setOverlay(false)
    moveSlider(selectedId)
  }

  const onClick = (idx, item) => {
    resetCrop()
    setActive(idx + 1)
    // scrollTo(idx)
  }

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setCrop((crop) => ({ ...crop, x: dx, y: dy }))
      },
      onPinch: ({ offset: [d] }) => {
        // add max & min zoom
        if (d < 0.5 || d > 2.5) return
        setCrop((crop) => ({ ...crop, scale: d }))
      }
    },
    {
      target: imageRef,
      eventOptions: { passive: false }
    })

  const { opacity } = useSpring({
    opacity: isActive ? 1 : 0,
    // transform: isActive ? 'translate(0,0)' : 'translate(0,150px)',
    config: { mass: 5, tension: 500, friction: 80 }
  })

  const refs = data.reduce((acc, value, index) => {
    acc[index] = React.createRef()
    return acc
  }, {})

  useEffect(() => {
    console.log(refs)
  }, [refs])

  const scrollTo = (id) => {
    refs[id].current.scrollLeft = 0
  }
  const selectedId = currentIndex - 1

  const processedUrl = (url) => url.replace('medium', 'hd')

  // const transition = useTransition(onClick, {
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   config: config.molasses
  // })

  return (
    <animated.div className="overlay" style={{ display: isActive ? 'flex' : 'none', opacity }}>
      <button onClick={() => onClose()} className="close">
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
      <div className="nav-list">
        {data.map((item, index) => (
          <div
            ref={refs[index]}
            key={index}
            className={`nav-item ${selectedId === index ? 'selected' : ''}`}
            style={{ backgroundImage: `url(${item.url})` }}
            onClick={() => onClick(index)}
          />
        ))}
      </div>
      <div className="box-image">
        <animated.img
          src={processedUrl(data[selectedId].url)}
          alt=""
          style={{
            left: crop.x,
            top: crop.y,
            transform: `scale(${crop.scale})`,
            touchAction: 'none'
          }}
          ref={imageRef}
        />
      </div>
    </animated.div>
  )
}

export default Overlay
