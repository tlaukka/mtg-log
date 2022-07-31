import styled from '@emotion/styled'
import React from 'react'

function CardSetSymbol ({ code, size, fixedWidth = true, color = 'inherit', ...rest }) {
  return (
    <SymbolContainer size={size} color={color} {...rest}>
      <i className={`ss ss-${code} ${fixedWidth ? 'ss-fw' : ''}`}></i>
    </SymbolContainer>
  )
}

const SymbolContainer = styled('span')({
  display: 'inline-flex',
}, ({ size, color }) => ({
  fontSize: size,
  color
}))

export default CardSetSymbol
