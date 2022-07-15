import styled from '@emotion/styled'
import React from 'react'

export function CardSymbol ({ symbol, ...rest }) {
  return <Symbol className={`ms ${symbol} ms-fw ms-cost ms-shadow`} {...rest} />
}

const Symbol = styled('i')({
  fontSize: 15,
  lineHeight: '20px',
  width: 20,
  height: 20
})

const Multicolor = styled(Symbol)({
  display: 'inline-block',
  borderRadius: '100%',
  boxShadow: '-0.06em 0.07em 0 #111, 0 0.06em 0 #111',
  backgroundColor: '#D0B569',
  ':after': {
    content: '"🞅"',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontStyle: 'normal',
    fontSize: 19,
    width: 20,
    height: 20,
    color: 'black'
  }
})

function withSymbolData (symbol) {
  return function (WrappedComponent) {
    return function (props) {
      return <WrappedComponent {...props} symbol={symbol} />
    }
  }
}

const CardSymbols = {
  Forest: withSymbolData('ms-g')(CardSymbol),
  Mountain: withSymbolData('ms-r')(CardSymbol),
  Island: withSymbolData('ms-u')(CardSymbol),
  Swamp: withSymbolData('ms-b')(CardSymbol),
  Plains: withSymbolData('ms-w')(CardSymbol),
  Multicolor: withSymbolData('ms-multicolor ms-duo-color')(Multicolor),
  Colorless: withSymbolData('ms-c')(CardSymbol)
}

export default CardSymbols
