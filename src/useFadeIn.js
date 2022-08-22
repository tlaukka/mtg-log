import React from 'react'
import useDomReady from './useDomReady'

function useFadeIn (duration = 0.4) {
  const [opacity, setOpacity] = React.useState(0)

  const domReady = useDomReady()

  React.useEffect(
    () => {
      if (domReady) {
        setOpacity(1)
      }
    },
    [domReady]
  )

  const fadeIn = {
    transition: `opacity ${duration}s`,
    opacity
  }

  return fadeIn
}

export default useFadeIn
