import React, {useEffect, useState} from 'react'
import Slider from './Slider'
import props from './items'
import './styles.scss'
import 'swiper/css/bundle'

const App = () => {
  const [items, setItems] = React.useState(props[0])
  const [allowFs, setAllowFs] = useState(false);

  const onClickFs = () => {
    setAllowFs(!allowFs)
  }
  return (
    <div className="product">
      <div className="product-media">
        <Slider {...items} allowFs={allowFs} setAllowFs={setAllowFs} />
        <div style={{margin: '0 0 10px 0'}}>
          <button onClick={onClickFs}>fullscreen {allowFs ? 'enabled' : 'disabled'}</button>
        </div>
        <div style={{margin: '0 0 10px 0'}}>
          <button onClick={() => setItems(props[0])}>Default</button>
          <button onClick={() => setItems(props[1])}>no video</button>
          <button onClick={() => setItems(props[2])}>2 items</button>
          <button onClick={() => setItems(props[3])}>1 item / no video</button>
          <button onClick={() => setItems(props[4])}>1 item / 1 video</button>
        </div>
        <p>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
      </div>
      <div className="product-info">
        <p>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
      </div>
    </div>
  )
}

export default App
