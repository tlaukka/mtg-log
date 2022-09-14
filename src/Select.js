import React from 'react'
import ReactSelect, { components, createFilter } from 'react-select'
import Colors from './Colors'
import Icons from './Icon'

const Select = React.forwardRef(({ isReadOnly, styles = selectStyles, components, ...rest }, ref) => {
  const select = React.useRef()

  React.useImperativeHandle(ref, () => ({
    clear: select.current.clearValue
  }))

  return (
    <ReactSelect
      ref={select}
      isReadOnly={isReadOnly}
      openMenuOnClick={!isReadOnly}
      styles={styles}
      components={{
        DropdownIndicator,
        ClearIndicator,
        Option,
        MultiValue,
        ...components
      }}
      filterOption={createFilter({ ignoreAccents: false })}
      {...rest}
    />
  )
})

function DropdownIndicator({ children, ...props }) {
  return (
    <components.DropdownIndicator {...props}>
      <Icons.ChevronDown />
    </components.DropdownIndicator>
  )
}

function ClearIndicator({ children, ...props }) {
  return (
    <components.ClearIndicator {...props}>
      <Icons.Cross />
    </components.ClearIndicator>
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

function SingleValue({ children, ...props }) {
  return (
    <components.SingleValue {...props}>
      {children}
    </components.SingleValue>
  )
}

function MultiValue({ children, ...props }) {
  return (
    <components.MultiValue {...props}>
      {children}
    </components.MultiValue>
  )
}

export const selectStyles = {
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
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap'
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
  dropdownIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
    fontSize: 22,
    color: Colors.control,
    ':hover': {
      color: Colors.accept
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
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: Colors.foregroundDark
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
    ':hover': {
      color: Colors.foregroundLight
    }
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: Colors.foregroundDark
  })
}

Select.Option = Option
Select.SingleValue = SingleValue
Select.MultiValue = MultiValue

export default Select
