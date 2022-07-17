import styled from '@emotion/styled'
import React from 'react'
import CardSymbols from './CardSymbols'
import Colors from './Colors'
import Select, { selectStyles } from './Select'

const colors = [
  { value: 'c:green', label: 'Green', symbol: <CardSymbols.Forest /> },
  { value: 'c:red', label: 'Red', symbol: <CardSymbols.Mountain /> },
  { value: 'c:blue', label: 'Blue', symbol: <CardSymbols.Island /> },
  { value: 'c:black', label: 'Black', symbol: <CardSymbols.Swamp /> },
  { value: 'c:white', label: 'White', symbol: <CardSymbols.Plains /> },
  { value: 'c:multicolor', label: 'Multicolor', symbol: <CardSymbols.Multicolor /> },
  { value: 'c:colorless', label: 'Colorless', symbol: <CardSymbols.Colorless /> }
]

function ColorSelectArray ({ onChange }) {
  const selectedValues = React.useRef([])

  function onClick ({ value, selected }) {
    if (selected) {
      selectedValues.current = [...selectedValues.current, value]
    } else {
      selectedValues.current = selectedValues.current.filter((entry) => entry !== value)
    }

    onChange(selectedValues.current)
  }

  return (
    <ColorSelectArrayContainer>
      {colors.map((entry) => (
        <ColorItem key={entry.value} entry={entry} onClick={onClick} />
      ))}
    </ColorSelectArrayContainer>
  )
}

function ColorItem ({ entry, onClick }) {
  const [selected, setSelected] = React.useState(false)

  function handleClick () {
    setSelected(!selected)
    onClick({ value: entry.value, selected: !selected })
  }

  return (
    <Symbol selected={selected} onClick={handleClick}>
      {entry.symbol}
    </Symbol>
  )
}

const ColorSelectArrayContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  padding: 4,
  borderRadius: 3,
  backgroundColor: Colors.backgroundDark
})

const Symbol = styled('div')({
  boxSizing: 'border-box',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  width: 30,
  height: 30,
  borderRadius: 3,
  ':hover': {
    border: `1px solid ${Colors.borderLight}`
  }
}, ({ selected }) => ({
  border: selected ? `1px solid ${Colors.foregroundDark}` : 'none',
  backgroundColor: selected ? Colors.backgroundLight : Colors.backgroundDark
}))

export default ColorSelectArray
