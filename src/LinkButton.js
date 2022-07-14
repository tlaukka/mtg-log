import styled from '@emotion/styled'
import Button, { acceptStyles, dangerStyles, declineStyles } from './Button'
import Colors from './Colors'

const LinkButton = styled(Button)({
  backgroundColor: 'transparent',
  ':disabled': {
    color: Colors.foregroundDark,
    backgroundColor: 'transparent'
  }
})

LinkButton.Accept = styled(LinkButton)({
  ...acceptStyles
})

LinkButton.Danger = styled(LinkButton)({
  ...dangerStyles
})

LinkButton.Decline = styled(LinkButton)({
  ...declineStyles
})

export default LinkButton
