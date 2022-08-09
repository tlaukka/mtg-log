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

function ColorSelect ({ onChange, ...rest }) {
  const onSelectChange = React.useCallback(
    (data) => {
      const value = data.map((entry) => entry.value)
      onChange && onChange(value)
    },
    [onChange]
  )

  return (
    <Select
      {...rest}
      isMulti
      isSearchable={false}
      styles={styles}
      options={colors}
      placeholder={'Color...'}
      components={{ Option: ColorOption, MultiValue: ColorMultiValue }}
      onChange={onSelectChange}
    />
  )
}

function ColorOption (props) {
  return (
    <Select.Option {...props}>
      {props.data.symbol}
      <OptionLabel>{props.data.label}</OptionLabel>
    </Select.Option>
  )
}

function ColorMultiValue (props) {
  return (
    <Select.MultiValue {...props}>
      {props.data.symbol}
    </Select.MultiValue>
  )
}

const styles = {
  ...selectStyles,
  container: (provided) => ({
    ...provided,
    // flex: 1,
    // minWidth: 314,
    // maxWidth: 314
    display: 'inline-flex'
  }),
  multiValue: (provided) => ({
    ...selectStyles.multiValue(provided),
    position: 'relative'
  }),
  multiValueLabel: (provided) => ({
    ...selectStyles.multiValueLabel(provided),
    padding: 0,
    paddingLeft: 0
  }),
  multiValueRemove: (provided) => ({
    ...selectStyles.multiValueRemove(provided),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    left: 2,
    width: 24,
    height: 24,
    padding: 0,
    color: Colors.foregroundLight,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    opacity: 0,
    ':hover': {
      opacity: 1
    }
  }),
  menu: (provided) => ({
    ...selectStyles.menu(provided),
    minWidth: 116
  })
}

const OptionLabel = styled('span')({
  marginLeft: 8
})

export default ColorSelect
