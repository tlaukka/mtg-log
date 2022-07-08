import React from 'react'
import ReactSelect, { components, createFilter } from 'react-select'
import Colors from './Colors'

function Select(props) {
  return (
    <ReactSelect
      classNamePrefix={'custom-select'}
      styles={selectStyles}
      components={{ Option, MultiValue }}
      filterOption={createFilter({ ignoreAccents: false })}
      {...props}
    />
  )
}

function Option({ children, ...props }) {
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps
  const newProps = { ...props, innerProps: rest }

  return (
    <components.Option {...newProps}>
      {children}
    </components.Option>
  )
}

function MultiValue({ children, ...props }) {
  return (
    <components.MultiValue {...props}>
      {children}
    </components.MultiValue>
  )
}

const selectStyles = {
  container: (provided) => ({
    ...provided,
    minWidth: 360
  }),
  control: (provided) => ({
    ...provided,
    boxShadow: 'none',
    border: 'none',
    borderRadius: 3,
    backgroundColor: Colors.backgroundDark
  }),
  input: (provided) => ({
    ...provided,
    cursor: 'text',
    fontSize: 13,
    color: Colors.control
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 13,
    color: Colors.foregroundDark
  }),
  multiValue: (provided) => ({
    ...provided,
    padding: 4,
    borderRadius: 3,
    backgroundColor: Colors.backgroundLight
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: 12,
    color: Colors.control
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    cursor: 'pointer',
    color: Colors.control,
    ':hover': {
      color: Colors.decline
    }
  }),
  clearIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
    color: Colors.control,
    ':hover': {
      color: Colors.decline
    }
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
    color: Colors.control,
    ':hover': {
      color: Colors.accept
    }
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: Colors.borderLight
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
    backgroundColor: Colors.backgroundDark
  }),
  option: () => ({
    cursor: 'pointer',
    padding: '4px 8px',
    color: Colors.control,
    backgroundColor: Colors.backgroundDark,
    ':hover': {
      color: Colors.foregroundLight
    }
  })
}

Select.Option = Option
Select.MultiValue = MultiValue

export default Select
