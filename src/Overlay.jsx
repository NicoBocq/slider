import React, { useRef, useState, useMemo } from 'react'
import { useGesture } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'

const Overlay = ({ setOverlay, isActive, data, currentIndex, setActive, moveSlider }) => {
  const [xy, setXY] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const imageRef = useRef()

  const resetCrop = () => {
    setXY({ x: 0, y: 0 })
    setScale(1)
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
      onDrag: ({ movement: [dx, dy] }) => {
        scale > 1 && setXY({ x: dx, y: dy })
      },
      onPinch: ({ offset: [d] }) => {
        // add max & min zoom
        setScale(d)
      }
    },
    {
      target: imageRef,
      eventOptions: { passive: false }
    })

  const gestureStyles = useMemo(() => {
    const { x, y } = xy
    // on normal zoom disable translate
    // if (scale === 1) {
    //   x = 0
    //   y = 0
    // }
    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
      cursor: scale > 1 ? 'pointer' : 'grab'
    }
  }, [xy, scale])

  const { opacity } = useSpring({
    opacity: isActive ? 1 : 0,
    // transform: isActive ? 'translate(0,0)' : 'translate(0,150px)',
    config: { mass: 5, tension: 500, friction: 80 }
  })

  const refs = data.reduce((acc, value, index) => {
    acc[index] = React.createRef()
    return acc
  }, {})

  // useEffect(() => {
  //   console.log(refs)
  // }, [refs])

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
      <div className="console">{scale} - {xy.x} - {xy.y}</div>
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
            touchAction: 'none',
            ...gestureStyles
          }}
          ref={imageRef}
        />
      </div>
    </animated.div>
  )
}

export default Overlay
