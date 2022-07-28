import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import Colors from './Colors'


function Spinner ({ type, ...rest }) {
  return <SpinnerContainer color={getColor(type)} {...rest} />
}

function getColor (type) {
  switch (type) {
    case 'light': return light
    case 'dark': return dark
    default: return light
  }
}

const light = {
  background: Colors.foregroundDark,
  foreground: Colors.control
}

const dark = {
  background: Colors.backgroundDark,
  foreground: Colors.backgroundLight
}


const spin = keyframes({
  '100%': {
    transform: 'rotate(360deg)'
  }
})

const SpinnerContainer = styled('span')({
  display: 'inline-block',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`
}, ({ size = 24, color = light }) => ({
  width: size,
  height: size,
  border: `2px solid ${color.background}`,
  borderTop: `2px solid ${color.foreground}`
}))

export default Spinner
