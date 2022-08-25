import styled from '@emotion/styled'
import React from 'react'
import { Icon } from './Icon'

export function CardSymbol ({ symbol, ...rest }) {
  return <Symbol className={`ms ${symbol} ms-fw ms-cost ms-shadow`} {...rest} />
}

function Multicolor () {
  return (
    <MulticolorSymbol>
      <Icon icon={'circle-o'} style={multicolorStyles} />
    </MulticolorSymbol>
  )
}

const multicolorStyles = {
  fontSize: 18,
  lineHeight: '20px',
  width: 20,
  height: 20
}

const Symbol = styled('i')({
  // fontSize: 15,
  // lineHeight: '20px',
  // width: 20,
  // height: 20
})

const MulticolorSymbol = styled('div')({
  display: 'inline-block',
  width: 20,
  height: 20,
  borderRadius: '100%',
  boxShadow: '-0.06em 0.07em 0 #111, 0 0.06em 0 #111',
  color: 'black',
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
  Multicolor: () => <Multicolor />,
  Colorless: withSymbolData('ms-c')(CardSymbol),
  Land: withSymbolData('ms-land')(CardSymbol)
}

export default CardSymbols
