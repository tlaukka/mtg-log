import styled from '@emotion/styled'
import React from 'react'

export function CardSymbol ({ symbol, ...rest }) {
  return <Symbol className={`ms ${symbol} ms-fw ms-cost ms-shadow`} {...rest} />
}

function MulticolorSymbol (props) {
  return <Multicolor className={`ms ms-multicolor ms-duo-color ms-fw ms-cost ms-shadow`} {...props} />
}

const Symbol = styled('i')({
  fontSize: 15,
  lineHeight: '20px',
  width: 20,
  height: 20
})

const Multicolor = styled(Symbol)({
  backgroundColor: '#D0B569'
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
  Multicolor: withSymbolData('ms-multicolor ms-duo-color')(MulticolorSymbol),
  Colorless: withSymbolData('ms-c')(CardSymbol)
}

export default CardSymbols
