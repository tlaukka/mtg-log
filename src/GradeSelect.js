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

function GradeSelect ({ styles = formStyles, size = sizes.md, onChange, ...rest }) {
  const onSelectChange = React.useCallback(
    (data) => {
      onChange && onChange(data.value)
    },
    [onChange]
  )

  return (
    <Select
      {...rest}
      isSearchable={false}
      styles={styles}
      size={size}
      defaultValue={options[1]}
      options={options}
      placeholder={null}
      components={{ Option: GradeOption, SingleValue: GradeSingleValue }}
      onChange={onSelectChange}
    />
  )
}

function GradeOption (props) {
  return (
    <Select.Option {...props}>
      <GradeTag grade={props.data.value} size={props.selectProps.size}>
        {props.data.label}
      </GradeTag>
    </Select.Option>
  )
}

function GradeSingleValue (props) {
  return (
    <Select.SingleValue {...props}>
      <GradeTag grade={props.data.value} size={props.selectProps.size}>
        {props.data.label}
      </GradeTag>
    </Select.SingleValue>
  )
}

export const GradeTag = styled('div')({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  borderRadius: 3,
  color: Colors.backgroundDark,
  ':hover': {
    filter: 'brightness(1.1)'
  }
}, ({ grade, size }) => {
  return {
    fontSize: size.fontSize,
    width: size.width,
    height: size.height,
    backgroundColor: colors[grade]
  }
})

const formStyles = {
  ...selectStyles,
  container: (provided) => ({
    ...provided,
    width: 106
  }),
  valueContainer: (provided) => ({
    ...selectStyles.valueContainer(provided),
    display: 'flex',
    flex: 1,
    padding: '2px 8px'
  }),
  singleValue: () => ({
    flex: 1,
    overflow: 'visible'
  }),
  option: (provided) => ({
    ...selectStyles.option(provided),
    '& div': {
      width: '100%'
    }
  })
}

const inlineStyles = {
  ...selectStyles,
  control: () => ({
    display: 'contents',
    backgroundColor: 'red'
  }),
  dropdownIndicator: () => ({
    display: 'none'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  valueContainer: (provided) => ({
    ...selectStyles.valueContainer(provided),
    display: 'flex',
    flex: 1,
    padding: 0
  }),
  singleValue: () => ({
    flex: 1,
    overflow: 'visible',
    width: 46
  }),
  menu: (provided) => ({
    ...selectStyles.menu(provided),
    left: -8,
    width: 'auto',
    ':before': {
      content: '""',
      position: 'absolute',
      left: 'calc(50% - 6px)',
      top: -6,
      transform: 'translateY(-50%)',
      border: `6px solid ${Colors.backgroundDark}`,
      borderColor: `transparent transparent ${Colors.backgroundDark} transparent`
    }
  })
}

const sizes = {
  sm: {
    fontSize: 12,
    width: 36,
    height: 16
  },
  md: {
    fontSize: 14,
    width: 46,
    height: 24
  },
  lg: {
    fontSize: 16,
    width: 56,
    height: 32
  }
}

function withStyles (styles, size) {
  return function (WrappedComponent) {
    return function (props) {
      return <WrappedComponent {...props} styles={styles} size={size} />
    }
  }
}

GradeSelect.Form = GradeSelect

GradeSelect.Inline = {
  Sm: withStyles(inlineStyles, sizes.sm)(GradeSelect),
  Md: withStyles(inlineStyles, sizes.md)(GradeSelect),
  Lg: withStyles(inlineStyles, sizes.lg)(GradeSelect)
}

export default GradeSelect
