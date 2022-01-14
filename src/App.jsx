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
  }
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const Image = styled(a.div)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
`
const Info = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  background-color: black;
  color: white;
  padding: 1rem;
  width: min-content;
  opacity: 0.8;
`

const App = () => (
  <Main>
    <Carousel items={items} itemWidth={'full'} visible={2}>
      {({ url }, i) => (
        <Content>
          <Image style={{ backgroundImage: `url(${url})` }} />
        </Content>
      )}
    </Carousel>
  </Main>
)

export default App
