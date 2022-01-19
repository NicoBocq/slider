import React from 'react'
import NavItem from './NavItem'

const Nav = ({ currentIndex, data, onClick }) => {
  return (
    <div className="nav-container">
      {data.map((item, index) => (
        <NavItem
          key={index}
          active={currentIndex - 1 === index}
          id={index}
          onClick={onClick}
        />
      ))}
    </div>
  )
}

export default Nav
