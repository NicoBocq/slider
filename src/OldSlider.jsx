import React, { useRef, useCallback, useState, useEffect } from 'react'
import { useGesture } from '@use-gesture/react'
import { useSprings, animated, useSpring } from 'react-spring'
import debounce from 'lodash.debounce'
import Overlay from './Overlay'
import Nav from './Nav'

SwiperCore.use([Zoom, Pagination, Navigation])

const styles = {
  buttonsContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    display: 'flex',
    alignItems: 'center'
  },
  prevButton: {
    position: 'absolute',
    background: 'none',
    color: '#008bd2',
    border: 'none',
    marginLeft: '-60px'
  },
  nextButton: {
    marginRight: '-60px',
    position: 'absolute',
    background: 'none',
    color: '#008bd2',
    border: 'none',
    marginLeft: '-30px',
    right: 0
  }
}

export default function SliderContainer (props) {
  const [width, setWidth] = useState(0)

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width)
    }
  }, [])

  return (
    <>
       <div ref={measuredRef} className="at-slider">
        {width !== 0
          ? (
          <Slider {...props} itemWidth={width} />
            )
          : (
              'null'
            )}
       </div>
    </>
  )
}

/**
 * Calculates a spring-physics driven infinite slider
 *
 * @param {Array} items - display items
 * @param {Function} children - render child
 * @param {number} width - fixed item with
 * @param {number} visible - number of items that must be visible on screen
 * @param {object} style - container styles
 * @param {boolean} showButtons - shows buttons
 * @param {boolean} showCounter - shows counter
 */

const Slider = ({ items, itemWidth = 'full', visible = items.length - 2, style, showButtons = true, showCounter = true }) => {
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const width = itemWidth === 'full' ? windowWidth : Math.ceil(itemWidth)
  const idx = useCallback((x, l = items.length) => (x < 0 ? x + l : x) % l, [items])
  const getPos = useCallback((i, firstVis, firstVisIdx) => idx(i - firstVis + firstVisIdx), [idx])
  // Important only if specifyng width, centers the element in the slider
  const offset = 0
  const [springList, setSprings] = useSprings(items.length, (i) => ({ x: (i < items.length - 1 ? i : -1) * width + offset }))
  const prev = useRef([0, 1])
  const index = useRef(0)
  const [active, setActive] = useState(1)
  const runSprings = useCallback(
    (y, vy, down, xDir, cancel, xMove) => {
      console.log(y, vy, down, xDir, xMove)
      /*
      * y : current position of the element
      * vy : current velocity of the element
      * down : is the element being dragged
      * xDir: direction of the movement
      * cancel: cancel the movement
      * XMove: current movement of the element
      * */
      // This decides if we move over to the next slide or back to the initial
      if (!down) {
        index.current += ((-xMove + (width + xMove)) / width) * (xDir > 0 ? -1 : 1)
        // cancel()
      }
      if (index.current + 1 > items.length) {
        setActive((index.current % items.length) + 1)
      } else if (index.current < 0) {
        setActive(items.length + ((index.current + 1) % items.length))
      } else {
        setActive(index.current + 1)
      }
      // The actual scrolling value
      const finalY = index.current * width
      // Defines currently visible slides
      const firstVis = idx(Math.floor(finalY / width) % items.length)
      const firstVisIdx = vy < 0 ? items.length - visible - 1 : 1
      setSprings((i) => {
        const position = getPos(i, firstVis, firstVisIdx)
        const prevPosition = getPos(i, prev.current[0], prev.current[1])
        const rank = firstVis - (finalY < 0 ? items.length : 0) + position - firstVisIdx + (finalY < 0 && firstVis === 0 ? items.length : 0)
        return {
          // x is the position of each of our slides
          x: (-finalY % (width * items.length)) + width * rank + (down ? xMove : 0) + offset,
          // this defines if the movement is immediate
          // So when an item is moved from one end to the other we don't
          // see it moving
          immediate: vy < 0 ? prevPosition > position : prevPosition < position
        }
      })
      prev.current = [firstVis, firstVisIdx]
    },
    [idx, getPos, width, visible, setSprings, items.length]
  )

  // const wheelOffset = useRef(0)
  // const dragOffset = useRef(0)
  // const bind = useGesture({
  //   onDrag: ({ offset: [x], vxvy: [vx] }) => vx && ((dragOffset.current = -x), runSprings(wheelOffset.current + -x, 0)),
  //   onWheel: ({ offset: [, y], vxvy: [, vy] }) => vy && ((wheelOffset.current = y), runSprings(dragOffset.current + y, 0))
  // })

  // const bind = useDrag(({ offset: [x], vxvy: [vx], down, direction: [xDir], cancel, movement: [xMove] }) => {
  //   vx && runSprings(-x, -vx, down, xDir, cancel, xMove)
  // })

  const bind = useGesture({
    onDrag: ({ offset: [x], direction: [xDir], down, movement: [xMove], cancel, tap }) => {
      const dir = xDir < 0 ? 1 : -1
      xDir && runSprings(-x, dir, down, xDir, cancel, xMove)
    },
    onWheel: ({ offset: [, y], direction: [, vy], down, movement: [xMove], cancel }) => {
      // use scroll y (vy) direction to determine direction
      runSprings(-y, -vy, down, vy, cancel, xMove)
    }
  }, {
    eventOptions: {
      capture: false,
      passive: true
    }
  })

  const onClickButtons = (next) => {
    index.current += next
    runSprings(0, next, true, -0, () => {}, -0)
  }

  const onClickNav = (id) => {
    index.current = id
    runSprings(0, id, true, 0, () => {}, 0)
  }

  const debounceTransition = debounce(onClickButtons, 10)
  const debounceDotClick = debounce(onClickNav, 10)

  const [isOverlayActive, setOverlay] = useState(false)

  const onClickOverlay = () => {
    setOverlay(true)
  }

  return (
    <>
      {showButtons
        ? (
        <div style={{ ...styles.buttonsContainer }}>
          <button className="nav" style={{ ...styles.prevButton }} onClick={() => debounceTransition(-1)}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button className="nav" style={{ ...styles.nextButton }} onClick={() => debounceTransition(1)}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z" fill="currentColor" />
            </svg>
          </button>
        </div>
          )
        : null}
      <div {...bind()} className="container" style={{ ...style }}>
        {springList.map(({ x, vel }, i) => (
          <animated.div key={i} className="item" style={{ width, x }} >
            <img src={items[i].url} alt="" onClick={() => onClickOverlay()} />
          </animated.div>
        ))}
      </div>
      <Overlay setOverlay={setOverlay} isActive={isOverlayActive} data={items} currentIndex={active} setActive={setActive} moveSlider={onClickNav} />
       {showCounter ? <Nav currentIndex={active} data={items} onClick={debounceDotClick} /> : null}
    </>
  )
}
