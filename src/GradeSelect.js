import React from 'react'
import styled from '@emotion/styled'
import Colors from './Colors'
import Select, { selectStyles } from './Select'

const colors = {
  m: '#17A2B8',
  nm: '#57BB8A',
  ex: '#ABC978',
  gd: '#FFD666',
  lp: '#F3A96D',
  pl: '#FB5555',
  dmg: '#858585'
}

const options = [
  { value: 'm', label: 'M' },
  { value: 'nm', label: 'NM' },
  { value: 'ex', label: 'EX' },
  { value: 'gd', label: 'GD' },
  { value: 'lp', label: 'LP' },
  { value: 'pl', label: 'PL' },
  { value: 'dmg', label: 'DMG' }
]

function GradeSelect ({ onChange, ...rest }) {
  const onSelectChange = React.useCallback(
    (data) => {
      onChange(data.value)
    },
    [onChange]
  )

  return (
    <Select
      {...rest}
      isSearchable={false}
      styles={styles}
      defaultValue={options[1]}
      options={options}
      placeholder={null}
      components={{ Option: GradeOption, SingleValue: GradeSingleValue }}
      onChange={onSelectChange}
    />
  )
}

export function InlineGradeSelect ({ onSelect }) {
  const [optionsVisible, setOptionsVisible] = React.useState(false)
  const [selected, setSelected] = React.useState(options[1])

  React.useEffect(
    () => {
      function click () {
        setOptionsVisible(false)
      }

      document.body.addEventListener('click', click)

      return () => {
        document.body.removeEventListener('click', click)
      }
    },
    []
  )

  function toggleOptions (e) {
    e.stopPropagation()
    setOptionsVisible(!optionsVisible)
  }

  function handleSelect (e, option) {
    e.stopPropagation()

    setSelected(option)
    setOptionsVisible(false)

    onSelect && onSelect(option)
  }

  return (
    <GradeTagContainer>
      <GradeTag grade={selected.value} onClick={toggleOptions}>
        {selected.label}
      </GradeTag>
      {optionsVisible && (
        <OptionsContainer>
          {options.map((option) => (
            <GradeTag key={option.value} grade={option.value} onClick={(e) => handleSelect(e, option)}>
              {option.label}
            </GradeTag>
          ))}
        </OptionsContainer>
      )}
    </GradeTagContainer>
  )
}

function GradeOption (props) {
  return (
    <Select.Option {...props}>
      <GradeTag grade={props.data.value}>{props.data.label}</GradeTag>
    </Select.Option>
  )
}

function GradeSingleValue (props) {
  return (
    <Select.SingleValue {...props}>
      <GradeTag grade={props.data.value}>{props.data.label}</GradeTag>
    </Select.SingleValue>
  )
}

const GradeTagContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  width: 46,
  padding: 8,
  borderRadius: 3,
  backgroundColor: Colors.backgroundDark
})

const OptionsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  position: 'absolute',
  zIndex: 10,
  top: 'calc(100% + 8px)',
  width: 46,
  padding: 8,
  borderRadius: 4,
  backgroundColor: Colors.backgroundDark,
  ':before': {
    content: '""',
    position: 'absolute',
    left: 'calc(50% - 3px)',
    top: -6,
    transform: 'translateY(-50%)',
    marginLeft: -5,
    border: `6px solid ${Colors.backgroundDark}`,
    borderColor: `transparent transparent ${Colors.backgroundDark} transparent`
  }
})

const GradeTag = styled('div')({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  padding: '4px 8px',
  borderRadius: 3,
  color: Colors.backgroundDark,
  ':hover': {
    filter: 'brightness(1.1)'
  }
}, ({ grade }) => ({
  backgroundColor: colors[grade]
}))

const styles = {
  ...selectStyles,
  container: (provided) => ({
    ...provided,
    width: 106
  }),
  valueContainer: () => ({
    ...selectStyles.valueContainer(),
    display: 'flex',
    flex: 1,
    padding: '2px 8px'
  }),
  singleValue: () => ({
    flex: 1,
    overflow: 'visible'
  }),
  option: () => ({
    ...selectStyles.option()
  })
}

export default GradeSelect
