// eslint-disable-next-line react/prop-types
import React from 'react'
import NavItem from './NavItem'

const Nav = ({ currentIndex, data, onClick }) => {
  // eslint-disable-next-line react/prop-types
  // for (const [index] of data.entries()) {
  //   dots.push(<NavItem key={index} active={currentIndex - 1 === index} id={index} />)
  // }
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
