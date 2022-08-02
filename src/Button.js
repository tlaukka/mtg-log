import styled from '@emotion/styled'
import Colors from './Colors'

export const buttonSize = {
  small: {
    lineHeight: '24px',
    height: 24
  },
  default: {
    lineHeight: '32px',
    height: 32
  },
  large: {
    lineHeight: '38px',
    height: 38
  }
}

const Button = styled('button')({
  cursor: 'pointer',
  fontSize: 12,
  letterSpacing: 0.4,
  whiteSpace: 'nowrap',
  padding: '0px 12px',
  outline: 'none',
  border: 'none',
  borderRadius: 3,
  color: Colors.control,
  backgroundColor: Colors.backgroundDark,
  ':hover:enabled': {
    color: Colors.link
  },
  ':disabled': {
    cursor: 'default',
    color: Colors.foregroundDark
  }
}, ({ size = 'default' }) => ({
  lineHeight: buttonSize[size].lineHeight,
  height: buttonSize[size].height
}))

export const acceptStyles = {
  color: Colors.accept,
  ':hover:enabled': {
    color: Colors.acceptLight
  }
}

export const dangerStyles = {
  color: Colors.decline,
  ':hover:enabled': {
    color: Colors.declineLight
  }
}

export const declineStyles = {
  ':hover:enabled': {
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
