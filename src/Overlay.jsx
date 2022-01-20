import React, { useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const Overlay = ({ setOverlay, isActive, data, currentIndex, setActive, moveSlider }) => {
  const transformRef = useRef()
  const [doubleStep, setDoubleStep] = useState(8)
  const resetCrop = () => {
    transformRef.current?.resetTransform()
  }

  const onClose = () => {
    resetCrop()
    setOverlay(false)
    moveSlider(selectedId)
  }

  const onClick = (idx) => {
    resetCrop()
    setActive(idx + 1)
    // scrollTo(idx)
  }

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
      <TransformWrapper
        wrapperClass="box-image"
        ref={transformRef}
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        doubleClick={{ step: doubleStep }}
        onPanningStop={(e) => {
          if (e.state.scale !== 1) {
            setDoubleStep(-8)
          } else {
            setDoubleStep(8)
          }
        }}
        options={{
          limitX: true,
          limitY: true,
          minScale: 1,
          maxScale: 1,
          wheel: true,
          pinch: true,
          doubleClick: true,
          drag: true,
          transformOrigin: '0 0'
        }}
      >
        <TransformComponent>
          <img src={processedUrl(data[selectedId].url)} alt="" />
        </TransformComponent>
      </TransformWrapper>
    </animated.div>
  )
}

export default Overlay
