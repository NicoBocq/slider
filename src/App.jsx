import React from 'react'
import Carousel from './Slider'
import items from './items'
import './styles.scss'

// handle height in vh in css
const appHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}
window.addEventListener('load', appHeight)
window.addEventListener('resize', appHeight)

const App = () => (
  <Carousel items={items} />
)

export default App
