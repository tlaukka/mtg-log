import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

function FadeIn ({ duration = 0.4, children }) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(
    () => {
      setTimeout(() => {
        setVisible(true)
      }, 0)
    },
    []
  )

  if (!visible) {
    return null
  }

  return (
    <FadeInContainer duration={duration}>
      {children}
    </FadeInContainer>
  )
}

export function withFadeIn (WrappedComponent, duration = 0.4) {
  return function WithFadeIn (props) {
    const [visible, setVisible] = React.useState(false)

    React.useEffect(
      () => {
        setTimeout(() => {
          setVisible(true)
        }, 0)
      },
      []
    )

    if (!visible) {
      return null
    }

    return <WrappedComponent {...props} style={getFadeInStyle(duration)} />
  }
}

export function useFadeIn (duration = 0.4) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(
    () => {
      setTimeout(() => {
        setVisible(true)
      }, 0)
    },
    []
  )

  return {
    visible,
    fadeInStyle: getFadeInStyle(duration)
  }
}

function getFadeInStyle (duration) {
  return {
    animation: `${fadeIn} ${duration}s`
  }
}

const fadeIn = keyframes({
  '0%': {
    opacity: 0
  },
  '100%': {
    opacity: 1
  }
})

const FadeInContainer = styled('div')(({ duration }) => (getFadeInStyle(duration)))

export default FadeIn
