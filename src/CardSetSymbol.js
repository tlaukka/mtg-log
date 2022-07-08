import React from 'react'

function CardSetSymbol ({ code, ...rest }) {
  return <i className={`ss ss-${code}`} {...rest} />
}

export default CardSetSymbol
