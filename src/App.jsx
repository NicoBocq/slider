import React from 'react'
import styled from 'styled-components'
import { a } from 'react-spring'
import Carousel from './Slider'
import items from './items'
import './styles.css'

const Main = styled.div`
  height: 450px;
  width: 80%;
  margin: 0 auto;
  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  & img {
   max-height:450px;
    display: block;
    margin: 0 auto;
  }
  @media (max-width: 768px) {
    & img {
      max-width: 100%;
      max-height: 100%;
    }
  }
`

const Image = styled(a.div)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
`

const App = () => (
  <Main>
    <Carousel items={items} itemWidth={'full'} visible={2}>
      {({ url }, i) => (
        <Content>
          <img src={url} alt="" />
        </Content>
      )}
    </Carousel>
  </Main>
)

export default App
