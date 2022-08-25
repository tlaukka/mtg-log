import styled from '@emotion/styled'
import React from 'react'
import { CardSymbol } from './CardSymbols'

function getManaSymbols (cost) {
  return (cost.match(/(?<=\{).+?(?=\})/g) || []).map((c) => c.replace('/', '').toLowerCase())
}

function ManaCost ({ cost }) {
  const symbols = getManaSymbols(cost)

  return (
    <ManaCostContainer>
      {symbols.map((symbol, index) => (
        <CardSymbol key={index} symbol={`ms-${symbol}`} />
      ))}
    </ManaCostContainer>
  )
}

const ManaCostContainer = styled('div')({
  display: 'flex',
  gap: 3
})

export default ManaCost
