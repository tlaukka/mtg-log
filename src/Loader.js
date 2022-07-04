import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"

const spin = keyframes({
  '100%': {
    transform: 'rotate(360deg)'
  }
})

// const Loader = styled('span')(({ isLoading }) => ({
//   ':before': {
//     content: '"/"',
//     display: isLoading ? 'inline-block' : 'none',
//     marginRight: 8,
//     animation: `${spin} 1s linear infinite`
//   }
// }))

const Loader = styled('span')({
  ':before': {
    content: '"/"',
    display: 'inline-block',
    margin: '0 8px',
    animation: `${spin} 1s linear infinite`
  }
})


export default Loader
