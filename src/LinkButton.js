import styled from '@emotion/styled'
import Button from './Button'
import Colors from './Colors'

const LinkButton = styled(Button)({
  backgroundColor: 'transparent',
  ':disabled': {
    color: Colors.foregroundDark,
    backgroundColor: 'transparent'
  }
})

export default LinkButton
