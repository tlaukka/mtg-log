import styled from '@emotion/styled'
import React from 'react'

export function CardSymbol ({ symbol, ...rest }) {
  return <i className={`ms ${symbol} ms-fw ms-cost ms-shadow`} {...rest} />
}

function Artifact (props) {
  return (
    <CardSymbol {...props} symbol={'ms-artifact'} style={artifactStyles} />
  )
}

function Land (props) {
  return (
    <CardSymbol {...props} symbol={'ms-land'} style={landStyles} />
  )
}

const artifactStyles = {
  backgroundColor: '#946D63'
}

const landStyles = {
  backgroundColor: '#948163'
}

const MultiColor = styled('i')({
  position: 'relative',
  fontSize: '0.95em',
  width: '1.3em',
  height: '1.3em',
  borderRadius: '100%',
  boxShadow: '-0.06em 0.07em 0 #111, 0 0.06em 0 #111',
  backgroundColor: '#D0B569',
  ':after': {
    content: '""',
    boxSizing: 'border-box',
    position: 'absolute',
    top: '10%',
    right: '10%',
    bottom: '10%',
    left: '10%',
    borderRadius: '1em',
    border: '2px solid black'
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
  Multicolor: () => <MultiColor />,
  Colorless: withSymbolData('ms-c')(CardSymbol),
  Artifact: () => <Artifact />,
  Land: () => <Land />
}

export default CardSymbols
