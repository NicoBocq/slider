import React, { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { PinchToolTipProps } from './PinchTooltip.types'
import { PinchIcon } from './PinchIcon'
// import { useTranslation } from 'react-i18next'

const visibilityChangeDelay = 3000

const PinchTooltip = ({ active }: PinchToolTipProps): JSX.Element => {
  const [visible, setVisibility] = useState(true)

  // const { t } = useTranslation()

  useEffect(() => {
    if (!active) return
    const timeout = setTimeout(() => setVisibility(false), visibilityChangeDelay)
    return () => clearTimeout(timeout)
  }, [active])

  const fade = useSpring({
    opacity: visible ? 1 : 0
  })

  return (
      <animated.div className='pinch-tooltip' style={fade}>
        {PinchIcon}
        {/*<span>{t('sliderProduct.tooltip')}</span>*/}
      </animated.div>
  )
}

export default PinchTooltip
