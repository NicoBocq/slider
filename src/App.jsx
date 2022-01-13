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
`

const Content = styled.div`
  width: 100%;
  height: 100%;
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
          <Image style={{ backgroundImage: `url(${url})` }} />
        </Content>
      )}
    </Carousel>
  </Main>
)

export default App
