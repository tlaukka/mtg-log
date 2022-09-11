import styled from '@emotion/styled'
import React from 'react'
import { CardSymbol } from './CardSymbols'

function parseCost (cost) {
  return (cost?.match(/(?<=\{).+?(?=\})/g) || []).map((c) => c.replace('/', '').toLowerCase())
}

function getManaSymbols (cost) {
  const splits = cost?.split('//') || []

  const symbols = splits.reduce((result, entry) => {
    if (result.length > 0) {
      result.push('split')
    }

    result.push(...parseCost(entry))
    return result
  }, [])

  return symbols
}

function ManaCost ({ cost }) {
  const symbols = getManaSymbols(cost)

  function renderSymbol (symbol, index) {
    if (symbol === 'split') {
      return <span key={index}>|</span>
    }

    return <CardSymbol key={index} symbol={`ms-${symbol}`} />
  }

  return (
    <ManaCostContainer>
      {symbols.map(renderSymbol)}
    </ManaCostContainer>
  )
}

const ManaCostContainer = styled('div')({
  display: 'flex',
  gap: 3
})

export default ManaCost
