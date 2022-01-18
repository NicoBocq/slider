import { animated, useSpring } from 'react-spring'
import React from 'react'

const NavItem = ({ active, onClick, id }) => {
  const { transform, opacity, background } = useSpring({
    opacity: active ? 1 : 1,
    transform: active ? 'scale(1)' : 'scale(1)',
    background: active ? '#707070' : '#fff',
    config: { mass: 5, tension: 500, friction: 80 }
  })
  return <animated.div className="nav-item" style={{ opacity: opacity.to((o) => o), transform, background }} onClick={() => onClick(id)} />
}

export default NavItem
