import styled from '@emotion/styled'
import Colors from './Colors'

const Button = styled('button')({
  cursor: 'pointer',
  fontSize: 12,
  lineHeight: '32px',
  letterSpacing: 0.4,
  whiteSpace: 'nowrap',
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
    color: Colors.foregroundDark
  }
})

export const acceptStyles = {
  color: Colors.accept,
  ':hover': {
    color: Colors.acceptLight
  }
}

export const dangerStyles = {
  color: Colors.decline,
  ':hover': {
    color: Colors.declineLight
  }
}

export const declineStyles = {
  color: Colors.foregroundDark,
  ':hover': {
    color: Colors.decline
  }
}

Button.Accept = styled(Button)({
  ...acceptStyles
})

Button.Danger = styled(Button)({
  ...dangerStyles
})

Button.Decline = styled(Button)({
  ...declineStyles
})

export default Button
