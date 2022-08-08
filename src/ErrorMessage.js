import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Icons from './Icon'
import LinkButton from './LinkButton'

function ErrorMessage ({ onClose, children, ...rest }) {
  return (
    <ErrorMessageContainer {...rest}>
      <LinkButton.Danger onClick={onClose}>
        <Icons.Cross />
      </LinkButton.Danger>
      <ErrorMessageText>
        {children}
      </ErrorMessageText>
    </ErrorMessageContainer>
  )
}

const ErrorMessageContainer = styled('div')({
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
  color: Colors.error,
  button: {
    padding: '0 4px'
  }
})

const ErrorMessageText = styled('div')({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

export default ErrorMessage
