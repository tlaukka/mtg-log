import styled from '@emotion/styled'
import Button, { acceptStyles, dangerStyles } from './Button'
import Colors from './Colors'

const LinkButton = styled(Button)({
  backgroundColor: 'transparent',
  ':disabled': {
    color: Colors.foregroundDark,
    backgroundColor: 'transparent'
  }
})

LinkButton.Danger = styled(LinkButton)({
  ...dangerStyles
})

LinkButton.Accept = styled(LinkButton)({
  ...acceptStyles
})

export default LinkButton
