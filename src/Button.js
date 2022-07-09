import styled from '@emotion/styled'
import Colors from './Colors'

const Button = styled('button')({
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  lineHeight: '32px',
  padding: '0px 12px',
  outline: 'none',
  border: 'none',
  borderRadius: 3,
  color: Colors.control,
  backgroundColor: Colors.backgroundDark,
  ':hover': {
    color: Colors.link
  },
  ':disabled': {
    cursor: 'default',
    color: Colors.control,
    backgroundColor: Colors.foregroundDark
  }
})

export const dangerStyles = {
  color: Colors.decline,
  ':hover': {
    color: Colors.declineLight
  }
}

export const acceptStyles = {
  color: Colors.accept,
  ':hover': {
    color: Colors.acceptLight
  }
}

Button.Danger = styled(Button)({
  ...dangerStyles
})

Button.Accept = styled(Button)({
  ...acceptStyles
})

export default Button
