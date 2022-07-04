import styled from '@emotion/styled'
import Colors from './Colors'

const Button = styled('button')({
  cursor: 'pointer',
  padding: '8px 12px',
  outline: 'none',
  border: 'none',
  borderRadius: 3,
  color: Colors.control,
  backgroundColor: Colors.backgroundDark,
  ':hover': {
    color: Colors.link
  }
})

export default Button
