import styled from '@emotion/styled'
import React, { Children } from 'react'
import CardSymbols from './CardSymbols'
import Checkbox from './Checkbox'
import Colors from './Colors'

function CardFilterBar ({ disabled, onChange }) {
  const values = React.useRef({})

  function handleChange (filter, filterValues) {
    values.current[filter] = {
      ...values.current[filter],
      ...filterValues
    }

    onChange && onChange(values.current)
  }

  return (
    <>
      <FilterSection disabled={disabled} rows={2} columns={3} label={'Color'} onChange={(values) => handleChange('color', values)}>
        <FilterItem value={'c:white'}><CardSymbols.Plains />White</FilterItem>
        <FilterItem value={'c:blue'}><CardSymbols.Island />Blue</FilterItem>
        <FilterItem value={'c:red'}><CardSymbols.Mountain />Red</FilterItem>
        <FilterItem value={'c:green'}><CardSymbols.Forest />Green</FilterItem>
        <FilterItem value={'c:black'}><CardSymbols.Swamp />Black</FilterItem>
        <FilterItem value={'c:colorless'}><CardSymbols.Colorless />Colorless</FilterItem>
      </FilterSection>
      <FilterSection disabled={disabled} rows={2} columns={2} label={'Type'} onChange={(values) => handleChange('color', values)}>
        <FilterItem value={'c:multicolor'}><CardSymbols.Multicolor />Multicolor</FilterItem>
        <FilterItem value={'t:land'}><CardSymbols.Land />Land</FilterItem>
        <FilterItem value={'t:artifact'}><CardSymbols.Artifact />Artifact</FilterItem>
      </FilterSection>
      <FilterSection disabled={disabled} rows={2} columns={2} label={'Rarity'} onChange={(values) => handleChange('rarity', values)}>
        <FilterItem value={'r:mythic'}><span style={{ color: Colors.mythic }}>Mythic</span></FilterItem>
        <FilterItem value={'r:rare'}><span style={{ color: Colors.rare }}>Rare</span></FilterItem>
        <FilterItem value={'r:uncommon'}><span style={{ color: Colors.uncommon }}>Uncommon</span></FilterItem>
        <FilterItem value={'r:common'}><span style={{ color: Colors.common }}>Common</span></FilterItem>
      </FilterSection>
      <FilterSection disabled={disabled} rows={2} columns={1} onChange={(values) => handleChange('reserved', values)}>
        <FilterItem  value={'is:reserved'}>Reserved</FilterItem>
      </FilterSection>
    </>
  )
}

function FilterSection ({ onChange, children, ...rest }) {
  const values = React.useRef({})

  function handleChange (checked, value) {
    values.current[value] = checked
    onChange && onChange(values.current)
  }

  return (
    <FilterSectionContainer {...rest}>
      {Children.map(children, (child) => (
        React.cloneElement(child, {
          onChange: (checked) => handleChange(checked, child.props.value)
        })
      ))}
    </FilterSectionContainer>
  )
}

function FilterItem ({ value, children, ...rest }) {
  return (
    <Checkbox value={value} {...rest}>
      {children}
    </Checkbox>
  )
}

const FilterSectionContainer = styled('div')({
  display: 'grid',
  rowGap: 8,
  columnGap: 12,
  position: 'relative',
  ':before': {
    content: '""',
    position: 'absolute',
    bottom: -16,
    width: '100%',
    height: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderStyle: 'solid',
    borderColor: Colors.foregroundDark
  }
}, ({ disabled, rows, columns, label }) => ({
  gridTemplateRows: `repeat(${rows}, 1fr)`,
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  ':after': {
    content: `"${label}"`,
    display: label ? 'block' : 'none',
    fontSize: 14,
    lineHeight: '16px',
    position: 'absolute',
    left: '50%',
    bottom: -22,
    transform: 'translateX(-50%)',
    height: 16,
    padding: '0 8px',
    color: Colors.foregroundDark,
    backgroundColor: Colors.backgroundLight
  },
  div: {
    pointerEvents: disabled ? 'none' : 'auto'
  },
  'div div i': {
    filter: `brightness(${disabled ? 0.55 : 1}) grayscale(${disabled ? 1 : 0})`
  },
  'div label': {
    filter: `brightness(${disabled ? 0.55 : 1})`
  },
  'div label i': {
    filter: `grayscale(${disabled ? 1 : 0})`
  }
}))

export default CardFilterBar
