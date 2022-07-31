import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Icons, { Icon } from './Icon'
import Select, { selectStyles } from './Select'

const options = [
  { value: 'compact', label: 'Compact', icon: 'view-headline' },
  { value: 'details', label: 'Details', icon: 'view-agenda' }
]

function TableLayoutSelect ({ menuPlacement = 'top', onChange, ...rest }) {
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
      menuPlacement={menuPlacement}
      styles={styles}
      options={options}
      defaultValue={options[0]}
      placeholder={null}
      components={{ Option: TableLayoutOption, SingleValue: TableLayoutValue }}
      onChange={onSelectChange}
    />
  )
}

function TableLayoutOption (props) {
  return (
    <Select.Option {...props}>
      <Icon icon={props.data.icon} />
      {props.data.label}
    </Select.Option>
  )
}

function TableLayoutValue (props) {
  return (
    <Select.SingleValue {...props}>
      <Icon icon={props.data.icon} />
      {props.data.label}
    </Select.SingleValue>
  )
}

const styles = {
  ...selectStyles,
  container: (provided) => ({
    ...provided,
    padding: '0 6px'
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
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    width: 64,
    height: '100%',
    padding: 0
  }),
  singleValue: (_, state) => ({
    display: 'inline-flex',
    flex: 1,
    overflow: 'visible',
    filter: `grayscale(${state.isDisabled ? 1 : 0})`,
    i: {
      lineHeight: '14px',
      marginRight: 2
    }
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
  }),
  option: (provided) => ({
    ...selectStyles.option(provided),
    i: {
      marginRight: 2
    }
  })
}

export default TableLayoutSelect
