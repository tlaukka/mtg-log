import React from 'react'
import styled from '@emotion/styled'
import Colors from './Colors'
import Select, { selectStyles } from './Select'
import GradeTag, { Grade } from './GradeTag'

export const gradeOptions = Object.entries(Grade).reduce((result, [key, value]) => {
  result[key] = { value, label: value.toUpperCase() }
  return result
}, {})

const options = Object.values(gradeOptions)

function GradeSelect ({ isReadOnly, styles = formStyles, size = sizes.md, onChange, ...rest }) {
  const onSelectChange = React.useCallback(
    (data) => {
      onChange && onChange(data.value)
    },
    [onChange]
  )

  return (
    <Select
      {...rest}
      isReadOnly={isReadOnly}
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
      <GradeSelectTag grade={props.data.value} size={props.selectProps.size}>
        {props.data.label}
      </GradeSelectTag>
    </Select.Option>
  )
}

function GradeSingleValue (props) {
  return (
    <Select.SingleValue {...props}>
      <GradeSelectTag
        isReadOnly={props.selectProps.isReadOnly}
        isDisabled={props.data.disabled}
        grade={props.data.value}
        size={props.selectProps.size}
      >
        {props.isDisabled ? '-' : props.data.label}
      </GradeSelectTag>
    </Select.SingleValue>
  )
}

const GradeSelectTag = styled(GradeTag)(({ size, isReadOnly }) => ({
  cursor: isReadOnly ? 'inherit' : 'pointer',
  fontSize: size.fontSize,
  width: size.width,
  height: size.height,
  ':hover': {
    filter: isReadOnly ? 'brightness(1)' : 'brightness(1.1)'
  }
}))

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
  container: (provided, state) => ({
    ...provided,
    width: state.selectProps.size.width
  }),
  control: () => ({
    display: 'contents'
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
  singleValue: (_, state) => ({
    display: 'inline-flex',
    flex: 1,
    overflow: 'visible',
    width: 46,
    filter: `grayscale(${state.isDisabled ? 1 : 0})`
  }),
  menu: (provided) => ({
    ...selectStyles.menu(provided),
    left: -8,
    width: 'auto',
    backgroundColor: Colors.backgroundLight,
    ':before': {
      content: '""',
      position: 'absolute',
      left: 'calc(50% - 6px)',
      top: -6,
      transform: 'translateY(-50%)',
      border: `6px solid ${Colors.backgroundLight}`,
      borderColor: `transparent transparent ${Colors.backgroundLight} transparent`
    }
  })
}

const sizes = {
  sm: {
    fontSize: 12,
    width: 36,
    height: 18
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
