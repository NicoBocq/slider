import React from 'react'
import Slider from './Slider'
import items from './items'
import './styles.scss'
import 'swiper/css/bundle'

// handle height in vh in css
const appHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}
window.addEventListener('load', appHeight)
window.addEventListener('resize', appHeight)

const App = () => (
  <Slider items={items} />
)

export default App
