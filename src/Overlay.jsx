import React, { useRef, useState, useMemo } from 'react'
import { useGesture } from '@use-gesture/react'
import { animated, useSpring } from 'react-spring'
import { animate, motion, useMotionValue } from 'framer-motion'

function ImageCropper ({ src, crop, onCropChange }) {
  const x = useMotionValue(crop.x)
  const y = useMotionValue(crop.y)
  const scale = useMotionValue(crop.scale)
  const [isDragging, setIsDragging] = useState(false)
  const [isPinching, setIsPinching] = useState(false)

  const imageRef = useRef()
  const imageContainerRef = useRef()
  useGesture(
    {
      onDrag: ({ dragging, movement: [dx, dy] }) => {
        setIsDragging(dragging)
        x.stop()
        y.stop()

        const imageBounds = imageRef.current.getBoundingClientRect()
        const containerBounds = imageContainerRef.current.getBoundingClientRect()
        const originalWidth = imageRef.current.clientWidth
        const widthOverhang = (imageBounds.width - originalWidth) / 2
        const originalHeight = imageRef.current.clientHeight
        const heightOverhang = (imageBounds.height - originalHeight) / 2
        const maxX = widthOverhang
        const minX = -(imageBounds.width - containerBounds.width) + widthOverhang
        const maxY = heightOverhang
        const minY =
          -(imageBounds.height - containerBounds.height) + heightOverhang

        x.set(dx, [minX, maxX])
        y.set(dy, [minY, maxY])
      },

      onPinch: ({
        pinching,
        event,
        memo,
        origin: [pinchOriginX, pinchOriginY],
        offset: [d]
      }) => {
        event.preventDefault()
        setIsPinching(pinching)
        x.stop()
        y.stop()

        memo ??= {
          bounds: imageRef.current.getBoundingClientRect(),
          crop: { x: x.get(), y: y.get(), scale: scale.get() }
        }

        const transformOriginX = memo.bounds.x + memo.bounds.width / 2
        const transformOriginY = memo.bounds.y + memo.bounds.height / 2

        const displacementX = (transformOriginX - pinchOriginX) / memo.crop.scale
        const displacementY = (transformOriginY - pinchOriginY) / memo.crop.scale

        const initialOffsetDistance = (memo.crop.scale - 1) * 200
        const movementDistance = d - initialOffsetDistance

        scale.set(d)
        x.set(memo.crop.x + (displacementX * movementDistance) / 200)
        y.set(memo.crop.y + (displacementY * movementDistance) / 200)

        return memo
      },

      onDragEnd: maybeAdjustImage,
      onPinchEnd: maybeAdjustImage
    },
    {
      drag: {
        from: () => [x.get(), y.get()]
      },
      pinch: {
        distanceBounds: { min: 0 }
      },
      target: imageRef,
      eventOptions: { passive: false }
    }
  )

  function maybeAdjustImage () {
    const newCrop = { x: x.get(), y: y.get(), scale: scale.get() }
    const imageBounds = imageRef.current.getBoundingClientRect()
    const containerBounds = imageContainerRef.current.getBoundingClientRect()
    const originalWidth = imageRef.current.clientWidth
    const widthOverhang = (imageBounds.width - originalWidth) / 2
    const originalHeight = imageRef.current.clientHeight
    const heightOverhang = (imageBounds.height - originalHeight) / 2

    if (imageBounds.left > containerBounds.left) {
      newCrop.x = widthOverhang
    } else if (imageBounds.right < containerBounds.right) {
      newCrop.x = -(imageBounds.width - containerBounds.width) + widthOverhang
    }

    if (imageBounds.top > containerBounds.top) {
      newCrop.y = heightOverhang
    } else if (imageBounds.bottom < containerBounds.bottom) {
      newCrop.y =
        -(imageBounds.height - containerBounds.height) + heightOverhang
    }

    animate(x, newCrop.x, {
      type: 'tween',
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1]
    })
    animate(y, newCrop.y, {
      type: 'tween',
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1]
    })
    onCropChange(newCrop)
  }

  return (
    <>
      <div className="box-image" ref={imageContainerRef}>
        <motion.img
          src={src}
          alt=""
          style={{
            x: x,
            y: y,
            scale: scale,
            touchAction: 'none',
            userSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserDrag: 'none'
          }}
          ref={imageRef}
        />
      </div>
    </>
  )
}

const Overlay = ({ setOverlay, isActive, data, currentIndex, setActive, moveSlider }) => {
  // const [xy, setXY] = useState({ x: 0, y: 0 })
  // const [scale, setScale] = useState(1)
  // const imageRef = useRef()
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 })

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
      <div className="console">{crop.scale} - {crop.x} - {crop.y}</div>
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
      <ImageCropper src={processedUrl(data[selectedId].url)} crop={crop} onCropChange={setCrop} />
    </animated.div>
  )
}

function dampen (val, [min, max]) {
  if (val > max) {
    const extra = val - max
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra)
    return max + dampenedExtra * 2
  } else if (val < min) {
    const extra = val - min
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra)
    return min + dampenedExtra * 2
  } else {
    return val
  }
}

export default Overlay
